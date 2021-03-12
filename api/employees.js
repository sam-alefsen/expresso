const express = require('express')
  , sqlite3 = require('sqlite3');

const employeesRouter = express.Router();

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

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

//POST all employees
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

module.exports = employeesRouter;