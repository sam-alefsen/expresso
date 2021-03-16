const express = require('express'),
  sqlite3 = require('sqlite3');
const menuItemsRouter = express.Router({mergeParams:true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//check menu items ID parameter
menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  db.get('SELECT * FROM MenuItem WHERE menuItmeId = $menuItemId', {$menuItemId:menuItemId}, (err, row) => {
    if(err) {
      next(err);
    } else if (row) {
      req.menuItemId = menuItemId;
      next();
    } else {
      res.sendStatus(404);
    };
  });
});

//GET all menu items
menuItemsRouter.get('/', (req, res, next) => {
  const menuId = req.params.menuId;
  db.all('SELECT * FROM MenuItem WHERE menu_id = $menuId', {$menuId:menuId}, (err, rows) => {
    if(err) {
      next(err);
    } else {
      res.status(200).json({menuItems:rows});
    };
  });
});

module.exports = menuItemsRouter;