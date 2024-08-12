import prisma from "../modules/db";

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
