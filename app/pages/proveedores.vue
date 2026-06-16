<script setup lang="ts">
import { useProveedores, type Proveedor } from '~/composables/useProveedores'
import { useEmpresas } from '~/composables/useEmpresas'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isModalOpen = ref(false)
const isEditMode = ref(false)
const searchQuery = ref('')

const { getProveedores, createProveedor, updateProveedor, deleteProveedor: removeProveedor } = useProveedores()
const { getEmpresas } = useEmpresas()

const suppliers = ref<Proveedor[]>([])
const currentEmpresaId = ref('')

onMounted(async () => {
  try {
    const empresas = await getEmpresas()
    if (empresas && empresas.length > 0) {
      currentEmpresaId.value = empresas[0].id_empresa
      await fetchProveedores()
    }
  } catch (error) {
    toast.add({ title: 'Error cargando empresas', color: 'error' })
  }
})

async function fetchProveedores() {
  if (!currentEmpresaId.value) return
  const data = await getProveedores(currentEmpresaId.value)
  if (data) {
    suppliers.value = data
  }
}

const currentSupplier = ref<Partial<Proveedor>>({
  codigo: '',
  razon_social: '',
  contacto_nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  activo: true,
})

const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return suppliers.value
  return suppliers.value.filter(sup =>
    sup.razon_social?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    sup.codigo?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    sup.contacto_nombre?.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const columns = [
  { accessorKey: 'codigo', header: 'Codigo' },
  { accessorKey: 'razon_social', header: 'Proveedor' },
  { accessorKey: 'contacto_nombre', header: 'Contacto' },
  { accessorKey: 'activo', header: 'Estado' },
  { id: 'actions', header: '' },
]

function openNewModal() {
  isEditMode.value = false
  currentSupplier.value = {
    codigo: `PRV-${String(suppliers.value.length + 1).padStart(3, '0')}`,
    razon_social: '',
    contacto_nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    activo: true,
  }
  isModalOpen.value = true
}

function openEditModal(supplier: Proveedor) {
  isEditMode.value = true
  currentSupplier.value = { ...supplier }
  isModalOpen.value = true
}

async function saveSupplier() {
  try {
    const payload = {
      ...currentSupplier.value,
      id_empresa: currentEmpresaId.value
    }

    if (isEditMode.value && currentSupplier.value.id) {
      const updated = await updateProveedor(currentSupplier.value.id, payload)
      if (updated) {
        const index = suppliers.value.findIndex(s => s.id === updated.id)
        if (index !== -1) suppliers.value[index] = updated
        toast.add({ title: 'Proveedor actualizado', icon: 'i-lucide-check', color: 'success' })
      }
    } else {
      const created = await createProveedor(payload)
      if (created) {
        suppliers.value.push(created)
        toast.add({ title: 'Proveedor creado', icon: 'i-lucide-check', color: 'success' })
      }
    }
    isModalOpen.value = false
  } catch (error: any) {
    toast.add({ title: 'Error al guardar proveedor', description: error.message, color: 'error' })
  }
}

async function deleteSupplier(id: string) {
  try {
    const success = await removeProveedor(id)
    if (success) {
      suppliers.value = suppliers.value.filter(s => s.id !== id)
      toast.add({ title: 'Proveedor eliminado', icon: 'i-lucide-trash', color: 'warning' })
    }
  } catch (error) {
    toast.add({ title: 'Error al eliminar', color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Proveedores">
        <template #right>
          <UButton icon="i-lucide-plus" label="Nuevo Proveedor" @click="openNewModal" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Buscar proveedores..."
            class="w-64"
          />
        </template>
        <template #right>
          <UButton icon="i-lucide-download" label="Exportar" variant="outline" color="neutral" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="p-6">
        <UCard>
          <UTable :data="filteredSuppliers" :columns="columns">
            <template #codigo-cell="{ row }">
              <span class="font-mono text-sm text-muted">{{ row.original.codigo }}</span>
            </template>
            <template #razon_social-cell="{ row }">
              <div>
                <span class="font-medium text-default">{{ row.original.razon_social }}</span>
                <p class="text-xs text-muted">{{ row.original.email || '-' }}</p>
              </div>
            </template>
            <template #contacto_nombre-cell="{ row }">
              <div>
                <span class="text-default">{{ row.original.contacto_nombre || '-' }}</span>
                <p class="text-xs text-muted">{{ row.original.telefono || '-' }}</p>
              </div>
            </template>
            <template #activo-cell="{ row }">
              <UBadge
                :color="row.original.activo ? 'success' : 'neutral'"
                :label="row.original.activo ? 'Activo' : 'Inactivo'"
                variant="subtle"
              />
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditModal(row.original) },
                  ],
                  [
                    { label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteSupplier(row.original.id) },
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

  <!-- Supplier Modal -->
  <UModal v-model:open="isModalOpen" :title="isEditMode ? 'Editar Proveedor' : 'Nuevo Proveedor'">
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4">
          <UFormField label="Codigo" name="codigo">
            <UInput v-model="currentSupplier.codigo" :disabled="isEditMode" />
          </UFormField>
        </div>

        <UFormField label="Nombre de la Empresa" name="razon_social">
          <UInput v-model="currentSupplier.razon_social" placeholder="Nombre del proveedor" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Persona de Contacto" name="contacto_nombre">
            <UInput v-model="currentSupplier.contacto_nombre" placeholder="Nombre del contacto" />
          </UFormField>
          <UFormField label="Telefono" name="telefono">
            <UInput v-model="currentSupplier.telefono" placeholder="+34 600 000 000" />
          </UFormField>
        </div>

        <UFormField label="Email" name="email">
          <UInput v-model="currentSupplier.email" type="email" placeholder="email@proveedor.com" />
        </UFormField>

        <UFormField label="Direccion" name="direccion">
          <UTextarea v-model="currentSupplier.direccion" placeholder="Direccion completa" :rows="2" />
        </UFormField>

        <UFormField label="Estado" name="activo">
          <USwitch v-model="currentSupplier.activo" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton :label="isEditMode ? 'Guardar Cambios' : 'Crear Proveedor'" @click="saveSupplier" />
      </div>
    </template>
  </UModal>
</template>
