<script setup lang="ts">
import { useMovimientos, type Movimiento as BackendMovimiento } from '~/composables/useMovimientos'
import { useAlmacenes, type Almacen } from '~/composables/useAlmacenes'
import { useProducts, type Product } from '~/composables/useProducts'
import { useEmpresas, type Empresa } from '~/composables/useEmpresas'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isModalOpen = ref(false)
const searchQuery = ref('')
const filterType = ref<string | undefined>(undefined)
const filterWarehouse = ref<string | undefined>(undefined)

const isDetailsModalOpen = ref(false)
const selectedMovement = ref<any>(null)

const { getMovimientos, createMovimiento, getStockByProducto } = useMovimientos()
const { getAlmacenes } = useAlmacenes()
const { getProducts } = useProducts()
const { getEmpresas } = useEmpresas()

const rawMovements = ref<BackendMovimiento[]>([])
const backendAlmacenes = ref<Almacen[]>([])
const backendProductos = ref<Product[]>([])
const activeEmpresa = ref<string | null>(null)

const fetchAll = async () => {
  try {
    const [alms, prods, empresas] = await Promise.all([
      getAlmacenes(),
      getProducts(),
      getEmpresas()
    ])
    backendAlmacenes.value = alms || []
    backendProductos.value = prods || []
    if (empresas && empresas.length > 0) {
      activeEmpresa.value = empresas[0].id_empresa
      const movs = await getMovimientos(activeEmpresa.value)
      rawMovements.value = movs || []
    }
  } catch (error) {
    toast.add({ title: 'Error cargando datos', color: 'error' })
  }
}

onMounted(() => {
  fetchAll()
})

const movements = computed(() => {
  return rawMovements.value.map(m => {
    const p = backendProductos.value.find(prod => prod.id === m.id_producto)
    const a = backendAlmacenes.value.find(alm => alm.id === m.id_almacen)
    
    return {
      id: m.id,
      date: m.fecha_movimiento ? m.fecha_movimiento.split('T')[0] : '-',
      time: m.fecha_movimiento ? new Date(m.fecha_movimiento).toLocaleTimeString().slice(0, 5) : '-',
      type: m.tipo.toLowerCase(),
      product: p ? p.nombre : 'Desconocido',
      productSku: p ? p.sku : '',
      unidadMedida: p ? p.unidadMedida || 'Ud' : 'Ud',
      quantity: m.cantidad,
      warehouse: a ? a.nombre : 'Desconocido',
      warehouseId: m.id_almacen,
      warehouseTo: undefined,
      reference: m.referencia_externa || '-',
      notes: '',
      user: m.id_usuario ? 'Usuario Real' : 'Admin'
    }
  })
})

const currentMovement = ref({
  type: 'entrada',
  product: '',
  quantity: 0,
  warehouse: '',
  warehouseTo: '',
  reference: '',
  notes: '',
})

const typeOptions = [
  { value: 'entrada', label: 'Entrada' },
  { value: 'salida', label: 'Salida' },
  { value: 'ajuste', label: 'Ajuste' },
  { value: 'transferencia', label: 'Transferencia' },
]

const warehouses = computed(() => backendAlmacenes.value.map(a => ({ value: a.id, label: a.nombre })))
const products = computed(() => backendProductos.value.map(p => ({ value: p.id, label: `${p.nombre} (${p.sku})` })))

const productStockInfo = ref<any[]>([])

watch(() => currentMovement.value.product, async (newVal) => {
  if (newVal) {
    const stock = await getStockByProducto(newVal)
    productStockInfo.value = stock || []
  } else {
    productStockInfo.value = []
  }
})

const filteredWarehouses = computed(() => {
  if (currentMovement.value.type === 'entrada') {
    return warehouses.value
  }
  
  if (!currentMovement.value.product) return []
  
  return warehouses.value.filter(w => 
    productStockInfo.value.some(s => s.id_almacen === w.value && s.cantidad > 0)
  )
})

