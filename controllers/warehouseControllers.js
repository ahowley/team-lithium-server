const knex = require("knex")(require("../knexfile"));

exports.deleteWarehouse = (req, res) => {
  knex("warehouses")
    .where("id", req.params.warehouse_id)
    .delete()
    .then(() => {
      res
        .status(200)
        .send(
          `Warehouse with id ${req.params.warehouse_id} has been deleted successfully`
        );
    })
    .catch((err) => {
      res
        .status(500)
        .json({'message':`There was an error deleting warehouse ${req.params.warehouse_id}`,
        'error': err})
    });
};

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

exports.getSingleWarehouse = (req, res) => {
  knex("warehouses")
    .where({ id: req.params.warehouse_id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res
        .status(500)
        .json({'message':`Error retrieving warehouse ${req.params.warehouse_id}`,
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

exports.addWarehouse = (req, res) => {
  if (
    !req.body.id ||
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    res.status(400).json({
      message: `Error: Invalid/Incomplete Request`,
    });
  } else {
    knex("warehouses")
      .insert(req.body)
      .then((newInventoryId) => {
        res.status(201).json(newInventoryId[0]);
      })
      .catch(() => {
        res.status(400).json({
          message: `Error adding Inventory Item `,
        });
      });
  }
};


exports.editWarehouse = (req, res) => {
  if(
    !req.body.id ||
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    res.status(400).json({
      message: `Error: Invalid/Incomplete request`
    })
  } else {
    knex("warehouses")
    .where({ id: req.params.warehouse_id })
    .update(req.body)
    .then((data) => {
      res.sendStatus(200);
    })
    .catch(() => {
      res.status(400)
      .json({'message':`Error editing warehouse ${req.params.warehouse_id}`,
      'error': err})
    });
  }
  
};
