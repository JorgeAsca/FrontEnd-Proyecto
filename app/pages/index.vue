<script setup lang="ts">
definePageMeta({ layout: 'web' })
const features = [
  {
    title: 'Control de Rendimiento',
    description: 'Calcula automáticamente cuántos productos puedes elaborar con el inventario disponible. Saber exactamente cuántas pizzas, hamburguesas o postres puedes preparar.',
    icon: 'i-lucide-calculator'
  },
  {
    title: 'Pedidos Automáticos',
    description: 'Configura límites de stock y deja que el sistema haga pedidos a tus proveedores automáticamente cuando llegues al mínimo establecido.',
    icon: 'i-lucide-truck'
  },
  {
    title: 'Gestión de Proveedores',
    description: 'Administra todos tus proveedores en un solo lugar. Guarda contactos, precios y condiciones para hacer pedidos con un clic.',
    icon: 'i-lucide-users'
  },
  {
    title: 'Alertas Inteligentes',
    description: 'Recibe notificaciones cuando el stock esté bajo, cuando un producto esté por caducar o cuando se complete un pedido.',
    icon: 'i-lucide-bell'
  },
  {
    title: 'Reportes Detallados',
    description: 'Analiza el movimiento de tu inventario, identifica productos más vendidos y optimiza tus compras con datos reales.',
    icon: 'i-lucide-bar-chart-3'
  },
  {
    title: 'Multi-dispositivo',
    description: 'Accede desde cualquier lugar. Funciona en tu computadora, tablet o móvil para que siempre tengas el control.',
    icon: 'i-lucide-smartphone'
  }
]

const steps = [
  {
    number: '01',
    title: 'Registra tu Inventario',
    description: 'Añade tus productos, ingredientes y materiales. Define las cantidades actuales y los costos.'
  },
  {
    number: '02',
    title: 'Configura tus Recetas',
    description: 'Indica cuánto de cada ingrediente necesitas para elaborar cada producto final.'
  },
  {
    number: '03',
    title: 'Establece tus Límites',
    description: 'Define el stock mínimo para cada producto y añade los proveedores correspondientes.'
  },
  {
    number: '04',
    title: 'Deja que InventApp Trabaje',
    description: 'El sistema calculará rendimientos, alertará sobre stock bajo y gestionará pedidos automáticamente.'
  }
]


