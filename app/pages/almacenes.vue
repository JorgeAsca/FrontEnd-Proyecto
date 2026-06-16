<script setup lang="ts">
import { useAlmacenes, type Almacen } from '~/composables/useAlmacenes'
import { useEmpresas } from '~/composables/useEmpresas'
import { useProducts } from '~/composables/useProducts'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { getAlmacenes, createAlmacen, updateAlmacen, deleteAlmacen, getWarehouseStock } = useAlmacenes()
const { getEmpresas } = useEmpresas()
const { getProducts } = useProducts()

const isModalOpen = ref(false)
const isInventoryModalOpen = ref(false)
const isEditMode = ref(false)
const isLoading = ref(false)
const isStockLoading = ref(false)

const activeEmpresa = ref<string | null>(null)
const backendAlmacenes = ref<Almacen[]>([])
const backendProductos = ref<any[]>([])

const selectedWarehouseName = ref('')
const selectedWarehouseStock = ref<any[]>([])

const warehouses = computed(() => backendAlmacenes.value)

const currentWarehouse = ref<Partial<Almacen>>({
  codigo: '',
  nombre: '',
  estado: 'activo',
})

const statusOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'mantenimiento', label: 'En Mantenimiento' },
  { value: 'inactivo', label: 'Inactivo' },
]

function getStatusColor(estado: string) {
  switch (estado) {
    case 'activo': return 'success'
    case 'mantenimiento': return 'warning'
    case 'inactivo': return 'neutral'
    default: return 'neutral'
  }
}

function getStatusLabel(estado: string) {
  switch (estado) {
    case 'activo': return 'Activo'
    case 'mantenimiento': return 'En Mantenimiento'
    case 'inactivo': return 'Inactivo'
    default: return estado || 'Activo'
  }
}

const fetchAll = async () => {
  isLoading.value = true
  try {
    const [empresas, prods] = await Promise.all([
      getEmpresas(),
      getProducts()
    ])
    backendProductos.value = prods || []
    
    if (empresas && empresas.length > 0) {
      activeEmpresa.value = empresas[0].id_empresa
      const alms = await getAlmacenes(activeEmpresa.value)
      backendAlmacenes.value = alms || []
    }
  } catch (error) {
    toast.add({ title: 'Error cargando datos', color: 'error' })
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAll()
})

function openNewModal() {
  isEditMode.value = false
  currentWarehouse.value = {
    codigo: '',
    nombre: '',
    estado: 'activo',
  }
  isModalOpen.value = true
}

function openEditModal(warehouse: Almacen) {
  isEditMode.value = true
  currentWarehouse.value = { ...warehouse }
  isModalOpen.value = true
}

async function viewInventory(warehouse: Almacen) {
  selectedWarehouseName.value = warehouse.nombre
  isInventoryModalOpen.value = true
  isStockLoading.value = true
  try {
    const stockData = await getWarehouseStock(warehouse.id)
    // Enrich stockData with product names
    selectedWarehouseStock.value = (stockData || []).map(s => {
      const prod = backendProductos.value.find(p => p.id === s.id_producto)
      return {
        ...s,
        productoNombre: prod ? prod.nombre : 'Producto Desconocido',
        productoSku: prod ? prod.sku : 'N/A'
      }
    })
  } catch (error) {
    toast.add({ title: 'Error al cargar inventario', color: 'error' })
    selectedWarehouseStock.value = []
  } finally {
    isStockLoading.value = false
  }
}

async function saveWarehouse() {
  if (!currentWarehouse.value.nombre) {
    toast.add({ title: 'El nombre es requerido', color: 'error' })
    return
  }

  // Auto-generate codigo if empty
  const codigoToSave = currentWarehouse.value.codigo || `ALM-${String(warehouses.value.length + 1).padStart(3, '0')}`

  try {
    if (isEditMode.value && currentWarehouse.value.id) {
      const res = await updateAlmacen(currentWarehouse.value.id, {
        codigo: codigoToSave,
        nombre: currentWarehouse.value.nombre,
        estado: currentWarehouse.value.estado
      })
      if (res) {
        toast.add({ title: 'Almacen actualizado', icon: 'i-lucide-check', color: 'success' })
      }
    } else {
      if (!activeEmpresa.value) {
        toast.add({ title: 'No hay empresa activa', color: 'error' })
        return
      }
      const newWarehouse = {
        id_empresa: activeEmpresa.value,
        codigo: codigoToSave,
        nombre: currentWarehouse.value.nombre,
        estado: currentWarehouse.value.estado
      }
      const res = await createAlmacen(newWarehouse)
      if (res) {
        toast.add({ title: 'Almacen creado', icon: 'i-lucide-check', color: 'success' })
      }
    }
    isModalOpen.value = false
    await fetchAll()
  } catch (error) {
    toast.add({ title: 'Error guardando almacen', color: 'error' })
  }
}

