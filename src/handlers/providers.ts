import prisma from "../modules/db";

/**
 * Retrieves a list of providers based on pagination, sorting, and filtering criteria.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if any database operation fails.
 *
 * @remarks
 * The function accepts query parameters for pagination, sorting, and filtering.
 * It uses the Prisma client to fetch the providers based on the provided criteria.
 * The response includes the retrieved providers in the 'data' property.
 *
 * @example
 * GET /providers?page=1&pageSize=10&orderBy=name&sortOrder=desc&filterProperty=name&filterValue=Evergreen%20Energy
 */
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
        phone: true,
        address: true,
      },
    });

    res.status(201).json({ data: providers });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a single provider by its ID.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if the provider is not found or if any database operation fails.
 *
 * @remarks
 * This function accepts a provider ID as a parameter in the request's URL parameters.
 * It uses the Prisma client to fetch the provider with the given ID.
 * If the provider is found, it is returned in the 'data' property of the response.
 * If the provider is not found, a 404 status code is returned with an appropriate error message.
 *
 */
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

/**
 * Creates a new provider in the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if any database operation fails.
 *
 * @remarks
 * This function accepts a provider object in the request's body.
 * It uses the Prisma client to create a new provider record in the database.
 * If the operation is successful, the newly created provider is returned in the 'data' property of the response.
 *
 */
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

/**
 * Updates an existing provider in the database.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if the provider is not found or if any database operation fails.
 *
 * @remarks
 * This function accepts a provider ID and an updated provider object in the request's URL parameters and body, respectively.
 * It uses the Prisma client to update the provider record with the given ID in the database.
 * If the operation is successful, the updated provider is returned in the 'data' property of the response.
 * If the provider is not found, a 404 status code is returned with an appropriate error message.
 *
 */
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

/**
 * Deletes a provider from the database by its ID.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 *
 * @returns {Promise<void>}
 *
 * @throws Will throw an error if the provider is not found or if any database operation fails.
 *
 * @remarks
 * This function accepts a provider ID as a parameter in the request's URL parameters.
 * It uses the Prisma client to delete the provider with the given ID from the database.
 * If the operation is successful, a 200 status code is returned with a success message.
 * If the provider is not found, a 404 status code is returned with an appropriate error message.
 *
 */
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
