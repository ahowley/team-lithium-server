const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));

router.get("/:id/inventories", async (req, res) => {
    try {
        const inventories = await knex("inventories").where({ warehouse_id: req.params.id });

        if (inventories.length === 0) {
            return res.status(404).json({ message: "No inventory found" });
        }

        return res.status(200).json(inventories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error - self destruct" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const foundWarehouse = await knex("warehouses").where({ id: req.params.id });

        if (foundWarehouse.length === 0) {
            return res.status(404).json({
                message: `Warehouse with ID ${req.params.id} not found`,
            });
        }
        return res.status(200).json(foundWarehouse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error - self destruct" });
    }
});

module.exports = router;
