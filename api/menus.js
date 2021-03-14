const express = require('express'),
  sqlite3 = require('sqlite3');
const menusRouter = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//Check menu ID parameter
menusRouter.param('menuId', (req, res, next, menuId) => {
  db.get('SELECT * FROM Menu WHERE id = $menuId', {$menuId:menuId}, (err, menu) => {
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

//GET menu by ID
menusRouter.get('/:menuId', (req, res, next) => {
  const menuId = req.params.menuId;
  db.get('SELECT * FROM Menu WHERE id = $menuId', {$menuId:menuId}, (err, row) => {
    if(err) {
      next(err);
    } else {
      res.status(200).json({menu:row});
    }
  })
});

//POST a new menu
menusRouter.post('/', (req, res, next) => {
  const title = req.body.menu.title;
  if(!title) {
    return res.sendStatus(400);
  };

  db.run('INSERT INTO Menu (title) VALUES ($title)', {$title:title}, function(err) {
    if(err) {
      next(err);
    } else {
      db.get('SELECT * FROM Menu WHERE id = $lastID', {$lastID:this.lastID}, (err, row) => {
        if(err) {
          next(err);
        } else {
          res.status(201).json({menu:row});
        };
      });
    }
  });
});

module.exports = menusRouter;