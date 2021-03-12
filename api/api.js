const express = require('express')
  , sqlite3 = require('sqlite3');

const apiRouter = express.Router();

//import and mount employees router
const employeesRouter = require('./employees');
apiRouter.use('/employees', employeesRouter);

module.exports = apiRouter;