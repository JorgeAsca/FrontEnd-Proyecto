<script setup lang="ts">
import { useUsuarios, type Usuario } from '~/composables/useUsuarios'
import { useRoles, type Role } from '~/composables/useRoles'
import { useEmpresas, type Empresa } from '~/composables/useEmpresas'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const isUserModalOpen = ref(false)
const isEditingUser = ref(false)
const isRoleModalOpen = ref(false)
const isEmpresaModalOpen = ref(false)
const isEditingEmpresa = ref(false)

const { getUsuarios, createUsuario, updateUsuario, deleteUsuario: removeUsuario } = useUsuarios()
const { getRoles, createRole } = useRoles()
const { getEmpresas, createEmpresa, updateEmpresa, deleteEmpresa: removeEmpresa } = useEmpresas()

const usuarios = ref<Usuario[]>([])
const roles = ref<Role[]>([])
const empresas = ref<Empresa[]>([])

onMounted(async () => {
  try {
    const [dataUsers, dataRoles, dataEmpresas] = await Promise.all([
      getUsuarios(),
      getRoles(),
      getEmpresas()
    ])
    if (dataUsers) usuarios.value = dataUsers
    if (dataRoles) roles.value = dataRoles
    if (dataEmpresas) empresas.value = dataEmpresas
  } catch (error) {
    toast.add({ title: 'Error cargando datos de perfil', color: 'error' })
  }
})

const currentUser = ref<Partial<Usuario>>({
  nombre: '',
  email: '',
  password: '',
  rolId: '',
  empresaId: ''
})

const currentRole = ref<Partial<Role>>({
  nombre: ''
})

const currentEmpresa = ref<Partial<Empresa>>({
  nombre_legal: '',
  nombre_comercial: '',
  nif_cif: ''
})

const columnsUsuarios = [
  { accessorKey: 'id_usuario', header: 'ID Usuario' },
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'rol', header: 'Rol' },
  { id: 'actions', header: '' }
]

const columnsEmpresas = [
  { accessorKey: 'id_empresa', header: 'ID Empresa' },
  { accessorKey: 'nombre_legal', header: 'Nombre Legal' },
  { accessorKey: 'nombre_comercial', header: 'Nombre Comercial' },
  { accessorKey: 'nif_cif', header: 'NIF/CIF' },
  { id: 'actions', header: '' }
]

function openNewUserModal() {
  isEditingUser.value = false
  currentUser.value = {
    nombre: '',
    email: '',
    password: '',
    rolId: '',
    empresaId: empresas.value[0]?.id_empresa || ''
  }
  isUserModalOpen.value = true
}

function openEditUserModal(user: Usuario) {
  isEditingUser.value = true
  currentUser.value = { ...user, rolId: user.rol?.id_rol || user.rolId }
  isUserModalOpen.value = true
}

function openNewRoleModal() {
  currentRole.value = { nombre: '' }
  isRoleModalOpen.value = true
}

function openNewEmpresaModal() {
  isEditingEmpresa.value = false
  currentEmpresa.value = { nombre_legal: '', nombre_comercial: '', nif_cif: '' }
  isEmpresaModalOpen.value = true
}

function openEditEmpresaModal(empresa: Empresa) {
  isEditingEmpresa.value = true
  currentEmpresa.value = { ...empresa }
  isEmpresaModalOpen.value = true
}

async function saveUser() {
  try {
    const payload = { ...currentUser.value }
    if (isEditingUser.value && currentUser.value.id_usuario) {
      if (!payload.password) delete payload.password;
      const updated = await updateUsuario(currentUser.value.id_usuario, payload)
      if (updated) {
        const index = usuarios.value.findIndex(u => u.id_usuario === currentUser.value.id_usuario)
        if (index !== -1) usuarios.value[index] = updated
        toast.add({ title: 'Usuario actualizado', icon: 'i-lucide-check', color: 'success' })
      }
    } else {
      const created = await createUsuario(payload)
      if (created) {
        usuarios.value.push(created)
        toast.add({ title: 'Usuario creado', icon: 'i-lucide-check', color: 'success' })
      }
    }
    isUserModalOpen.value = false
  } catch (error: any) {
    console.error('Error guardando usuario:', error)
    toast.add({ title: 'Error al guardar usuario', description: error.message || 'Verifica los datos.', color: 'error' })
  }
}

async function deleteUser(id: string) {
  try {
    await removeUsuario(id)
    usuarios.value = usuarios.value.filter(u => u.id_usuario !== id)
    toast.add({ title: 'Usuario eliminado', icon: 'i-lucide-trash', color: 'warning' })
  } catch (error) {
    toast.add({ title: 'Error al eliminar usuario', color: 'error' })
  }
}

async function saveRole() {
  try {
    const payload = { nombre: currentRole.value.nombre }
    const created = await createRole(payload)
    if (created) {
      roles.value.push(created)
      toast.add({ title: 'Rol creado', icon: 'i-lucide-check', color: 'success' })
      isRoleModalOpen.value = false
    }
  } catch (error: any) {
    console.error('Error guardando rol:', error)
    toast.add({ title: 'Error al crear rol', description: error.message, color: 'error' })
  }
}

