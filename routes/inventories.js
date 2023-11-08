const fs = require("fs");
const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const inventoryController = require("../controllers/inventoryControllers");

router
    .route("/")
    .get(inventoryController.getAllInventory)
    .post(inventoryController.addInventoryItem);

router
    .route("/:inventory_id")
    .get(inventoryController.getSingleInventory)
    .delete(inventoryController.deleteInventoryItem)
    .put(inventoryController.editInventoryItem);

module.exports = router;
