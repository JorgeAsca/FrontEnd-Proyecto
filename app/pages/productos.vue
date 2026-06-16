<script setup lang="ts">
import { useProducts, type Product } from '~/composables/useProducts'
import { useCategorias, type Categoria } from '~/composables/useCategorias'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isModalOpen = ref(false)
const isEditMode = ref(false)
const searchQuery = ref('')
const selectedCategory = ref<string | undefined>(undefined)

const { getProducts, createProduct, updateProduct, deleteProduct: removeProduct } = useProducts()
const { getCategorias } = useCategorias()
const { getAlmacenes } = useAlmacenes()
const { getEmpresas } = useEmpresas()

const products = ref<Product[]>([])
const categorias = ref<Categoria[]>([])
const almacenes = ref<any[]>([])

onMounted(async () => {
  try {
    const [dataProducts, dataCategorias, empresas] = await Promise.all([
      getProducts(),
      getCategorias(),
      getEmpresas()
    ])
    if (dataProducts) products.value = dataProducts
    if (dataCategorias) categorias.value = dataCategorias
    
    if (empresas && empresas.length > 0) {
      const activeEmpresa = empresas[0].id_empresa
      const alms = await getAlmacenes(activeEmpresa)
      if (alms) almacenes.value = alms
    }
  } catch (error) {
    toast.add({ title: 'Error cargando datos', color: 'error' })
  }
})

const currentProduct = ref<Partial<Product>>({
  sku: '',
  nombre: '',
  categoriaId: '',
  almacenId: '',
  stock: 0,
  precio: 0,
  activo: true
})

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const nameMatch = product.nombre ? product.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) : false
    const skuMatch = product.sku ? product.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) : false
    const matchesSearch = nameMatch || skuMatch
    const matchesCategory = !selectedCategory.value || product.categoria?.id === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const columns = [
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'categoria', header: 'Categoria' },
  { accessorKey: 'stock', header: 'Stock Global' },
  { accessorKey: 'precio', header: 'Precio' },
  { id: 'actions', header: '' },
]

const categoryOptions = computed(() => categorias.value.map(c => ({ value: c.id, label: c.nombre })))
const warehouseOptions = computed(() => almacenes.value.map(a => ({ value: a.id, label: a.nombre })))

const unidadOptions = [
  { value: 'Ud', label: 'Unidades (Ud)' },
  { value: 'Pq', label: 'Paquetes (Pq)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'lb', label: 'Libras (lb)' },
  { value: 'L', label: 'Litros (L)' },
]

function openNewProductModal() {
  isEditMode.value = false
  currentProduct.value = {
    sku: '',
    nombre: '',
    categoriaId: '',
    almacenId: '',
    stock: 0,
    precio: 0,
    activo: true,
    unidadMedida: 'Ud'
  }
  isModalOpen.value = true
}

function openEditModal(product: Product) {
  isEditMode.value = true
  currentProduct.value = { ...product, categoriaId: product.categoria?.id }
  isModalOpen.value = true
}

async function saveProduct() {
  try {
    const payload = {
      sku: currentProduct.value.sku,
      nombre: currentProduct.value.nombre,
      categoriaId: currentProduct.value.categoriaId,
      almacenId: currentProduct.value.almacenId,
      unidadMedida: currentProduct.value.unidadMedida,
      stock: currentProduct.value.stock,
      precio: currentProduct.value.precio
    }

    if (isEditMode.value && currentProduct.value.id) {
      const updated = await updateProduct(currentProduct.value.id, payload)
      const index = products.value.findIndex(p => p.id === currentProduct.value.id)
      if (index !== -1 && updated) {
        products.value[index] = updated
      }
      toast.add({ title: 'Producto actualizado', icon: 'i-lucide-check', color: 'success' })
    } else {
      const created = await createProduct(payload)
      if (created) {
        products.value.push(created)
      }
      toast.add({ title: 'Producto creado', icon: 'i-lucide-check', color: 'success' })
    }
    isModalOpen.value = false
  } catch (error: any) {
    console.error('Error guardando producto:', error)
    toast.add({ title: 'Error al guardar el producto', description: error.message, color: 'error' })
  }
}

async function deleteProduct(id: string) {
  try {
    await removeProduct(id)
    products.value = products.value.filter(p => p.id !== id)
    toast.add({ title: 'Producto eliminado', icon: 'i-lucide-trash', color: 'warning' })
  } catch (error) {
    toast.add({ title: 'Error al eliminar el producto', color: 'error' })
  }
}

</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Productos">
        <template #right>
          <UButton icon="i-lucide-plus" label="Nuevo Producto" @click="openNewProductModal" />
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
        <template #right>
          <USelectMenu
            v-model="selectedCategory"
            :items="categorias"
            value-key="id"
            label-key="nombre"
            placeholder="Todas las categorias"
            class="w-48"
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
            <template #categoria-cell="{ row }">
              <span class="text-default">{{ row.original.categoria?.nombre || '-' }}</span>
            </template>
            <template #stock-cell="{ row }">
              <span class="text-default">{{ row.original.stock }} {{ row.original.unidadMedida || 'Ud' }}</span>
            </template>
            <template #precio-cell="{ row }">
              <span class="text-default">${{ Number(row.original.precio).toFixed(2) }}</span>
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditModal(row.original) },
                  ],
                  [
                    { label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteProduct(row.original.id) },
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

  <!-- Product Modal -->
  <UModal v-model:open="isModalOpen" :title="isEditMode ? 'Editar Producto' : 'Nuevo Producto'">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <UFormField label="SKU" name="sku">
            <UInput v-model="currentProduct.sku" placeholder="HAR-001" />
          </UFormField>
          <UFormField label="Nombre" name="nombre">
            <UInput v-model="currentProduct.nombre" placeholder="Nombre del producto" />
          </UFormField>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <UFormField label="Categoria" name="categoria">
            <USelectMenu 
              v-model="currentProduct.categoriaId" 
              :items="categorias" 
              value-key="id"
              label-key="nombre"
              placeholder="Seleccionar" 
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Stock Inicial" name="stock">
            <UInput v-model.number="currentProduct.stock" type="number" :disabled="isEditMode" />
          </UFormField>
          <UFormField label="Almacén Inicial" name="almacen" v-if="!isEditMode">
            <USelectMenu 
              v-model="currentProduct.almacenId" 
              :items="warehouseOptions"
              value-key="value"
              placeholder="Seleccionar almacén" 
            />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Precio de Venta" name="precio">
            <UInput v-model.number="currentProduct.precio" type="number" step="0.01" icon="i-lucide-dollar-sign" />
          </UFormField>
          <UFormField label="Unidad de Medida" name="unidadMedida">
            <USelectMenu 
              v-model="currentProduct.unidadMedida" 
              :items="unidadOptions"
              value-key="value"
              label-key="label"
              placeholder="Ej: Ud, kg, L" 
            />
          </UFormField>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton :label="isEditMode ? 'Guardar Cambios' : 'Crear Producto'" @click="saveProduct" />
      </div>
    </template>
  </UModal>
</template>
