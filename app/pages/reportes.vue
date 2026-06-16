<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const selectedPeriod = ref('month')
const selectedWarehouse = ref<string | undefined>(undefined)

const periodOptions = [
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mes' },
  { value: 'quarter', label: 'Este Trimestre' },
  { value: 'year', label: 'Este Ano' },
]

const warehouses = ['Almacen Principal', 'Refrigerado', 'Congelados', 'Materia Prima']

// Mock data for reports
const inventoryValue = {
  total: 125400,
  change: 8.5,
  byCategory: [
    { name: 'Lacteos', value: 35200, percentage: 28 },
    { name: 'Carnes', value: 28600, percentage: 23 },
    { name: 'Aceites', value: 22100, percentage: 18 },
    { name: 'Panaderia', value: 18500, percentage: 15 },
    { name: 'Otros', value: 21000, percentage: 16 },
  ],
}

const movementStats = {
  entries: { count: 245, value: 45600 },
  exits: { count: 312, value: 38900 },
  adjustments: { count: 18, value: -2300 },
}

const topProducts = [
  { rank: 1, name: 'Queso Mozzarella 500g', sku: 'QUE-001', movements: 156, value: 13260 },
  { rank: 2, name: 'Harina de Trigo 1kg', sku: 'HAR-001', movements: 142, value: 3550 },
  { rank: 3, name: 'Aceite de Oliva 1L', sku: 'ACE-001', movements: 128, value: 15360 },
  { rank: 4, name: 'Salsa de Tomate 500ml', sku: 'SAL-001', movements: 115, value: 3680 },
  { rank: 5, name: 'Jamon Serrano', sku: 'JAM-001', movements: 98, value: 24500 },
]

const lowStockAlerts = [
  { name: 'Levadura Fresca', stock: 5, minStock: 20, daysToZero: 2 },
  { name: 'Jamon Serrano', stock: 3, minStock: 10, daysToZero: 1 },
  { name: 'Pimientos Rojos', stock: 8, minStock: 25, daysToZero: 4 },
  { name: 'Anchoas', stock: 2, minStock: 15, daysToZero: 1 },
]

const reportTypes = [
  { id: 'inventory', label: 'Inventario General', icon: 'i-lucide-package', description: 'Stock actual de todos los productos' },
  { id: 'movements', label: 'Movimientos', icon: 'i-lucide-arrow-left-right', description: 'Historial de entradas y salidas' },
  { id: 'valuation', label: 'Valoracion', icon: 'i-lucide-dollar-sign', description: 'Valor del inventario por categoria' },
  { id: 'rotation', label: 'Rotacion', icon: 'i-lucide-refresh-cw', description: 'Analisis de rotacion de productos' },
  { id: 'low-stock', label: 'Stock Bajo', icon: 'i-lucide-alert-triangle', description: 'Productos por debajo del minimo' },
  { id: 'suppliers', label: 'Proveedores', icon: 'i-lucide-truck', description: 'Compras por proveedor' },
]

function generateReport(reportId: string) {
  // TODO: Implement report generation
  console.log('Generating report:', reportId)
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Reportes">
        <template #right>
          <div class="flex gap-2">
            <USelectMenu
              v-model="selectedPeriod"
              :items="periodOptions"
              value-key="value"
              class="w-40"
            />
            <USelectMenu
              v-model="selectedWarehouse"
              :items="warehouses"
              placeholder="Todos los almacenes"
              class="w-48"
            />
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-6">
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Valor del Inventario</p>
                <p class="mt-1 text-2xl font-semibold text-default">${{ inventoryValue.total.toLocaleString() }}</p>
                <div class="mt-2 flex items-center gap-1 text-sm">
                  <UIcon name="i-lucide-trending-up" class="size-4 text-emerald-500" />
                  <span class="text-emerald-500">+{{ inventoryValue.change }}%</span>
                </div>
              </div>
              <div class="rounded-lg bg-emerald-500/10 p-3">
                <UIcon name="i-lucide-dollar-sign" class="size-6 text-emerald-500" />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Entradas</p>
                <p class="mt-1 text-2xl font-semibold text-default">{{ movementStats.entries.count }}</p>
                <p class="mt-2 text-sm text-muted">${{ movementStats.entries.value.toLocaleString() }}</p>
              </div>
              <div class="rounded-lg bg-blue-500/10 p-3">
                <UIcon name="i-lucide-package-plus" class="size-6 text-blue-500" />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Salidas</p>
                <p class="mt-1 text-2xl font-semibold text-default">{{ movementStats.exits.count }}</p>
                <p class="mt-2 text-sm text-muted">${{ movementStats.exits.value.toLocaleString() }}</p>
              </div>
              <div class="rounded-lg bg-amber-500/10 p-3">
                <UIcon name="i-lucide-package-minus" class="size-6 text-amber-500" />
              </div>
            </div>
          </UCard>

          <UCard>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted">Alertas Stock</p>
                <p class="mt-1 text-2xl font-semibold text-red-500">{{ lowStockAlerts.length }}</p>
                <p class="mt-2 text-sm text-muted">productos criticos</p>
              </div>
              <div class="rounded-lg bg-red-500/10 p-3">
                <UIcon name="i-lucide-alert-triangle" class="size-6 text-red-500" />
              </div>
            </div>
          </UCard>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Inventory by Category -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-default">Valor por Categoria</h3>
            </template>
            <div class="space-y-4">
              <div v-for="category in inventoryValue.byCategory" :key="category.name" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-default">{{ category.name }}</span>
                  <span class="font-semibold text-default">${{ category.value.toLocaleString() }}</span>
                </div>
                <UProgress :value="category.percentage" color="primary" size="sm" />
              </div>
            </div>
          </UCard>

          <!-- Top Products -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold text-default">Productos con Mayor Movimiento</h3>
            </template>
            <div class="space-y-3">
              <div v-for="product in topProducts" :key="product.sku" class="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <div class="flex items-center gap-3">
                  <div class="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {{ product.rank }}
                  </div>
                  <div>
                    <p class="font-medium text-default">{{ product.name }}</p>
                    <p class="text-xs text-muted">{{ product.sku }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-default">{{ product.movements }}</p>
                  <p class="text-xs text-muted">movimientos</p>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Low Stock Alerts -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-alert-triangle" class="size-5 text-amber-500" />
              <h3 class="text-lg font-semibold text-default">Alertas de Stock Bajo</h3>
            </div>
          </template>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="alert in lowStockAlerts" :key="alert.name" class="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <div class="flex items-start justify-between">
                <div>
                  <p class="font-medium text-default">{{ alert.name }}</p>
                  <p class="text-sm text-muted">Stock: {{ alert.stock }} / {{ alert.minStock }}</p>
                </div>
                <UBadge color="error" :label="`${alert.daysToZero}d`" variant="subtle" />
              </div>
              <UButton
                class="mt-3"
                size="xs"
                icon="i-lucide-shopping-cart"
                label="Crear pedido"
                variant="outline"
                block
              />
            </div>
          </div>
        </UCard>

        <!-- Generate Reports -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-default">Generar Reportes</h3>
          </template>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="report in reportTypes"
              :key="report.id"
              class="flex items-start gap-3 rounded-lg border border-default bg-elevated p-4 text-left transition-colors hover:bg-muted"
              @click="generateReport(report.id)"
            >
              <div class="rounded-lg bg-primary/10 p-2">
                <UIcon :name="report.icon" class="size-5 text-primary" />
              </div>
              <div>
                <p class="font-medium text-default">{{ report.label }}</p>
                <p class="text-sm text-muted">{{ report.description }}</p>
              </div>
            </button>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
