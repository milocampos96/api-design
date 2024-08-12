import prisma from "../modules/db";

export const getAllProviders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const orderBy = req.query.orderBy || "createdAt";
    const sortOrder = req.query.sortOrder || "asc";
    const filterProperty = req.query.filterProperty;
    const filterValue = req.query.filterValue;

    const providers = await prisma.provider.findMany({
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
      },
    });

    res.status(201).json({ data: providers });
  } catch (error) {
    next(error);
  }
};

export const getProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await prisma.provider.findUnique({ where: { id } });
    if (!provider) {
      return res
        .status(404)
        .json({ message: "Provider not found", type: "input" });
    }
    res.status(200).json({ data: provider });
  } catch (error) {
    next(error);
  }
};

export const createProvider = async (req, res, next) => {
  try {
    const { name, phone, address, description } = req.body;
    const newProvider = await prisma.provider.create({
      data: {
        name,
        phone,
        address,
        description,
      },
    });
    res.status(201).json({ data: newProvider });
  } catch (error) {
    next(error);
  }
};

export const updateProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, address, description } = req.body;
    const updatedProvider = await prisma.provider.update({
      where: { id },
      data: { name, phone, address, description },
    });
    if (!updatedProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json({ data: updatedProvider });
  } catch (error) {
    next(error);
  }
};

export const deleteProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProvider = await prisma.provider.delete({ where: { id } });
    if (!deletedProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json({ message: "Provider deleted successfully" });
  } catch (error) {
    next(error);
  }
};
