const knex = require("knex")(require("../knexfile"));


exports.getAllInventory = (req, res) => {
    knex("inventories")
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err =>
            res.status(400).json({ message: `There was an error getting inventory`, error: err }),
        );
};

exports.getSingleInventory = (req, res) => {
    knex("inventories")
        .where({ id: req.params.inventory_id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                message: `There was an error getting inventory ${req.params.inventory_id}`,
                error: err,
            });
        });
};

exports.addInventoryItem = (req, res) => {
    if (
        !req.body.id ||
        !req.body.warehouse_id ||
        !req.body.item_name ||
        !req.body.description ||
        !req.body.category ||
        !req.body.status ||
        !req.body.quantity
    ) {
        res.status(400).json({
            message: `Error: Invalid/Incomplete Request`,
        });
    } else {
        knex("inventories")
            .insert(req.body)
            .then(newInventoryId => {
                res.status(201).json(newInventoryId[0]);
            })
            .catch(() => {
                res.status(400).json({
                    message: `Error adding Inventory Item `,
                });
            });
    }
};

