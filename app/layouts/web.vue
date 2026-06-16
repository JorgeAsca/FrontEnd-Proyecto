<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const navItems = computed<NavigationMenuItem[]>(() => [
  { label: 'Características', to: '#caracteristicas' },
  { label: 'Cómo funciona', to: '#como-funciona' },
  { label: 'Contacto', to: '#contacto' }
])

const isMobileMenuOpen = ref(false)

</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="sticky top-0 z-50 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur">
      <!-- Logo a la izquierda -->
      <div class="flex items-center gap-2 w-1/4">
        <div class="size-8 rounded-lg bg-(--color-primary-500) flex items-center justify-center">
          <UIcon name="i-lucide-box" class="size-5 text-white" />
        </div>
        <span class="font-bold text-xl">InventApp</span>
      </div>

      <!-- Menú en el centro -->
      <div class="flex-1 flex justify-center hidden lg:flex">
        <UNavigationMenu :items="navItems" />
      </div>

      <!-- Botones a la derecha -->
      <div class="flex items-center justify-end gap-2 w-1/4">
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="ghost"
            @click="isDark = !isDark"
            aria-label="Cambiar tema"
          />
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
        
        <UButton 
          label="Acceder" 
          color="neutral" 
          variant="ghost" 
          class="hidden sm:flex"
          to="/login"
        />
        <UButton 
          label="Prueba Gratis" 
          color="primary" 
          class="hidden lg:flex"
          to="/login"
        />
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          @click="isMobileMenuOpen = true"
          aria-label="Abrir menú"
        />
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <UFooter class="border-t border-default">
      <template #left>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="size-6 rounded-md bg-primary flex items-center justify-center">
              <UIcon name="i-lucide-box" class="size-4 text-white" />
            </div>
            <span class="font-semibold">InventApp</span>
          </div>
          <USeparator orientation="vertical" class="h-4" />
          <p class="text-muted text-sm">
            © {{ new Date().getFullYear() }} InventApp. Todos los derechos reservados.
          </p>
        </div>
      </template>
      <template #right>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-simple-icons-linkedin"
            color="neutral"
            variant="ghost"
            to="https://linkedin.com"
            target="_blank"
            aria-label="LinkedIn"
          />
          <UButton
            icon="i-simple-icons-x"
            color="neutral"
            variant="ghost"
            to="https://x.com"
            target="_blank"
            aria-label="X (Twitter)"
          />
          <UButton
            icon="i-simple-icons-instagram"
            color="neutral"
            variant="ghost"
            to="https://instagram.com"
            target="_blank"
            aria-label="Instagram"
          />
        </div>
      </template>
    </UFooter>

    <!-- Backdrop -->
    <div 
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Menú lateral -->
    <div 
      v-if="isMobileMenuOpen"
      class="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] z-50 bg-white dark:bg-neutral-900 flex flex-col p-6 shadow-2xl border-l border-gray-200 dark:border-gray-800"
    >
      <div class="flex items-center justify-between mb-8">
        <span class="font-bold text-xl">Menú</span>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          @click="isMobileMenuOpen = false"
          aria-label="Cerrar menú"
        />
      </div>
      
      <div class="flex flex-col gap-2">
        <UButton 
          v-for="item in navItems" 
          :key="item.label"
          :to="item.to" 
          variant="ghost"
          color="neutral"
          class="justify-start text-lg py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
          @click="isMobileMenuOpen = false"
        >
          {{ item.label }}
        </UButton>
      </div>
      
      <div class="mt-auto flex flex-col gap-4 pt-8">
        <UButton 
          label="Acceder" 
          color="neutral" 
          variant="outline" 
          size="lg"
          block
          to="/login"
          @click="isMobileMenuOpen = false"
        />
        <UButton 
          label="Prueba Gratis" 
          color="primary" 
          size="lg"
          block
          to="/login"
          @click="isMobileMenuOpen = false"
        />
      </div>
    </div>
  </div>
</template>
