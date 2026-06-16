<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'

definePageMeta({ layout: 'dashboard' })

// Mock data for dashboard
const stats = [
  { label: 'Total Productos', value: '1,234', icon: 'i-lucide-package', change: '+12%', trend: 'up' },
  { label: 'Stock Bajo', value: '23', icon: 'i-lucide-alert-triangle', change: '-5%', trend: 'down' },
  { label: 'Movimientos Hoy', value: '89', icon: 'i-lucide-arrow-left-right', change: '+28%', trend: 'up' },
  { label: 'Valor Total', value: '$125,400', icon: 'i-lucide-dollar-sign', change: '+8%', trend: 'up' },
]

const recentMovements = [
  { id: 1, product: 'Harina de Trigo 1kg', type: 'entrada', quantity: 50, date: '2024-01-15', warehouse: 'Almacen Principal' },
  { id: 2, product: 'Salsa de Tomate 500ml', type: 'salida', quantity: 30, date: '2024-01-15', warehouse: 'Almacen Principal' },
  { id: 3, product: 'Queso Mozzarella 500g', type: 'entrada', quantity: 25, date: '2024-01-15', warehouse: 'Refrigerado' },
  { id: 4, product: 'Aceite de Oliva 1L', type: 'salida', quantity: 15, date: '2024-01-14', warehouse: 'Almacen Principal' },
  { id: 5, product: 'Oregano 100g', type: 'entrada', quantity: 100, date: '2024-01-14', warehouse: 'Almacen Principal' },
]

const { getProducts } = useProducts()

const lowStockProducts = ref<any[]>([])

onMounted(async () => {
  try {
    const data = await getProducts()
    if (data) {
      lowStockProducts.value = data.filter(p => p.stock <= p.minStock).slice(0, 5)
    }
  } catch (e) {
    console.error('Error fetching low stock products:', e)
  }
})

const movementColumns = [
  { accessorKey: 'product', header: 'Producto' },
  { accessorKey: 'type', header: 'Tipo' },
  { accessorKey: 'quantity', header: 'Cantidad' },
  { accessorKey: 'warehouse', header: 'Almacen' },
  { accessorKey: 'date', header: 'Fecha' },
]

const lowStockColumns = [
  { accessorKey: 'name', header: 'Producto' },
  { accessorKey: 'stock', header: 'Stock Actual' },
  { accessorKey: 'minStock', header: 'Stock Minimo' },
  { accessorKey: 'category', header: 'Categoria' },
  { id: 'actions', header: '' },
]

const isNewProductModalOpen = ref(false)

const newProduct = ref({
  sku: '',
  name: '',
  category: '',
  warehouse: '',
  unit: '',
  quantity: 0,
  stock: 0,
  minStock: 0,
  price: 0,
  cost: 0,
  isVariable: false
})

const units = ['Unidades', 'Kilos', 'Litros', 'Metros']
const categories = ['Panaderia', 'Salsas', 'Lacteos', 'Aceites', 'Embutidos', 'Verduras', 'Especias', 'Conservas']
const warehouses = ['Almacen Principal', 'Refrigerado', 'Congelados']