const filteredMovements = computed(() => {
  return movements.value.filter((mov) => {
    const matchesSearch = mov.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mov.reference.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !filterType.value || mov.type === filterType.value
    const matchesWarehouse = !filterWarehouse.value || mov.warehouseId === filterWarehouse.value
    return matchesSearch && matchesType && matchesWarehouse
  })
})

const columns = [
  { accessorKey: 'date', header: 'Fecha' },
  { accessorKey: 'type', header: 'Tipo' },
  { accessorKey: 'product', header: 'Producto' },
  { accessorKey: 'quantity', header: 'Cantidad' },
  { accessorKey: 'warehouse', header: 'Almacen' },
  { accessorKey: 'reference', header: 'Referencia' },
  { accessorKey: 'user', header: 'Usuario' },
  { id: 'actions', header: '' },
]

function getTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case 'entrada': return 'success'
    case 'salida': return 'warning'
    case 'ajuste': return 'info'
    case 'transferencia': return 'primary'
    default: return 'neutral'
  }
}

function getTypeIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'entrada': return 'i-lucide-package-plus'
    case 'salida': return 'i-lucide-package-minus'
    case 'ajuste': return 'i-lucide-scale'
    case 'transferencia': return 'i-lucide-arrow-right-left'
    default: return 'i-lucide-package'
  }
}

function openNewModal(type: string) {
  currentMovement.value = {
    type,
    product: '',
    quantity: 0,
    warehouse: '',
    warehouseTo: '',
    reference: '',
    notes: '',
  }
  isModalOpen.value = true
}

function viewDetails(movement: any) {
  selectedMovement.value = movement
  isDetailsModalOpen.value = true
}

async function saveMovement() {
  if (!currentMovement.value.product || !currentMovement.value.warehouse || currentMovement.value.quantity <= 0) {
    toast.add({ title: 'Complete los campos requeridos', color: 'error' })
    return
  }

  if (currentMovement.value.type === 'transferencia' && !currentMovement.value.warehouseTo) {
    toast.add({ title: 'Seleccione un almacén de destino', color: 'error' })
    return
  }

  if (!activeEmpresa.value) {
    toast.add({ title: 'Error: No hay empresa activa', color: 'error' })
    return
  }

  try {
    if (currentMovement.value.type === 'transferencia') {
      // 1. Registrar SALIDA del almacén origen
      await createMovimiento({
        id_producto: currentMovement.value.product,
        id_almacen: currentMovement.value.warehouse,
        id_empresa: activeEmpresa.value,
        tipo: 'SALIDA',
        cantidad: currentMovement.value.quantity,
        referencia_externa: currentMovement.value.reference || 'Transferencia (Salida)',
      })

      // 2. Registrar ENTRADA al almacén destino
      await createMovimiento({
        id_producto: currentMovement.value.product,
        id_almacen: currentMovement.value.warehouseTo,
        id_empresa: activeEmpresa.value,
        tipo: 'ENTRADA',
        cantidad: currentMovement.value.quantity,
        referencia_externa: currentMovement.value.reference || 'Transferencia (Entrada)',
      })

      toast.add({ title: 'Transferencia completada', icon: 'i-lucide-check', color: 'success' })
    } else {
      // Entrada o Salida Normal
      const tipoReal = currentMovement.value.type.toUpperCase() === 'AJUSTE' ? 'ENTRADA' : currentMovement.value.type.toUpperCase() as 'ENTRADA' | 'SALIDA'
      
      await createMovimiento({
        id_producto: currentMovement.value.product,
        id_almacen: currentMovement.value.warehouse,
        id_empresa: activeEmpresa.value,
        tipo: tipoReal,
        cantidad: currentMovement.value.quantity,
        referencia_externa: currentMovement.value.reference || undefined,
      })

      toast.add({ title: 'Movimiento registrado', icon: 'i-lucide-check', color: 'success' })
    }
    
    isModalOpen.value = false
    await fetchAll()
  } catch (error) {
    toast.add({ title: 'Error al registrar movimiento', color: 'error' })
  }
}

const isToday = (dateString: string) => {
  if (!dateString || dateString === '-') return false
  const d = new Date(dateString)
  const today = new Date()
  return d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
}

