const express = require('express'),
  sqlite3 = require('sqlite3');
const { NamedModulesPlugin } = require('webpack');
const menusRouter = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//GET all menus
menusRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu', (err, rows) => {
    if(err) {
      next(err);
    } else {
      res.status(200).json({menus:rows});
    };
  });
});

module.exports = menusRouter;