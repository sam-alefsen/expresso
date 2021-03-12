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

module.exports = employeesRouter;