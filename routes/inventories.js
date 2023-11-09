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
            message: "PATCH metadata for a new item failed validation.",
            errors: validationErrors.array(),
        });
    }
    const { item_name, description, category, status, quantity } = matchedData(req);

    const updatedItems = await knex("inventories")
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

    res.status(201).json(updatedItem);
});

module.exports = router;
