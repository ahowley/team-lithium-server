const express = require("express");
const { validationResult, matchedData } = require("express-validator");
const { postItemValidator, postValidator } = require("../utility/validators");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));

router.post("/", ...postValidator(), ...postItemValidator(), async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "POST metadata for a new item failed validation.",
            errors: validationErrors.array(),
        });
    }
    const { warehouse_id, item_name, description, category, status, quantity } = matchedData(req);

    const newItemsIds = await knex("inventories").insert([
        {
            warehouse_id: warehouse_id,
            item_name: item_name,
            description: description,
            category: category,
            status: status,
            quantity: quantity,
        },
    ]);
    const createdItem = await knex("inventories").where({ id: newItemsIds[0] });

    res.status(201).json(createdItem);
});

router.put("/:id", ...postValidator(), ...postItemValidator(), async (req, res) => {
    const itemToUpdate = await knex("inventories").where({ id: req.params.id });
    if (!itemToUpdate.length) {
        return res.status(404).json({ message: `No item was found with the id ${req.params.id}` });
    }

    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "PUT metadata for a new item failed validation.",
            errors: validationErrors.array(),
        });
    }
    const { item_name, description, category, status, quantity } = matchedData(req);

    await knex("inventories")
        .where({
            id: req.params.id,
        })
        .update({
            item_name,
            description,
            category,
            status,
            quantity,
        });
    const updatedItem = await knex("inventories").where({ id: req.params.id });

    res.status(200).json(updatedItem[0]);
});

router.get("/", async (req, res) => {
    const inventories = await knex("warehouses")
        .join("inventories", "inventories.warehouse_id", "warehouses.id")
        .select("inventories.id", "item_name", "category", "status", "quantity", "warehouse_name");

    return res.status(200).json(inventories);
});

router.get("/categories", async (req, res) => {
    const categories = await knex("inventories").distinct("category");
    return res.status(200).json(categories.map(cat => cat.category).sort());
});

router.get("/:id", async (req, res) => {
    const itemToUpdate = await knex("inventories").where({ id: req.params.id });
    if (!itemToUpdate.length) {
        return res.status(404).json({ message: `No item was found with the id ${req.params.id}` });
    }

    const inventoryJoin = await knex("warehouses")
        .join("inventories", "inventories.warehouse_id", "warehouses.id")
        .where({ "inventories.id": req.params.id })
        .select(
            "item_name",
            "description",
            "category",
            "status",
            "quantity",
            "warehouse_id",
            "warehouse_name",
        );

    return res.status(200).json(inventoryJoin[0]);
});

router.delete("/:id", async (req, res) => {
    try {
        const deleteInventory = await knex("inventories").where({ id: req.params.id }).delete();

        if (deleteInventory === 0) {
            return res.status(404).json({
                message: `Inventory with ID ${req.params.id} not found.. self destruct initiated`,
            });
        }
        return res.status(204).json(deleteInventory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error - self destruct" });
    }
});

module.exports = router;
