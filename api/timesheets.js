const express = require('express'),
  sqlite3 = require('sqlite3');
const timesheetsRouter = express.Router({mergeParams:true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//check timesheet Id parameter
timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
  const sql = 'SELECT * FROM Timesheet WHERE id = $timesheetId';
  const values = {$timesheetId:timesheetId};
  db.get(sql, values, (err, timesheet) => {
    if(err) {
      next(err);
    } else if(row) {
      req.timesheet = timesheet;
      next();
    } else {
      res.sendStatus(404);
    };
  });
});

//GET all timesheets
timesheetsRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Timesheet WHERE employee_id = $employeeId', {$employeeId:req.params.employeeId}, (err, rows) => {
    if(err) {
      next(err);
    } else {
      res.status(200).json({timesheets:rows});
    }
  });
});


//POST new timesheet
timesheetsRouter.post('/', (req, res, next) => {
  const hours = req.body.timesheet.hours,
    rate = req.body.timesheet.rate,
    date = req.body.timesheet.date,
    employeeId = req.params.employeeId;
  if(!hours || !rate || !date) {
    return res.sendStatus(400);
  };

  const sql = 'INSERT INTO Timesheet (hours, rate, date, employee_id) Values ($hours, $rate, $date, $employeeId)';
  const values = {
    $hours:hours,
    $rate:rate,
    $date:date,
    $employeeId:employeeId
  };

  db.run(sql, values, function(err) {
    if(err) { 
      next(err);
    } else {
      db.get('SELECT * FROM Timesheet WHERE id = $lastID', {$lastID:this.lastID}, (err, row) => {
        if(err) {
          next(err);
        } else {
          res.status(201).json({timesheet:row});
        };
      });
    };
  });
});

module.exports = timesheetsRouter;