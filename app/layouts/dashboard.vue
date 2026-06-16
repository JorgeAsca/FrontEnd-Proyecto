<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const mainNavItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard',
  },
  {
    label: 'Productos',
    icon: 'i-lucide-package',
    to: '/productos',
  },
  {
    label: 'Categorias',
    icon: 'i-lucide-tags',
    to: '/categorias',
  },
  {
    label: 'Movimientos',
    icon: 'i-lucide-arrow-left-right',
    to: '/movimientos',
  },
  {
    label: 'Proveedores',
    icon: 'i-lucide-truck',
    to: '/proveedores',
  },
  {
    label: 'Almacenes',
    icon: 'i-lucide-warehouse',
    to: '/almacenes',
  },
  {
    label: 'Stock / Alertas',
    icon: 'i-lucide-bell',
    to: '/stock',
  },
])

const settingsNavItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Reportes',
    icon: 'i-lucide-bar-chart-3',
    to: '/reportes',
  },
  {
    label: 'Configuracion',
    icon: 'i-lucide-settings',
    to: '/configuracion',
  },
])

const colorMode = useColorMode()
function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar
      collapsible
      resizable
      class="bg-neutral-950 text-white dark border-r border-white/10"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 p-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UIcon name="i-lucide-box" class="size-5" />
          </div>
          <span v-if="!collapsed" class="font-semibold text-white">InventoryPro</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <div class="flex flex-col gap-4 p-2">
          <UNavigationMenu
            :items="mainNavItems"
            orientation="vertical"
            :ui="{ 
              link: [collapsed ? 'justify-center' : undefined, 'text-zinc-400 hover:text-white hover:bg-white/5'],
              linkActive: 'text-white bg-white/10'
            }"
          />

          <USeparator class="border-white/10" />

          <UNavigationMenu
            :items="settingsNavItems"
            orientation="vertical"
            :ui="{ 
              link: [collapsed ? 'justify-center' : undefined, 'text-zinc-400 hover:text-white hover:bg-white/5'],
              linkActive: 'text-white bg-white/10'
            }"
          />

          <ClientOnly>
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
              variant="ghost"
              :label="collapsed ? undefined : (colorMode.value === 'dark' ? 'Modo claro' : 'Modo oscuro')"
              :class="[
                collapsed ? 'justify-center w-full' : 'justify-start w-full',
                'text-zinc-400 hover:text-white hover:bg-white/5'
              ]"
              @click="toggleTheme"
            />
            <template #fallback>
              <div class="h-8 w-full" />
            </template>
          </ClientOnly>
        </div>
      </template>

      <template #footer="{ collapsed }">
        <div class="border-t border-white/10 p-2">
          <UDropdownMenu
            :items="[
              [
                { label: 'Mi perfil', icon: 'i-lucide-user', to: '/perfil', class: 'text-white' },
                { label: 'Preferencias', icon: 'i-lucide-settings-2', to: '/preferencias', class: 'text-white' },
              ],
              [
                { label: 'Cerrar sesion', icon: 'i-lucide-log-out', color: 'error' as const, to: '/login' },
              ],
            ]"
            :ui="{ content: 'bg-neutral-900 border-white/10 text-white dark' }"
          >
            <UButton
              variant="ghost"
              block
              :class="[
                collapsed ? 'justify-center' : 'justify-start',
                'text-zinc-400 hover:text-white hover:bg-white/5'
              ]"
            >
              <UAvatar
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=admin"
                alt="Admin"
                size="xs"
              />
              <span v-if="!collapsed" class="truncate text-white">Administrador</span>
              <UIcon v-if="!collapsed" name="i-lucide-chevron-down" class="ml-auto size-4" />
            </UButton>
          </UDropdownMenu>
        </div>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>
