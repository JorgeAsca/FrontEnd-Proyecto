<script setup lang="ts">
import { useRoles, type Role } from '~/composables/useRoles'
import { usePermisos, type Permiso } from '~/composables/usePermisos'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { getRoles, createRole, updateRole, deleteRole: removeRole } = useRoles()
const { getPermisos } = usePermisos()

const roles = ref<Role[]>([])
const permisos = ref<Permiso[]>([])
const isModalOpen = ref(false)
const isEditing = ref(false)

const currentRole = ref<Partial<Role>>({
  nombre: '',
  permisos: []
})

// Store checked permissions by name
const selectedPermisos = ref<Record<string, boolean>>({})

onMounted(async () => {
  try {
    const [dataRoles, dataPermisos] = await Promise.all([
      getRoles(),
      getPermisos()
    ])
    if (dataRoles) roles.value = dataRoles
    if (dataPermisos) permisos.value = dataPermisos
  } catch (error) {
    toast.add({ title: 'Error cargando datos de preferencias', color: 'error' })
  }
})

const columnsRoles = [
  { accessorKey: 'id_rol', header: 'ID Rol' },
  { accessorKey: 'nombre', header: 'Nombre del Rol' },
  { accessorKey: 'permisosCount', header: 'Nº Permisos' },
  { id: 'actions', header: '' }
]

// Group permissions by module (e.g. 'usuarios:leer' -> module 'usuarios')
const groupedPermisos = computed(() => {
  const groups: Record<string, Permiso[]> = {}
  for (const perm of permisos.value) {
    const moduleName = perm.nombre.split(':')[0]
    if (!groups[moduleName]) {
      groups[moduleName] = []
    }
    groups[moduleName].push(perm)
  }
  return groups
})

function openNewRoleModal() {
  isEditing.value = false
  currentRole.value = { nombre: '' }
  selectedPermisos.value = {}
  isModalOpen.value = true
}

function openEditRoleModal(role: any) {
  isEditing.value = true
  currentRole.value = { ...role }
  selectedPermisos.value = {}
  if (role.permisos) {
    role.permisos.forEach((p: any) => {
      selectedPermisos.value[p.nombre] = true
    })
  }
  isModalOpen.value = true
}

async function saveRole() {
  try {
    // Extract selected permission names
    const activePerms = Object.keys(selectedPermisos.value).filter(k => selectedPermisos.value[k])
    
    const payload = { 
      nombre: currentRole.value.nombre,
      permisos: activePerms
    }

    if (isEditing.value && currentRole.value.id_rol) {
      const updated = await updateRole(currentRole.value.id_rol, payload)
      if (updated) {
        const index = roles.value.findIndex(r => r.id_rol === currentRole.value.id_rol)
        if (index !== -1) roles.value[index] = updated
        toast.add({ title: 'Rol actualizado', icon: 'i-lucide-check', color: 'success' })
      }
    } else {
      const created = await createRole(payload)
      if (created) {
        roles.value.push(created)
        toast.add({ title: 'Rol creado', icon: 'i-lucide-check', color: 'success' })
      }
    }
    isModalOpen.value = false
  } catch (error: any) {
    console.error('Error guardando rol:', error)
    toast.add({ title: 'Error al guardar rol', description: error.message, color: 'error' })
  }
}

async function deleteRole(id: string) {
  try {
    await removeRole(id)
    roles.value = roles.value.filter(r => r.id_rol !== id)
    toast.add({ title: 'Rol eliminado', icon: 'i-lucide-trash', color: 'warning' })
  } catch (error) {
    toast.add({ title: 'Error al eliminar rol', color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Preferencias - Roles y Permisos" />
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-6">
        
        <div class="mb-4">
          <p class="text-sm text-muted">
            Define los roles de la empresa y controla exactamente a qué módulos puede acceder cada empleado mediante los permisos.
          </p>
        </div>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-default">Roles de la Empresa</h3>
              <UButton icon="i-lucide-plus" label="Nuevo Rol" @click="openNewRoleModal" />
            </div>
          </template>
          
          <UTable :data="roles" :columns="columnsRoles">
            <template #permisosCount-cell="{ row }">
              <UBadge color="info" variant="subtle" :label="`${row.original.permisos?.length || 0} permisos`" />
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Editar Accesos', icon: 'i-lucide-pencil', onSelect: () => openEditRoleModal(row.original) },
                  ],
                  [
                    { label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteRole(row.original.id_rol) },
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

  <!-- Role Slideover/Modal -->
  <USlideover v-model:open="isModalOpen" :title="isEditing ? 'Editar Accesos del Rol' : 'Crear Nuevo Rol'">
    <template #body>
      <div class="flex flex-col gap-6 p-4">
        <UFormField label="Nombre del Rol" name="nombre">
          <UInput v-model="currentRole.nombre" placeholder="Ej: Administrador, Vendedor VIP..." />
        </UFormField>

        <USeparator />

        <div>
          <h4 class="text-md font-semibold mb-4 text-default">Permisos Asignados</h4>
          <p class="text-sm text-muted mb-4">Activa o desactiva las acciones que los usuarios con este rol podrán realizar.</p>
          
          <div class="flex flex-col gap-6">
            <div v-for="(perms, moduleName) in groupedPermisos" :key="moduleName" class="border rounded-md p-4 bg-gray-50/50 dark:bg-gray-800/50">
              <h5 class="text-sm font-semibold uppercase tracking-wider mb-3 text-primary">{{ moduleName }}</h5>
              <div class="grid grid-cols-1 gap-3">
                <USwitch 
                  v-for="perm in perms" 
                  :key="perm.nombre"
                  v-model="selectedPermisos[perm.nombre]"
                  :label="perm.descripcion || perm.nombre"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full mt-4 p-4 border-t border-gray-200 dark:border-gray-800">
        <UButton variant="ghost" label="Cancelar" @click="isModalOpen = false" />
        <UButton :label="isEditing ? 'Guardar Cambios' : 'Crear Rol'" @click="saveRole" />
      </div>
    </template>
  </USlideover>
</template>
