import { Router } from "express";
import { body, validationResult } from "express-validator";
import { handleInputErrors } from "./modules/middleware";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "./handlers/product";
import {
  createProvider,
  deleteProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
} from "./handlers/providers";

const router = Router();
/**
 * Product
 */
/**
 * Handles HTTP GET requests to retrieve all products.
 * @returns {void}
 */
router.get("/product", getAllProducts);

/**
 * Handles HTTP GET requests to retrieve a specific product by its ID.
 * @param {string} req.params.id - The ID of the product to retrieve.
 * @returns {void}
 */
router.get("/product/:id", getProduct);

/**
 * Handles HTTP POST requests to create a new product.
 * Validates the request body using express-validator middleware.
 * Calls the createProduct handler function if the validation passes.
 * @param {string} req.body.name - The name of the product.
 * @param {number} req.body.price - The price of the product.
 * @param {string} req.body.description - The description of the product.
 * @param {string} req.body.providerId - The ID of the provider for the product
 * @returns {void}
 */
router.post(
  "/product",
  body("name").exists().isString(),
  body("price").exists().isFloat(),
  body("description").exists().isString(),
  body("providerId").exists().isString(),
  handleInputErrors,
  createProduct
);

/**
 * Handles HTTP PUT requests to update an existing product.
 * Validates the request body using express-validator middleware.
 * Calls the updateProduct handler function if the validation passes.
 * @param {string} req.params.id - The ID of the product to update.
 * @returns {void}
 */
router.put(
  "/product/:id",
  body("name").exists().isString(),
  body("price").exists().isFloat(),
  body("description").exists().isString(),
  body("providerId").exists().isString(),
  handleInputErrors,
  updateProduct
);

/**
 * Handles HTTP DELETE requests to delete a specific product by its ID.
 * @param {string} req.params.id - The ID of the product to delete.
 * @returns {void}
 */
router.delete("/product/:id", deleteProduct);

/**
 * Provider
 */

/**
 * Handles HTTP GET requests to retrieve all providers.
 *
 * @returns {void}
 */
router.get("/provider", getAllProviders);

/**
 * Handles HTTP GET requests to retrieve a specific provider by its ID.
 *
 * @param {string} req.params.id - The ID of the provider to retrieve.
 *
 * @returns {void}
 */
router.get("/provider/:id", getProviderById);

/**
 * Handles HTTP POST requests to create a new provider.
 * Validates the request body using express-validator middleware.
 * Calls the createProvider handler function if the validation passes.
 * @param {string} req.body.name - The name of the provider.
 * @param {string} req.body.description - The description of the provider.
 * @param {string} req.body.address - The address of the provider.
 * @param {string} req.body.phone - The phone number of the provider.
 * @returns {void}
 **/
router.post(
  "/provider",
  body("name").exists().isString(),
  body("description").exists().isString(),
  body("address").exists().isString(),
  body("phone").exists().isString(),
  handleInputErrors,
  createProvider
);

/**
 * Handles HTTP PUT requests to update an existing provider.
 * Validates the request body using express-validator middleware.
 * Calls the updateProvider handler function if the validation passes.
 * @param {string} req.params.id - The ID of the provider to update.
 * @returns {void}
 **/
router.put(
  "/provider/:id",
  body("name").exists().isString(),
  body("description").exists().isString(),
  body("address").exists().isString(),
  body("phone").exists().isString(),
  handleInputErrors,
  updateProvider
);

/**
 * Handles HTTP DELETE requests to delete a specific provider by its ID.
 * @param {string} req.params.id - The ID of the provider to delete.
 * @returns {void}
 */
router.delete("/provider/:id", deleteProvider);

/**
 * Error handling middleware for the Express application.
 * This middleware is responsible for handling errors that occur during the request processing.
 * It checks the type of error and sends an appropriate response with a corresponding status code and error message.
 *
 * @param err - The error object that contains information about the error.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 *
 * @returns {void}
 */
router.use((err, req, res, next) => {
  if (err.type === "auth") {
    res.status(401).json({ error: "Unauthorized" });
  } else if (err.type === "input") {
    res.status(400).json({ error: "Invalid input" });
  } else {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
