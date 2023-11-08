const { body, header } = require("express-validator");

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

const postItemValidator = () => [
    requiredField("warehouse_id"),
    requiredField("item_name"),
    requiredField("description"),
    requiredField("category"),
    requiredField("status"),
    requiredField("quantity"),
];

module.exports = { postValidator, postItemValidator };
