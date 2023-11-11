const express = require("express");
const { validationResult, matchedData } = require("express-validator");
const { postWarehouseValidator, postValidator } = require("../utility/validators");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));

router.get("/:id/inventories", async (req, res) => {
    try {
        const inventoriesByWarehouse = await knex("inventories")
            .where({ warehouse_id: req.params.id })
            .select("inventories.id", "item_name", "category", "status", "quantity");

        if (inventoriesByWarehouse.length === 0) {
            return res.status(404).json({ message: "No inventory found" });
        }

        return res.status(200).json(inventoriesByWarehouse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error - self destruct" });
    }
});

router.put("/:id", ...postValidator(), ...postWarehouseValidator(), async (req, res) => {
    const warehouseId = req.params.id;
    const warehouseToUpdate = await knex("warehouses").where({ id: warehouseId });
    if (!warehouseToUpdate.length) {
        return res
            .status(404)
            .json({ message: `No warehouse was found with the id ${warehouseId}` });
    }

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "PUT metadata for a new warehouse failed validation.",
            errors: validationErrors.array(),
        });
    }

    const {
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
    } = matchedData(req);
    await knex("warehouses").where({ id: warehouseId }).update({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
    });
    const updatedWarehouse = await knex("warehouses").where({ id: warehouseId });
    res.status(200).json(updatedWarehouse[0]);
});

router.get("/:id", async (req, res) => {
    try {
        const foundWarehouse = await knex("warehouses").where({ id: req.params.id });

        if (foundWarehouse.length === 0) {
            return res.status(404).json({
                message: `Warehouse with ID ${req.params.id} not found`,
            });
        }
        return res.status(200).json(foundWarehouse[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error - self destruct" });
    }
});

router.get("/", (req, res) => {
    knex("warehouses")
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(400).json({
                message: `There was an error getting warehouse data`,
                error: err,
            });
        });
});

router.post("/", ...postValidator(), ...postWarehouseValidator(), async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "POST metadata for a new video failed validation.",
            errors: validationErrors.array(),
        });
    }
    const {
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
    } = matchedData(req);

    const newWarehouseIds = await knex("warehouses").insert([
        {
            warehouse_name,
            address,
            city,
            country,
            contact_name,
            contact_position,
            contact_phone,
            contact_email,
        },
    ]);
    const createdWarehouse = await knex("warehouses").where({ id: newWarehouseIds[0] });

    res.status(201).json(createdWarehouse);
});

router.delete("/:id", async (req, res) => {
    try {
        const deleteWarehouse = await knex("warehouses").where({ id: req.params.id }).delete();

        if (deleteWarehouse === 0) {
            return res.status(404).json({
                message: `Warehouse with ID ${req.params.id} not found`,
            });
        }
        return res.status(204).json(deleteWarehouse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error - self destruct" });
    }
});

router.delete("/:warehouseId/inventories/:itemId", async (req, res) => {
    const { warehouseId, itemId } = req.params;

    try {
        const itemInWarehouse = await knex("inventories")
            .where({ id: itemId, warehouse_id: warehouseId })
            .first();

        if (!itemInWarehouse) {
            return res.status(404).json({
                message: `Item with ID ${itemId} not found in warehouse with ID ${warehouseId}`,
            });
        }

        await knex("inventories").where({ id: itemId }).delete();

        return res.status(204).json();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
