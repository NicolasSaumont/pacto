import { PrismaClient } from '../src/generated/prisma/index.js' // chemin vers ton client généré

const prisma = new PrismaClient()

async function main() {
  // Création des clients
  const alice = await prisma.customer.create({
    data: {
      name: 'Alice',
      name_normalized: 'alice'
    }
  })

  const bob = await prisma.customer.create({
    data: {
      name: 'Bob',
      name_normalized: 'bob'
    }
  })

  // Création des produits
  // const potion = await prisma.product.create({ data: { name: 'Potion' } })
  // const elixir = await prisma.product.create({ data: { name: 'Elixir' } })

  // Création d'une commande pour Alice avec 2 potions
  // await prisma.order.create({
  //   data: {
  //     customerId: alice.id,
  //     orderDate: new Date('2026-02-20'),
  //     orderProducts: {
  //       create: [
  //         { productId: potion.id, quantity: 2 }
  //       ]
  //     }
  //   }
  // })

  // Création d'une commande pour Bob avec 1 élixir
  // await prisma.order.create({
  //   data: {
  //     customerId: bob.id,
  //     orderDate: new Date('2026-02-22'),
  //     orderProducts: {
  //       create: [
  //         { productId: elixir.id, quantity: 1 }
  //       ]
  //     }
  //   }
  // })

  console.log('✅ Seed terminé !')
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })