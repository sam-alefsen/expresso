const express = require('express'),
  sqlite3 = require('sqlite3');
const timesheetsRouter = express.Router();
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

module.exports = timesheetsRouter;