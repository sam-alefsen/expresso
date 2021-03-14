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

timesheetsRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Timesheet WHERE employee_id = $employeeId', {$employeeId:req.params.employeeId}, (err, rows) => {
    if(err) {
      next(err);
    } else {
      res.status(200).json({timesheets:rows});
    }
  });
});

module.exports = timesheetsRouter;