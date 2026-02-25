import { PrismaClient } from '../generated/prisma/index.js'
import { normalizeName } from '../utils/normalize.js'

const prisma = new PrismaClient()

export const createProduct = async ({ name }) => {
  return prisma.product.create({
    data: {
      name,
      name_normalized: normalizeName(name),
    },
  })
}

export const updateProduct = async (id, { name }) => {
  return prisma.product.update({
    where: { id },
    data: {
      name,
      name_normalized: normalizeName(name),
    },
  })
}

export const softDeleteProduct = async (id) => {
  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}

export const getProductById = async (id) => {
  return prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  })
}

export const getProducts = async () => {
  return prisma.product.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
  })
}