async function saveEmpresa() {
  try {
    const payload = { ...currentEmpresa.value }
    if (isEditingEmpresa.value && currentEmpresa.value.id_empresa) {
      const updated = await updateEmpresa(currentEmpresa.value.id_empresa, payload)
      if (updated) {
        const index = empresas.value.findIndex(e => e.id_empresa === currentEmpresa.value.id_empresa)
        if (index !== -1) empresas.value[index] = updated
        toast.add({ title: 'Empresa actualizada', icon: 'i-lucide-check', color: 'success' })
      }
    } else {
      const created = await createEmpresa(payload)
      if (created) {
        empresas.value.push(created)
        toast.add({ title: 'Empresa creada', icon: 'i-lucide-check', color: 'success' })
      }
    }
    isEmpresaModalOpen.value = false
  } catch (error: any) {
    console.error('Error guardando empresa:', error)
    toast.add({ title: 'Error al guardar empresa', description: error.message, color: 'error' })
  }
}

async function deleteEmpresa(id: string) {
  try {
    await removeEmpresa(id)
    empresas.value = empresas.value.filter(e => e.id_empresa !== id)
    toast.add({ title: 'Empresa eliminada', icon: 'i-lucide-trash', color: 'warning' })
  } catch (error) {
    toast.add({ title: 'Error al eliminar empresa', color: 'error' })
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Gestión de Usuarios y Roles" />
    </template>

    <template #body>
      <div class="flex flex-col gap-6 p-6">
        
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-default">Usuarios de la Empresa</h3>
              <div class="flex gap-2">
                <UButton icon="i-lucide-shield" label="Añadir Rol" variant="soft" color="primary" @click="openNewRoleModal" />
                <UButton icon="i-lucide-user-plus" label="Añadir Empleado" @click="openNewUserModal" />
              </div>
            </div>
          </template>
          
          <UTable :data="usuarios" :columns="columnsUsuarios">
            <template #rol-cell="{ row }">
              <UBadge
                color="info"
                :label="row.original.rol?.nombre || 'Sin rol'"
                variant="subtle"
              />
            </template>
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditUserModal(row.original) },
                  ],
                  [
                    { label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteUser(row.original.id_usuario) },
                  ],
                ]"
              >
                <UButton icon="i-lucide-ellipsis-vertical" variant="ghost" color="neutral" size="sm" />
              </UDropdownMenu>
            </template>
          </UTable>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-default">Empresas Registradas</h3>
              <div class="flex gap-2">
                <UButton icon="i-lucide-building" label="Añadir Empresa" @click="openNewEmpresaModal" />
              </div>
            </div>
          </template>
          
          <UTable :data="empresas" :columns="columnsEmpresas">
            <template #actions-cell="{ row }">
              <UDropdownMenu
                :items="[
                  [
                    { label: 'Editar', icon: 'i-lucide-pencil', onSelect: () => openEditEmpresaModal(row.original) },
                  ],
                  [
                    { label: 'Eliminar', icon: 'i-lucide-trash', color: 'error' as const, onSelect: () => deleteEmpresa(row.original.id_empresa) },
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

  <!-- User Modal -->
  <UModal v-model:open="isUserModalOpen" :title="isEditingUser ? 'Editar Empleado' : 'Nuevo Empleado'">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Nombre Completo" name="nombre">
          <UInput v-model="currentUser.nombre" placeholder="Ej: Ana Lopez" />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput v-model="currentUser.email" type="email" placeholder="email@ejemplo.com" />
        </UFormField>

        <UFormField label="Contraseña" name="password">
          <UInput v-model="currentUser.password" type="password" placeholder="Contraseña (dejar en blanco para no cambiar)" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Rol" name="rolId">
            <USelectMenu 
              v-model="currentUser.rolId" 
              :items="roles" 
              value-key="id_rol"
              label-key="nombre"
              placeholder="Seleccionar Rol" 
            />
          </UFormField>
          
          <UFormField label="Empresa" name="empresaId">
            <USelectMenu 
              v-model="currentUser.empresaId" 
              :items="empresas" 
              value-key="id_empresa"
              label-key="nombre_comercial"
              placeholder="Seleccionar Empresa" 
            />
          </UFormField>

        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isUserModalOpen = false" />
        <UButton :label="isEditingUser ? 'Guardar Cambios' : 'Crear Empleado'" @click="saveUser" />
      </div>
    </template>
  </UModal>

  <!-- Role Modal -->
  <UModal v-model:open="isRoleModalOpen" title="Nuevo Rol">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Nombre del Rol" name="nombre">
          <UInput v-model="currentRole.nombre" placeholder="Ej: Vendedor, Administrador" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isRoleModalOpen = false" />
        <UButton label="Crear Rol" @click="saveRole" />
      </div>
    </template>
  </UModal>

  <!-- Empresa Modal -->
  <UModal v-model:open="isEmpresaModalOpen" :title="isEditingEmpresa ? 'Editar Empresa' : 'Nueva Empresa'">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Nombre Legal" name="nombre_legal">
          <UInput v-model="currentEmpresa.nombre_legal" placeholder="Ej: Mi Empresa S.L." />
        </UFormField>

        <UFormField label="Nombre Comercial" name="nombre_comercial">
          <UInput v-model="currentEmpresa.nombre_comercial" placeholder="Ej: Mi Empresa" />
        </UFormField>

        <UFormField label="NIF / CIF" name="nif_cif">
          <UInput v-model="currentEmpresa.nif_cif" placeholder="B12345678" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="ghost" label="Cancelar" @click="isEmpresaModalOpen = false" />
        <UButton :label="isEditingEmpresa ? 'Guardar Cambios' : 'Crear Empresa'" @click="saveEmpresa" />
      </div>
    </template>
  </UModal>
</template>