const faqs = [
  {
    label: '¿Puedo probar InventApp antes de pagar?',
    content: 'Sí, ofrecemos un plan gratuito permanente y 14 días de prueba en el plan Profesional sin necesidad de tarjeta de crédito.'
  },
  {
    label: '¿Cómo funciona el control de rendimiento?',
    content: 'Configuras las recetas indicando cuánto de cada ingrediente necesitas. El sistema calcula automáticamente cuántas unidades puedes elaborar con el stock disponible.'
  },
  {
    label: '¿Los pedidos automáticos se envían solos?',
    content: 'Por defecto, el sistema te notifica y prepara el pedido para que lo revises. Puedes activar el envío completamente automático si lo prefieres.'
  },
  {
    label: '¿Puedo importar mi inventario actual?',
    content: 'Sí, puedes importar productos desde Excel o CSV. También ofrecemos asistencia para la migración desde otros sistemas.'
  },
  {
    label: '¿Funciona para cualquier tipo de negocio?',
    content: 'InventApp está diseñado para restaurantes, cafeterías, panaderías, tiendas y cualquier negocio que necesite controlar inventario y calcular rendimientos.'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:to-primary/5" />
      <div class="absolute top-20 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
      <div class="absolute bottom-0 left-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-10" />
      
      <UContainer class="relative py-24 lg:py-32">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div class="flex-1 text-center lg:text-left">
            <UBadge 
              color="primary" 
              variant="subtle" 
              class="mb-6"
            >
              Nuevo: Pedidos automáticos a proveedores
            </UBadge>
            
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-pretty tracking-tight mb-6">
              Controla tu inventario con
              <span class="text-primary">inteligencia</span>
            </h1>
            
            <p class="text-lg lg:text-xl text-muted max-w-2xl mx-auto lg:mx-0 mb-8 text-pretty">
              InventApp calcula cuántos productos puedes elaborar con tu stock y automatiza los pedidos a proveedores. 
              Menos tiempo contando, más tiempo haciendo crecer tu negocio.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <UButton 
                size="xl" 
                label="Comenzar Gratis"
                trailing-icon="i-lucide-arrow-right"
              />

            </div>
            
            <div class="flex items-center gap-6 mt-8 justify-center lg:justify-start text-sm text-muted">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-check-circle" class="size-5 text-primary" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-check-circle" class="size-5 text-primary" />
                <span>Configuración en 5 minutos</span>
              </div>
            </div>
          </div>
          
          <div class="flex-1 w-full max-w-xl lg:max-w-none">
            <div class="relative">
              <div class="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-2xl opacity-50" />
              <div class="relative bg-elevated rounded-2xl border border-default shadow-2xl overflow-hidden">
                <!-- App Preview Mock -->
                <div class="bg-muted/50 px-4 py-3 border-b border-default flex items-center gap-2">
                  <div class="flex gap-1.5">
                    <div class="size-3 rounded-full bg-red-400" />
                    <div class="size-3 rounded-full bg-yellow-400" />
                    <div class="size-3 rounded-full bg-green-400" />
                  </div>
                  <div class="flex-1 text-center">
                    <span class="text-xs text-muted">inventapp.store</span>
                  </div>
                </div>
                <div class="p-6">
                  <!-- Stock Overview -->
                  <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-default rounded-lg p-3 border border-default">
                      <p class="text-xs text-muted mb-1">Stock Total</p>
                      <p class="text-xl font-bold">2,847</p>
                    </div>
                    <div class="bg-default rounded-lg p-3 border border-default">
                      <p class="text-xs text-muted mb-1">Stock Bajo</p>
                      <p class="text-xl font-bold text-yellow-500">12</p>
                    </div>
                    <div class="bg-default rounded-lg p-3 border border-default">
                      <p class="text-xs text-muted mb-1">Pedidos</p>
                      <p class="text-xl font-bold text-primary">3</p>
                    </div>
                  </div>
                  
                  <!-- Yield Calculator Example -->
                  <div class="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
                    <div class="flex items-center gap-2 mb-3">
                      <UIcon name="i-lucide-calculator" class="size-5 text-primary" />
                      <span class="font-semibold text-sm">Control de Rendimiento</span>
                    </div>
                    <div class="space-y-2">
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-muted">Harina disponible</span>
                        <span class="font-medium">600g</span>
                      </div>
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-muted">Harina por pizza</span>
                        <span class="font-medium">150g</span>
                      </div>
                      <USeparator class="my-2" />
                      <div class="flex justify-between items-center">
                        <span class="font-medium">Pizzas posibles</span>
                        <UBadge color="primary" size="lg">4 unidades</UBadge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Features Section -->
    <section id="caracteristicas" class="py-24 bg-muted/30">
      <UContainer>
        <div class="text-center max-w-3xl mx-auto mb-16">
          <UBadge color="primary" variant="subtle" class="mb-4">Características</UBadge>
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Todo lo que necesitas para gestionar tu inventario
          </h2>
          <p class="text-lg text-muted">
            Herramientas pensadas para pequeños negocios que quieren trabajar de forma más inteligente.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard 
            v-for="feature in features" 
            :key="feature.title"
            class="hover:border-primary/50 transition-colors"
          >
            <div class="flex flex-col h-full">
              <div class="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <UIcon :name="feature.icon" class="size-6 text-primary" />
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
              <p class="text-muted text-sm flex-1">{{ feature.description }}</p>
            </div>
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- How It Works Section -->
    <section id="como-funciona" class="py-24">
      <UContainer>
        <div class="text-center max-w-3xl mx-auto mb-16">
          <UBadge color="primary" variant="subtle" class="mb-4">Cómo funciona</UBadge>
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Empieza en minutos, no en días
          </h2>
          <p class="text-lg text-muted">
            Configura tu inventario rápidamente y deja que InventApp haga el trabajo pesado.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="step in steps" :key="step.number" class="relative">
            <div class="text-6xl font-bold text-primary/10 absolute -top-4 -left-2">
              {{ step.number }}
            </div>
            <div class="relative pt-8">
              <h3 class="text-lg font-semibold mb-2">{{ step.title }}</h3>
              <p class="text-muted text-sm">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Detailed Features Section -->
    <section class="py-24 bg-muted/30">
      <UContainer>
        <!-- Feature 1: Yield Control -->
        <div class="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <UBadge color="primary" variant="subtle" class="mb-4">Control de Rendimiento</UBadge>
            <h2 class="text-3xl sm:text-4xl font-bold mb-6">
              Saber exactamente qué puedes producir
            </h2>
            <p class="text-lg text-muted mb-6">
              No más cálculos mentales ni sorpresas. InventApp te dice en tiempo real cuántas unidades de cada producto puedes elaborar con el inventario disponible.
            </p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <UIcon name="i-lucide-check" class="size-5 text-primary mt-0.5" />
                <span>Configura las recetas una vez, actualízate para siempre</span>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="i-lucide-check" class="size-5 text-primary mt-0.5" />
                <span>Calcula costos de producción automáticamente</span>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="i-lucide-check" class="size-5 text-primary mt-0.5" />
                <span>Planifica mejor tus compras y producción</span>
              </li>
            </ul>
          </div>
          <div class="bg-elevated rounded-2xl border border-default p-6 shadow-xl">
            <div class="space-y-4">
              <div class="flex items-center justify-between pb-4 border-b border-default">
                <h3 class="font-semibold">Calculadora de Rendimiento</h3>
                <UBadge color="primary" variant="subtle">En vivo</UBadge>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-muted/50 rounded-lg p-4">
                  <p class="text-sm text-muted mb-1">Tomate (kg)</p>
                  <p class="text-2xl font-bold">5.2</p>
                </div>
                <div class="bg-muted/50 rounded-lg p-4">
                  <p class="text-sm text-muted mb-1">Mozzarella (kg)</p>
                  <p class="text-2xl font-bold">3.8</p>
                </div>
                <div class="bg-muted/50 rounded-lg p-4">
                  <p class="text-sm text-muted mb-1">Masa (uds)</p>
                  <p class="text-2xl font-bold">24</p>
                </div>
                <div class="bg-muted/50 rounded-lg p-4">
                  <p class="text-sm text-muted mb-1">Jamón (kg)</p>
                  <p class="text-2xl font-bold">2.1</p>
                </div>
              </div>
              <USeparator />
              <div class="bg-primary/10 rounded-lg p-4">
                <p class="text-sm text-muted mb-2">Puedes preparar:</p>
                <div class="flex items-baseline gap-2">
                  <span class="text-4xl font-bold text-primary">19</span>
                  <span class="text-muted">pizzas margarita</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature 2: Auto Orders -->
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="order-2 lg:order-1 bg-elevated rounded-2xl border border-default p-6 shadow-xl">
            <div class="space-y-4">
              <div class="flex items-center justify-between pb-4 border-b border-default">
                <h3 class="font-semibold">Pedidos Automáticos</h3>
                <UBadge color="success" variant="subtle">Activo</UBadge>
              </div>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-alert-triangle" class="size-5 text-yellow-500" />
                    <div>
                      <p class="font-medium text-sm">Harina 00</p>
                      <p class="text-xs text-muted">Stock: 2kg / Mínimo: 5kg</p>
                    </div>
                  </div>
                  <UBadge color="warning" size="sm">Preparando</UBadge>
                </div>
                <div class="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-truck" class="size-5 text-primary" />
                    <div>
                      <p class="font-medium text-sm">Aceite de Oliva</p>
                      <p class="text-xs text-muted">Pedido enviado a Distribuciones López</p>
                    </div>
                  </div>
                  <UBadge color="primary" size="sm">Enviado</UBadge>
                </div>
                <div class="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-default">
                  <div class="flex items-center gap-3">
                    <UIcon name="i-lucide-check-circle" class="size-5 text-green-500" />
                    <div>
                      <p class="font-medium text-sm">Mozzarella</p>
                      <p class="text-xs text-muted">Entregado hace 2 horas</p>
                    </div>
                  </div>
                  <UBadge color="success" size="sm">Completado</UBadge>
                </div>
              </div>
            </div>
          </div>
          <div class="order-1 lg:order-2">
            <UBadge color="primary" variant="subtle" class="mb-4">Automatización</UBadge>
            <h2 class="text-3xl sm:text-4xl font-bold mb-6">
              Nunca más te quedes sin stock
            </h2>
            <p class="text-lg text-muted mb-6">
              Configura el stock mínimo para cada producto y InventApp se encarga del resto. Cuando un producto llegue al límite, el sistema genera un pedido automático al proveedor.
            </p>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <UIcon name="i-lucide-check" class="size-5 text-primary mt-0.5" />
                <span>Define límites personalizados por producto</span>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="i-lucide-check" class="size-5 text-primary mt-0.5" />
                <span>Asocia proveedores preferidos a cada producto</span>
              </li>
              <li class="flex items-start gap-3">
                <UIcon name="i-lucide-check" class="size-5 text-primary mt-0.5" />
                <span>Revisa o aprueba pedidos antes de enviar</span>
              </li>
            </ul>
          </div>
        </div>
      </UContainer>
    </section>


    <!-- FAQ Section -->
    <section class="py-24 bg-muted/30">
      <UContainer>
        <div class="text-center max-w-3xl mx-auto mb-16">
          <UBadge color="primary" variant="subtle" class="mb-4">FAQ</UBadge>
          <h2 class="text-3xl sm:text-4xl font-bold mb-4">
            Preguntas frecuentes
          </h2>
          <p class="text-lg text-muted">
            Resolvemos tus dudas para que puedas empezar cuanto antes.
          </p>
        </div>
        
        <div class="max-w-3xl mx-auto">
          <UAccordion :items="faqs" />
        </div>
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section id="contacto" class="py-24">
      <UContainer>
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-600 p-12 lg:p-16 text-center">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div class="relative">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Empieza a controlar tu inventario hoy
            </h2>
            <p class="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Únete a cientos de negocios que ya ahorran tiempo y dinero con InventApp.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <UButton 
                size="xl" 
                color="neutral"
                label="Comenzar Gratis"
                trailing-icon="i-lucide-arrow-right"
              />
              <UButton 
                size="xl" 
                variant="outline"
                class="ring-white text-white hover:bg-white/10 dark:ring-white dark:text-white dark:hover:bg-white/10"
                label="Hablar con Ventas"
                icon="i-lucide-message-circle"
              />
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
