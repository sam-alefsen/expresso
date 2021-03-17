const express = require('express'),
  sqlite3 = require('sqlite3');
const menuItemsRouter = express.Router({mergeParams:true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

//check menu items ID parameter
menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
  db.get('SELECT * FROM MenuItem WHERE id = $menuItemId', {$menuItemId:menuItemId}, (err, row) => {
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

//POST a new menu item
menuItemsRouter.post('/', (req, res, next) => {
  const name = req.body.menuItem.name,
    description = req.body.menuItem.description,
    inventory = req.body.menuItem.inventory,
    price = req.body.menuItem.price,
    menuId = req.params.menuId;
  if(!name || !inventory || !price) {
    return res.sendStatus(400);
  };
  
  db.serialize(() => {
    const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)';
    const values = {
      $name:name,
      $description:description,
      $inventory:inventory,
      $price:price,
      $menuId:menuId
    };
    db.run(sql, values, function(err) {
      if(err) {
        next(err);
      } else {
        db.get('SELECT * FROM MenuItem WHERE id = $lastID', {$lastID:this.lastID}, (err, row) => {
          res.status(201).json({menuItem:row});
        });
      };
    });
  });
});

//Update a menu item
menuItemsRouter.put('/:menuItemId', (req, res, next) => {
  const id = req.params.menuItemId,
    name = req.body.menuItem.name,
    description = req.body.menuItem.description,
    inventory = req.body.menuItem.inventory,
    price = req.body.menuItem.price;
  if(!name || !inventory || !price) {
    return res.sendStatus(400);
  };

  db.serialize(() => {
    const sql = 'UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price WHERE id = $id';
    const values = {
      $name:name,
      $description:description,
      $inventory:inventory,
      $price:price,
      $id:id
    };
    db.run(sql, values, (err) => {
      if(err) {
        next(err);
      };
    });

    db.get('SELECT * FROM MenuItem WHERE id = $id', {$id:id}, (err, row) => {
      if(err) {
        next(err);
      } else {
        res.status(200).json({menuItem:row});
      };
    });
  });
});

module.exports = menuItemsRouter;