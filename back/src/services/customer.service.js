import prisma from '../../prisma/client.js'
import { normalizeName } from '../utils/normalize.js'

export const getCustomers = async () => {
  return prisma.customer.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
  })
}

export const getCustomerById = async (id) => {
  return prisma.customer.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      customerProducts: {
        include: {
          product: {
            select: { id: true, name: true },
          },
        },
      },
    },
  })
}

export const createCustomer = async ({ name, productIds }) => {
  return prisma.customer.create({
    data: {
      name,
      name_normalized: normalizeName(name),

      customerProducts: productIds?.length
        ? {
            create: productIds.map((pid) => ({
              product: { connect: { id: Number(pid) } },
            })),
          }
        : undefined,
    },
  })
}

export const updateCustomer = async (id, { name, productIds }) => {
  const data = {}

  if (name !== undefined) {
    data.name = name
    data.name_normalized = normalizeName(name)
  }

  if (productIds !== undefined) {
    data.customerProducts = {
      deleteMany: {}, // reset
      create: productIds.map((pid) => ({
        product: { connect: { id: Number(pid) } },
      })),
    }
  }

  return prisma.customer.update({
    where: { id },
    data,
  })
}

export const softDeleteCustomer = async (id) => {
  return prisma.customer.update({
    where: { id },
    data: { deletedAt: new Date() },
  })
}