async function handleDeleteWarehouse(id: string) {
  try {
    await deleteAlmacen(id)
    toast.add({ title: 'Almacen eliminado', icon: 'i-lucide-trash', color: 'warning' })
    await fetchAll()
  } catch (error) {
    toast.add({ title: 'Error eliminando almacen', color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Almacenes">
        <template #right>
          <UButton icon="i-lucide-plus" label="Nuevo Almacen" @click="openNewModal" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <!-- Summary Stats -->
        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          <UCard>
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-emerald-500/10 p-2">
                <UIcon name="i-lucide-warehouse" class="size-5 text-emerald-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Total Almacenes</p>
                <p class="text-xl font-semibold text-default">{{ warehouses.length }}</p>
              </div>
            </div>
          </UCard>
          <UCard>
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-500/10 p-2">
                <UIcon name="i-lucide-package" class="size-5 text-blue-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Productos Totales</p>
                <p class="text-xl font-semibold text-default">{{ warehouses.reduce((sum, w) => sum + (w.productCount || 0), 0) }}</p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Warehouse Cards -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <UCard v-for="warehouse in warehouses" :key="warehouse.id">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="rounded-lg bg-emerald-500/10 p-3">
                  <UIcon name="i-lucide-warehouse" class="size-6 text-emerald-500" />
                </div>
                <div>
                  <h3 class="font-semibold text-default">{{ warehouse.nombre }}</h3>
                  <p class="text-sm text-muted">{{ warehouse.codigo || 'Sin código' }}</p>
                </div>
              </div>
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditModal(warehouse) },
                    { label: 'Ver inventario', icon: 'i-lucide-package', onSelect: () => viewInventory(warehouse) },
                  ],
                  [
                    { label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => handleDeleteWarehouse(warehouse.id) },
                  ],
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="xs" />
              </UDropdownMenu>
            </div>

            <div class="mt-4 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">Estado</span>
                <UBadge :label="getStatusLabel(warehouse.estado)" :color="getStatusColor(warehouse.estado)" variant="subtle" />
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted">Productos</span>
                <span class="font-semibold text-default">{{ warehouse.productCount || 0 }}</span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Warehouse Modal -->
  <UModal v-model:open="isModalOpen" :title="isEditMode ? 'Editar Almacen' : 'Nuevo Almacen'">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Codigo" name="codigo">
          <UInput v-model="currentWarehouse.codigo" :disabled="isEditMode" placeholder="Dejar en blanco para auto-generar" />
        </UFormField>

        <UFormField label="Nombre" name="nombre">
          <UInput v-model="currentWarehouse.nombre" placeholder="Nombre del almacen" />
        </UFormField>

        <UFormField label="Estado" name="estado">
          <URadioGroup
            v-model="currentWarehouse.estado"
            :items="statusOptions"
            orientation="horizontal"
          />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton :label="isEditMode ? 'Guardar Cambios' : 'Crear Almacen'" @click="saveWarehouse" />
      </div>
    </template>
  </UModal>

  <!-- Inventory Modal -->
  <UModal v-model:open="isInventoryModalOpen" :title="`Inventario: ${selectedWarehouseName}`">
    <template #body>
      <div v-if="isStockLoading" class="flex justify-center p-6">
        <UIcon name="i-lucide-loader-2" class="size-6 animate-spin text-muted" />
      </div>
      <div v-else-if="selectedWarehouseStock.length === 0" class="text-center p-6 text-muted">
        No hay productos en este almacén.
      </div>
      <div v-else class="max-h-[60vh] overflow-auto">
        <UTable 
          :data="selectedWarehouseStock" 
          :columns="[
            { accessorKey: 'productoSku', header: 'SKU' },
            { accessorKey: 'productoNombre', header: 'Producto' },
            { accessorKey: 'cantidad', header: 'Cantidad' }
          ]" 
        />
      </div>
    </template>
    
    <template #footer>
      <div class="flex justify-end">
        <UButton label="Cerrar" color="neutral" variant="ghost" @click="isInventoryModalOpen = false" />
      </div>
    </template>
  </UModal>
</template>
