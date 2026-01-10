<script setup lang='ts'>

interface IProduct {
  id: number
  name: string
  date: string
  products: number
  total: string
}

const columns: IColumn<IProduct>[] = [
  {
    header: 'Client',
    key: 'name',
  },
  {
    header: 'Date',
    key: 'date',
  },
  {
    header: 'Produits',
    key: 'products',
  },
  {
    header: 'Total',
    key: 'total',
  },
]

const data: IProduct[] = [
  {
    id: 1,
    name: 'Boucherie Martin',
    date: '05/01/2026',
    products: 8,
    total: '42 kg',
  },
  {
    id: 2,
    name: 'Boucherie Dupont',
    date: '10/01/2026',
    products: 5,
    total: '30 kg',
  },
  {
    id: 3,
    name: 'Boucherie Bernard',
    date: '15/01/2026',
    products: 12,
    total: '60 kg',
  },
]
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header />
    <Table :columns :data />
  </div>
</template>