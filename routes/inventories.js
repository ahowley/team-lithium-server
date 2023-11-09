const fs = require("fs");
const express = require("express");
const { validationResult, matchedData } = require("express-validator");
const { postItemValidator, postValidator } = require("../utility/validators");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));

router.post("/", ...postValidator(), ...postItemValidator(), async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({
            message: "POST metadata for a new video failed validation.",
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
const { v4: uuid } = require("uuid");
const inventoryController = require("../controllers/inventoryControllers");

router
    .route("/")
    .get(inventoryController.getAllInventory)
    
router
    .route("/:inventory_id")
    .get(inventoryController.getSingleInventory)
module.exports = router;
