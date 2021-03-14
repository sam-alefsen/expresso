const express = require('express')
  , sqlite3 = require('sqlite3');

const employeesRouter = express.Router();

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Check employee ID parameter
employeesRouter.param('employeeId', (req, res, next, employeeId) => {
  db.get('SELECT * FROM Employee WHERE Employee.id = $employeeId', {$employeeId:employeeId}, (err, row) => {
    if (err) {
      next(err);
    } else if (row) {
      req.employee = row;
      next();
    } else {
      res.sendStatus(404);
    };
  });
});

//GET all employees
employeesRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Employee WHERE is_current_employee = 1`, (err, rows) => {
    if(err) {
      next(err);
    } else {
      res.status(200).json({employees:rows});
    };
  });
});

//GET employee by ID
employeesRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).json({employee:req.employee});
});

//POST a new employee
employeesRouter.post('/', (req, res, next) => {
  const name = req.body.employee.name,
    position = req.body.employee.position,
    wage = req.body.employee.wage,
    isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
  if(!name || !position || !wage) {
    return res.sendStatus(400);
  };

  //backtick notation returns deprecation warning [DEP0097]
  db.run('INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)', {
    $name: name,
    $position: position,
    $wage: wage,
    $isCurrentEmployee: isCurrentEmployee
  }, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`,
        (err, employee) => {
          res.status(201).json({employee: employee});
        });
    };
  });
});

//Update an employee
employeesRouter.put('/:employeeId', (req, res, next) => {
  const name = req.body.employee.name,
  position = req.body.employee.position,
  wage = req.body.employee.wage,
  isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
  if(!name || !position || !wage) {
    return res.sendStatus(400);
  };

  db.serialize(() => {
    //check if employee with specified ID exists
    const checkSql = 'SELECT * FROM Employee WHERE id = $employeeId';
    const checkValues = {$employeeId:req.params.employeeId};
    db.get(checkSql, checkValues, (err, row) => {
      if(err) {
        next(err);
      } else if(row.length < 1) {
        return res.sendStatus(400);
      };
    });

    //update employee
    const putSql = 'UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee';
    const putValues = {
      $name: name,
      $position: position,
      $wage: wage,
      $isCurrentEmployee: isCurrentEmployee
    };
    db.run(putSql, putValues, (err) => {
      if(err) {
        next(err);
      };
    });

    //GET updated employee and send response
    db.get(checkSql, checkValues, (err, row) => {
      if(err) {
        next(err);
      } else {
        res.status(200).json({employee:row});
      };
    });
  });
});

//DELETE an employee (change to no longer current)
employeesRouter.delete('/:employeeId', (req, res, next) => {
  const employeeId = req.params.employeeId;
  db.serialize(() => {
    
    //check if employee exists
    const checkSql = 'SELECT * FROM Employee WHERE id = $employeeId';
    const values = {$employeeId:employeeId};
    db.get(checkSql, values, (err, row) => {
      if(err) {
        next(err);
      } else if (row.length > 1) {
        return res.sendStatus(404);
      };
    });

    //set employee as not current
    const deleteSql = 'UPDATE Employee SET is_current_employee = 0 WHERE id = $employeeId';
    db.run(deleteSql, values, (err) => {
      if (err) {
        next(err);
      };
    });

    //GET employee and send response
    db.get(checkSql, values, (err, row) => {
      if(err) {
        next(err);
      } else {
        res.status(200).json({employee:row});
      };
    });
  });
});

module.exports = employeesRouter;