const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const warehousesRoute = require("./routes/warehouses");
const inventoriesRoute = require("./routes/inventories");
dotenv.config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use("/api/warehouses", warehousesRoute);
app.use("/api/inventories", inventoriesRoute);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}!`));
