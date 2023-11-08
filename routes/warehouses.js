const fs = require("fs");
const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");
const warehouseController = require("../controllers/warehouseControllers");

router.route("/").get(warehouseController.getAllWarehouses).post(warehouseController.addWarehouse);

router
    .route("/:warehouse_id")
    .get(warehouseController.getSingleWarehouse)
    .put(warehouseController.editWarehouse)
    .delete(warehouseController.deleteWarehouse);

router.route("/:warehouse_id/inventory").get(warehouseController.getInventoryForWarehouse);

module.exports = router;