function saveNewProduct() {
  const toast = useToast()
  toast.add({ title: 'Producto guardado', description: 'El producto se ha guardado correctamente (Demo visual)', color: 'success' })
  isNewProductModalOpen.value = false
  // Reset form
  newProduct.value = {
    sku: '',
    name: '',
    category: '',
    warehouse: '',
    unit: '',
    quantity: 0,
    stock: 0,
    minStock: 0,
    price: 0,
    cost: 0,
    isVariable: false
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #right>
          <UButton icon="i-lucide-plus" label="Nuevo Producto" @click="isNewProductModalOpen = true" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-6">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard v-for="stat in stats" :key="stat.label" class="relative overflow-hidden">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-sm text-muted">{{ stat.label }}</p>
                <p class="mt-1 text-2xl font-semibold text-default">{{ stat.value }}</p>
                <div class="mt-2 flex items-center gap-1 text-sm">
                  <UIcon
                    :name="stat.trend === 'up' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
                    :class="stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'"
                    class="size-4"
                  />
                  <span :class="stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'">
                    {{ stat.change }}
                  </span>
                  <span class="text-muted">vs mes anterior</span>
                </div>
              </div>
              <div class="rounded-lg bg-primary/10 p-2">
                <UIcon :name="stat.icon" class="size-6 text-primary" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Tables Section -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Recent Movements -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-default">Movimientos Recientes</h3>
                <UButton variant="ghost" size="sm" label="Ver todos" to="/movimientos" />
              </div>
            </template>

            <UTable :data="recentMovements" :columns="movementColumns">
              <template #type-cell="{ row }">
                <UBadge
                  :color="row.original.type === 'entrada' ? 'success' : 'warning'"
                  :label="row.original.type === 'entrada' ? 'Entrada' : 'Salida'"
                  variant="subtle"
                />
              </template>
              <template #quantity-cell="{ row }">
                <span :class="row.original.type === 'entrada' ? 'text-emerald-500' : 'text-amber-500'">
                  {{ row.original.type === 'entrada' ? '+' : '-' }}{{ row.original.quantity }}
                </span>
              </template>
            </UTable>
          </UCard>

          <!-- Low Stock Alert -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-alert-triangle" class="size-5 text-amber-500" />
                  <h3 class="text-lg font-semibold text-default">Productos con Stock Bajo</h3>
                </div>
                <UButton variant="ghost" size="sm" label="Ver todos" to="/productos?filter=low-stock" />
              </div>
            </template>

            <UTable :data="lowStockProducts" :columns="lowStockColumns">
              <template #stock-cell="{ row }">
                <UBadge color="error" :label="String(row.original.stock)" variant="subtle" />
              </template>
              <template #actions-cell="{ row }">
                <UButton
                  icon="i-lucide-shopping-cart"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  title="Crear orden de compra"
                />
              </template>
            </UTable>
          </UCard>
        </div>

        <!-- Quick Actions -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-default">Acciones Rapidas</h3>
          </template>
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <UButton
              icon="i-lucide-package-plus"
              label="Registrar Entrada"
              variant="outline"
              color="neutral"
              block
              class="justify-start"
            />
            <UButton
              icon="i-lucide-package-minus"
              label="Registrar Salida"
              variant="outline"
              color="neutral"
              block
              class="justify-start"
            />
            <UButton
              icon="i-lucide-clipboard-list"
              label="Inventario Fisico"
              variant="outline"
              color="neutral"
              block
              class="justify-start"
            />
            <UButton
              icon="i-lucide-file-text"
              label="Generar Reporte"
              variant="outline"
              color="neutral"
              block
              class="justify-start"
            />
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Modal Nuevo Producto -->
  <UModal v-model:open="isNewProductModalOpen" title="Nuevo Producto">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="SKU" name="sku">
            <UInput v-model="newProduct.sku" placeholder="HAR-001" />
          </UFormField>
          <UFormField label="Nombre" name="name">
            <UInput v-model="newProduct.name" placeholder="Nombre del producto" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Categoria" name="category">
            <USelectMenu v-model="newProduct.category" :items="categories" placeholder="Seleccionar" />
          </UFormField>
          <UFormField label="Almacen" name="warehouse">
            <USelectMenu v-model="newProduct.warehouse" :items="warehouses" placeholder="Seleccionar" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Unidad de Medida" name="unit">
            <USelectMenu v-model="newProduct.unit" :items="units" placeholder="Seleccionar" />
          </UFormField>
          <UFormField label="Peso / Cantidad" name="quantity">
            <UInput v-model.number="newProduct.quantity" type="number" step="0.01" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Stock Actual" name="stock">
            <UInput v-model.number="newProduct.stock" type="number" />
          </UFormField>
          <UFormField label="Stock Minimo" name="minStock">
            <UInput v-model.number="newProduct.minStock" type="number" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Precio de Venta" name="price">
            <UInput v-model.number="newProduct.price" type="number" step="0.01" icon="i-lucide-dollar-sign" />
          </UFormField>
          <UFormField label="Costo" name="cost">
            <UInput v-model.number="newProduct.cost" type="number" step="0.01" icon="i-lucide-dollar-sign" />
          </UFormField>
        </div>

        <UFormField label="Producto Variable" name="isVariable" description="Indica si este producto tiene diferentes variantes (tallas, colores, etc.)">
          <USwitch v-model="newProduct.isVariable" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isNewProductModalOpen = false" />
        <UButton label="Guardar Producto" @click="saveNewProduct" />
      </div>
    </template>
  </UModal>
</template>
