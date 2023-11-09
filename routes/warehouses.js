const fs = require("fs");
const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const warehouseController = require("../controllers/warehouseControllers");

router.route("/").get(warehouseController.getAllWarehouses);

router
    .route("/:warehouse_id")
    .get(warehouseController.getSingleWarehouse);

router.route("/:warehouse_id/inventory").get(warehouseController.getInventoryForWarehouse);

module.exports = router;