const totalEntradas = computed(() => {
  return rawMovements.value
    .filter(m => m.tipo === 'ENTRADA' && isToday(m.fecha_movimiento))
    .reduce((acc, curr) => acc + curr.cantidad, 0)
})

const totalSalidas = computed(() => {
  return rawMovements.value
    .filter(m => m.tipo === 'SALIDA' && isToday(m.fecha_movimiento))
    .reduce((acc, curr) => acc + curr.cantidad, 0)
})
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Movimientos de Stock">
        <template #right>
          <div class="flex gap-2">
            <UButton icon="i-lucide-package-plus" label="Entrada" color="success" variant="soft" @click="openNewModal('entrada')" />
            <UButton icon="i-lucide-package-minus" label="Salida" color="warning" variant="soft" @click="openNewModal('salida')" />
            <UButton icon="i-lucide-arrow-right-left" label="Transferencia" variant="soft" @click="openNewModal('transferencia')" />
          </div>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Buscar movimientos..."
            class="w-64"
          />
        </template>
        <template #right>
          <div class="flex gap-2">
            <USelectMenu
              v-model="filterType"
              :items="typeOptions"
              value-key="value"
              placeholder="Tipo"
              class="w-40"
            />
            <USelectMenu
              v-model="filterWarehouse"
              :items="warehouses"
              placeholder="Almacen"
              class="w-44"
            />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6">
        <!-- Summary Cards -->
        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <UCard class="bg-emerald-500/10">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-emerald-500/20 p-2">
                <UIcon name="i-lucide-package-plus" class="size-5 text-emerald-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Entradas Hoy</p>
                <p class="text-xl font-semibold text-default">{{ totalEntradas }}</p>
              </div>
            </div>
          </UCard>
          <UCard class="bg-amber-500/10">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-amber-500/20 p-2">
                <UIcon name="i-lucide-package-minus" class="size-5 text-amber-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Salidas Hoy</p>
                <p class="text-xl font-semibold text-default">{{ totalSalidas }}</p>
              </div>
            </div>
          </UCard>
          <UCard class="bg-blue-500/10">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-500/20 p-2">
                <UIcon name="i-lucide-arrow-right-left" class="size-5 text-blue-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Transferencias</p>
                <p class="text-xl font-semibold text-default">12</p>
              </div>
            </div>
          </UCard>
          <UCard class="bg-purple-500/10">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-purple-500/20 p-2">
                <UIcon name="i-lucide-scale" class="size-5 text-purple-500" />
              </div>
              <div>
                <p class="text-sm text-muted">Ajustes</p>
                <p class="text-xl font-semibold text-default">3</p>
              </div>
            </div>
          </UCard>
        </div>

        <UCard>
          <UTable :data="filteredMovements" :columns="columns">
            <template #date-cell="{ row }">
              <div>
                <span class="text-default">{{ row.original.date }}</span>
                <span class="ml-2 text-xs text-muted">{{ row.original.time }}</span>
              </div>
            </template>
            <template #type-cell="{ row }">
              <UBadge
                :color="getTypeColor(row.original.type)"
                :icon="getTypeIcon(row.original.type)"
                :label="row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)"
                variant="subtle"
              />
            </template>
            <template #product-cell="{ row }">
              <div>
                <span class="font-medium text-default">{{ row.original.product }}</span>
                <span class="ml-2 text-xs text-muted">{{ row.original.productSku }}</span>
              </div>
            </template>
            <template #quantity-cell="{ row }">
              <span
                :class="[
                  'font-semibold',
                  row.original.type === 'entrada' ? 'text-emerald-500' : 'text-amber-500',
                ]"
              >
                {{ row.original.type === 'entrada' ? '+' : '-' }}{{ row.original.quantity }} {{ row.original.unidadMedida }}
              </span>
            </template>
            <template #warehouse-cell="{ row }">
              <div>
                <span class="text-default">{{ row.original.warehouse }}</span>
                <template v-if="row.original.warehouseTo">
                  <UIcon name="i-lucide-arrow-right" class="mx-1 size-3 text-muted" />
                  <span class="text-default">{{ row.original.warehouseTo }}</span>
                </template>
              </div>
            </template>
            <template #reference-cell="{ row }">
              <span class="font-mono text-sm text-muted">{{ row.original.reference }}</span>
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Ver detalles', icon: 'i-lucide-eye', onSelect: () => viewDetails(row.original) },
                    { label: 'Imprimir', icon: 'i-lucide-printer' },
                  ],
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="sm" />
              </UDropdownMenu>
            </template>
          </UTable>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>

  <!-- Movement Modal -->
  <UModal v-model:open="isModalOpen" :title="`Registrar ${currentMovement.type.charAt(0).toUpperCase() + currentMovement.type.slice(1)}`">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Producto" name="product">
          <USelectMenu
            v-model="currentMovement.product"
            :items="products"
            value-key="value"
            label-key="label"
            searchable
            placeholder="Buscar producto..."
          />
        </UFormField>

        <UFormField label="Cantidad" name="quantity">
          <UInput v-model.number="currentMovement.quantity" type="number" min="1" />
        </UFormField>

        <UFormField label="Almacen Origen" name="warehouse">
          <USelectMenu
            v-model="currentMovement.warehouse"
            :items="filteredWarehouses"
            value-key="value"
            label-key="label"
            placeholder="Seleccionar almacen"
          />
        </UFormField>

        <UFormField v-if="currentMovement.type === 'transferencia'" label="Almacen Destino" name="warehouseTo">
          <USelectMenu
            v-model="currentMovement.warehouseTo"
            :items="warehouses.filter(w => w.value !== currentMovement.warehouse)"
            value-key="value"
            label-key="label"
            placeholder="Seleccionar almacen destino"
          />
        </UFormField>

        <UFormField label="Referencia (opcional)" name="reference">
          <UInput v-model="currentMovement.reference" placeholder="Ej: OC-2024-001" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton label="Registrar Movimiento" @click="saveMovement" />
      </div>
    </template>
  </UModal>

  <!-- Details Modal -->
  <UModal v-model:open="isDetailsModalOpen" title="Detalles del Movimiento">
    <template #body>
      <div v-if="selectedMovement" class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted">ID</p>
            <p class="font-mono text-sm text-default">{{ selectedMovement.id }}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Fecha y Hora</p>
            <p class="text-default">{{ selectedMovement.date }} {{ selectedMovement.time }}</p>
          </div>
        </div>

        <USeparator />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted">Producto</p>
            <p class="font-medium text-default">{{ selectedMovement.product }}</p>
            <p class="text-xs text-muted">{{ selectedMovement.productSku }}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Tipo y Cantidad</p>
            <div class="flex items-center gap-2">
              <UBadge
                :color="getTypeColor(selectedMovement.type)"
                :icon="getTypeIcon(selectedMovement.type)"
                :label="selectedMovement.type.charAt(0).toUpperCase() + selectedMovement.type.slice(1)"
                variant="subtle"
                size="sm"
              />
              <span
                :class="[
                  'font-semibold',
                  selectedMovement.type === 'entrada' ? 'text-emerald-500' : 'text-amber-500',
                ]"
              >
                {{ selectedMovement.type === 'entrada' ? '+' : '-' }}{{ selectedMovement.quantity }}
              </span>
            </div>
          </div>
        </div>

        <USeparator />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted">Almacén Origen</p>
            <p class="text-default">{{ selectedMovement.warehouse }}</p>
          </div>
          <div v-if="selectedMovement.warehouseTo">
            <p class="text-sm text-muted">Almacén Destino</p>
            <p class="text-default">{{ selectedMovement.warehouseTo }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-muted">Referencia</p>
            <p class="text-default">{{ selectedMovement.reference || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-muted">Usuario</p>
            <p class="text-default">{{ selectedMovement.user }}</p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end">
        <UButton label="Cerrar" color="neutral" variant="ghost" @click="isDetailsModalOpen = false" />
      </div>
    </template>
  </UModal>
</template>
