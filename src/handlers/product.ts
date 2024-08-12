import prisma from "../modules/db";

/**
 * Retrieves a list of products based on pagination, sorting, and filtering criteria.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if the database operation fails.
 *
 * @remarks
 * The function accepts query parameters for pagination, sorting, and filtering.
 * It returns a JSON response with the retrieved products or an error message.
 *
 * Query parameters:
 * - page: The page number for pagination (default: 1).
 * - pageSize: The number of products per page (default: 5).
 * - orderBy: The property to sort by (default: createdAt).
 * - sortOrder: The order to sort by (default: asc).
 * - filterProperty: The property to filter by.
 * - filterValue: The value to filter by.
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const orderBy = req.query.orderBy || "createdAt";
    const sortOrder = req.query.sortOrder || "asc";
    const filterProperty = req.query.filterProperty;
    const filterValue = req.query.filterValue;

    const products = await prisma.product.findMany({
      where: filterProperty ? { [filterProperty]: filterValue } : {},
      orderBy: {
        [orderBy]: sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
      },
    });
    if (!products) {
      return res.status(404).json({ error: "Products not found" });
    }
    res.status(201).json({ data: products });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single product by its ID.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if the database operation fails.
 *
 * @remarks
 * The function accepts a product ID as a parameter in the request's URL parameters.
 * It retrieves the product from the database and returns a JSON response with the product data.
 * If the product is not found, it returns a 404 status code with an error message.
 *
 */
export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({ where: { id } });
    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found", type: "input" });
    }
    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new product in the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if the database operation fails.
 *
 * @remarks
 * The function accepts product data in the request's body.
 * It validates the provider ID and creates a new product in the database.
 * If the provider is not found, it returns a 404 status code with an error message.
 * If the product creation fails, it returns a 400 status code with an error message.
 * Otherwise, it returns a 201 status code with the created product data.
 *
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, providerId } = req.body;
    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      return res
        .status(404)
        .json({ error: "Provider not found", type: "input" });
    }
    const newProduct = await prisma.product.create({
      data: { name, price, description, providerId },
    });
    if (!newProduct) {
      return res.status(400).json({ error: "Failed to create product" });
    }
    res.status(201).json({ data: newProduct });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an existing product in the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if the database operation fails.
 *
 * @remarks
 * The function accepts a product ID as a parameter in the request's URL parameters.
 * It also accepts product data in the request's body.
 * It updates the product in the database with the provided data.
 * If the product is not found, it returns a 404 status code with an error message.
 * Otherwise, it returns a 201 status code with the updated product data.
 *
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, description, providerId } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price, description, providerId },
    });
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ error: "Product not found", type: "input" });
    }
    res.status(201).json({ data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a product from the database by its ID.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if the database operation fails.
 *
 * @remarks
 * The function accepts a product ID as a parameter in the request's URL parameters.
 * It deletes the product from the database.
 * If the product is not found, it returns a 404 status code with an error message.
 * Otherwise, it returns a 201 status code with the deleted product data.
 *
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.product.delete({ where: { id } });
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Product not found", type: "input" });
    }
    res.status(201).json({ data: deleted });
  } catch (error) {
    next(error);
  }
};
