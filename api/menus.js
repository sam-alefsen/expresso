const express = require('express'),
  sqlite3 = require('sqlite3');
const { NamedModulesPlugin } = require('webpack');
const menusRouter = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Check menu ID parameter
menusRouter.param('menuId', (req, res, next, menuId) => {
  db.get('SELECT * FROM Menu WHERE id = $menuId', (err, menu) => {
    if(err) {
      next(err);
    } else if(menu) {
      req.menu = menu;
      next();
    } else {
      res.sendStatus(404);
    };
  });
});

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