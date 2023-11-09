const fs = require("fs");
const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const inventoryController = require("../controllers/inventoryControllers");

router
    .route("/")
    .get(inventoryController.getAllInventory)
    
router
    .route("/:inventory_id")
    .get(inventoryController.getSingleInventory)
module.exports = router;
