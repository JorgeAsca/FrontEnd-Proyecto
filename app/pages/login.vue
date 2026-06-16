<script setup lang="ts">
// Deshabilitar el layout del dashboard para esta página
definePageMeta({ layout: false })

const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    toast.add({
      title: 'Error',
      description: 'Por favor, completa todos los campos.',
      color: 'error'
    })
    return
  }

  isLoading.value = true

  // Simulamos una carga de red
  await new Promise(resolve => setTimeout(resolve, 1000))

  isLoading.value = false

  // Mensaje de éxito provisional y redirección
  toast.add({
    title: 'Bienvenido',
    description: 'Has iniciado sesión correctamente.',
    color: 'success'
  })
  
  router.push('/dashboard')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
    <div class="w-full max-w-md">
      
      <!-- Logo o Título -->
      <div class="mb-8 flex flex-col items-center justify-center gap-2 text-center">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <UIcon name="i-lucide-box" class="size-7" />
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">InventoryPro</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">Ingresa a tu cuenta para continuar</p>
      </div>

      <!-- Tarjeta de Login -->
      <UCard>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
          
          <UFormField label="Correo electrónico" name="email">
            <UInput 
              v-model="email" 
              type="email" 
              placeholder="tu@email.com" 
              icon="i-lucide-mail" 
              autocomplete="email"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Contraseña" name="password">
            <div class="flex items-center justify-between">
            </div>
            <UInput 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              icon="i-lucide-lock"
              autocomplete="current-password"
              class="w-full"
            />
          </UFormField>

          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox name="remember" />
              <span class="text-gray-600 dark:text-gray-300">Recordarme</span>
            </label>
            <a href="#" class="font-medium text-primary hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          <UButton 
            type="submit" 
            block 
            size="lg" 
            :loading="isLoading"
            label="Iniciar sesión"
          />
          
        </form>

        <template #footer>
          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes cuenta? 
            <a href="#" class="font-medium text-primary hover:underline">Contacta al administrador</a>
          </p>
        </template>
      </UCard>
      
    </div>
  </div>
</template>
