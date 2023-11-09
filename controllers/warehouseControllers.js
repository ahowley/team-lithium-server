const knex = require("knex")(require("../knexfile"));


exports.getAllWarehouses = (req, res) => {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400)
      .json({'message':`There was an error getting warehouse data`,
        'error': err})
    });
};


exports.getInventoryForWarehouse = (req, res) => {
  knex("inventories")
    .where({ warehouse_id: req.params.warehouse_id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res
        .status(500)
        .json({'message':`Error retrieving warehouse inventory for warehouse ${req.params.warehouse_id}`,
        'error': err})
    });
};



