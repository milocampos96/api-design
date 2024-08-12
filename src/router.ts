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
router.get("/product", getAllProducts);

router.get("/product/:id", getProduct);

router.post(
  "/product",
  body("name").exists().isString(),
  body("price").exists().isFloat(),
  body("description").exists().isString(),
  body("providerId").exists().isString(),
  handleInputErrors,
  createProduct
);

router.put(
  "/product/:id",
  body("name").exists().isString(),
  body("price").exists().isFloat(),
  body("description").exists().isString(),
  body("providerId").exists().isString(),
  handleInputErrors,
  updateProduct
);

router.delete("/product/:id", deleteProduct);

/**
 * Provider
 */
router.get("/provider", getAllProviders);

router.get("/provider/:id", getProviderById);

router.post(
  "/provider",
  body("name").exists().isString(),
  body("description").exists().isString(),
  body("address").exists().isString(),
  body("phone").exists().isString(),
  handleInputErrors,
  createProvider
);

router.put(
  "/provider/:id",
  body("name").exists().isString(),
  body("description").exists().isString(),
  body("address").exists().isString(),
  body("phone").exists().isString(),
  handleInputErrors,
  updateProvider
);

router.delete("/provider/:id", deleteProvider);

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
