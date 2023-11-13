const { body, header } = require("express-validator");
const knex = require("knex")(require("../knexfile"));

const requiredField = fieldName =>
    body(fieldName, `${fieldName} is a required field, but is empty in the request.`)
        .escape()
        .trim()
        .notEmpty();

const postValidator = () => [
    header("content-type", "content-type header must be 'application/json'.").matches(
        /application\/json/i,
    ),
    body("", "Request body must be formatted as a JSON object.").isObject(),
];

const removeNonDigits = value => value.replace(/\D/g, "");

const isValidPhoneNumber = digits => [10, 11].includes(digits.length);

const formatPhoneNumber = digits => {
    const countryCode = digits.length === 11 ? `+${digits[0]} ` : "";
    if (countryCode) digits = digits.slice(1);

    const areaCode = `(${digits.slice(0, 3)}) `;
    digits = digits.slice(3);

    const lastSeven = [digits.slice(0, 3), digits.slice(3)].join("-");

    return `${countryCode}${areaCode}${lastSeven}`;
};

const isValidWarehouseId = async id => {
    const warehouseIds = await knex("warehouses").select("id");
    return warehouseIds.includes(id);
};

const isValidStatus = status => {
    return ["In Stock", "Out of Stock"].includes(status);
};

const postItemValidator = () => [
    body("warehouse_id", "warehouse_id not found")
        .escape()
        .trim()
        .notEmpty()
        .isInt()
        .custom(isValidWarehouseId),
    requiredField("item_name"),
    requiredField("description"),
    requiredField("category"),
    body("status", "status must be either 'In Stock' or 'Out of Stock'")
        .escape()
        .trim()
        .notEmpty()
        .custom(isValidStatus),
    requiredField("quantity"),
    body("quantity", "quantity must be an integer").escape().trim().notEmpty().isInt(),
];

const postWarehouseValidator = () => [
    requiredField("warehouse_name"),
    requiredField("address"),
    requiredField("city"),
    requiredField("country"),
    requiredField("contact_name"),
    requiredField("contact_position"),
    body("contact_phone", "contact_phone must contain a 10 or 11 digit phone number")
        .escape()
        .trim()
        .notEmpty()
        .customSanitizer(removeNonDigits)
        .custom(isValidPhoneNumber)
        .customSanitizer(formatPhoneNumber),
    body("contact_email", "contact_email must be a correctly formatted email address")
        .escape()
        .trim()
        .notEmpty()
        .isEmail(),
];

module.exports = { postValidator, postItemValidator, postWarehouseValidator };
