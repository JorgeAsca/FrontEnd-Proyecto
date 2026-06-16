<script setup lang="ts">
import { useProducts, type Product } from '~/composables/useProducts'
import { useProveedores, type Proveedor } from '~/composables/useProveedores'
import { useEmpresas } from '~/composables/useEmpresas'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isModalOpen = ref(false)
const searchQuery = ref('')

const { getProducts, updateProduct } = useProducts()
const { getProveedores } = useProveedores()
const { getEmpresas } = useEmpresas()

const products = ref<Product[]>([])
const suppliers = ref<Proveedor[]>([])

onMounted(async () => {
  try {
    const dataProducts = await getProducts()
    if (dataProducts) products.value = dataProducts

    const empresas = await getEmpresas()
    if (empresas && empresas.length > 0) {
      const currentEmpresaId = empresas[0].id_empresa
      const dataSuppliers = await getProveedores(currentEmpresaId)
      if (dataSuppliers) suppliers.value = dataSuppliers
    }
  } catch (error) {
    toast.add({ title: 'Error cargando datos', color: 'error' })
  }
})

const currentProduct = ref<Partial<Product>>({
  id: '',
  nombre: '',
  stockMinimo: 0,
  proveedorId: ''
})

const supplierOptions = computed(() => {
  const options = suppliers.value.map(s => ({ value: s.id, label: s.razon_social }))
  options.unshift({ value: '', label: 'Ninguno' })
  return options
})

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  return products.value.filter(p =>
    p.nombre?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const columns = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'nombre', header: 'Producto' },
  { accessorKey: 'stock', header: 'Stock Actual' },
  { accessorKey: 'stockMinimo', header: 'Stock Minimo (Alerta)' },
  { accessorKey: 'proveedor', header: 'Proveedor Asignado' },
  { id: 'actions', header: '' },
]

function getSupplierName(proveedorId?: string) {
  if (!proveedorId) return 'No asignado'
  const sup = suppliers.value.find(s => s.id === proveedorId)
  return sup ? sup.razon_social : 'No asignado'
}

function openEditModal(product: Product) {
  currentProduct.value = { 
    id: product.id,
    nombre: product.nombre,
    stockMinimo: product.stockMinimo || 0,
    proveedorId: product.proveedorId || ''
  }
  isModalOpen.value = true
}

async function saveStockAlert() {
  if (!currentProduct.value.id) return

  try {
    const payload = {
      stockMinimo: currentProduct.value.stockMinimo,
      proveedorId: currentProduct.value.proveedorId === '' ? null : currentProduct.value.proveedorId
    }

    const updated = await updateProduct(currentProduct.value.id, payload)
    if (updated) {
      const index = products.value.findIndex(p => p.id === currentProduct.value.id)
      if (index !== -1) {
        products.value[index] = { ...products.value[index], ...payload }
      }
      toast.add({ title: 'Alerta actualizada', icon: 'i-lucide-check', color: 'success' })
    }
    isModalOpen.value = false
  } catch (error: any) {
    toast.add({ title: 'Error al actualizar', description: error.message, color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Stock y Alertas">
        <template #right>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Buscar productos..."
            class="w-64"
          />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6">
        <UCard>
          <UTable :data="filteredProducts" :columns="columns">
            <template #sku-cell="{ row }">
              <span class="font-mono text-sm text-muted">{{ row.original.sku }}</span>
            </template>
            <template #nombre-cell="{ row }">
              <span class="font-medium text-default">{{ row.original.nombre }}</span>
            </template>
            <template #stock-cell="{ row }">
              <span :class="{'text-error font-bold': row.original.stock <= (row.original.stockMinimo || 0)}">
                {{ row.original.stock }} {{ row.original.unidadMedida || 'Ud' }}
              </span>
            </template>
            <template #stockMinimo-cell="{ row }">
              <span class="text-default">{{ row.original.stockMinimo || 0 }} {{ row.original.unidadMedida || 'Ud' }}</span>
            </template>
            <template #proveedor-cell="{ row }">
              <span class="text-default">{{ getSupplierName(row.original.proveedorId) }}</span>
            </template>
            <template #actions-cell="{ row }">
              <UButton
                icon="i-lucide-pencil"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="openEditModal(row.original)"
                title="Configurar Alerta"
              />
            </template>
          </UTable>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Stock Alert Modal -->
  <UModal v-model:open="isModalOpen" title="Configurar Alerta de Stock">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="mb-2">
          <p class="text-sm font-medium text-muted">Producto</p>
          <p class="text-lg text-default">{{ currentProduct.nombre }}</p>
        </div>

        <UFormField label="Stock Mínimo" name="stockMinimo" description="El sistema te alertará o hará pedido si el stock global baja de este límite.">
          <UInput v-model.number="currentProduct.stockMinimo" type="number" min="0" />
        </UFormField>

        <UFormField label="Proveedor por Defecto" name="proveedorId" description="Proveedor al cual se le hará el pedido de reabastecimiento automáticamente.">
          <USelectMenu 
            v-model="currentProduct.proveedorId" 
            :items="supplierOptions" 
            value-key="value"
            label-key="label"
            placeholder="Seleccionar proveedor" 
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton label="Guardar Configuración" @click="saveStockAlert" />
      </div>
    </template>
  </UModal>
</template>
