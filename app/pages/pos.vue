<script setup lang="ts">
definePageMeta({ layout: false })

interface Product {
  id: number
  sku: string
  name: string
  category: string
  stock: number
  price: number
}

// Datos de ejemplo basados en tus productos actuales
const products = ref<Product[]>([
  { id: 1, sku: 'HAR-001', name: 'Harina de Trigo 1kg', category: 'Panaderia', stock: 150, price: 2.50 },
  { id: 2, sku: 'SAL-001', name: 'Salsa de Tomate 500ml', category: 'Salsas', stock: 80, price: 3.20 },
  { id: 3, sku: 'QUE-001', name: 'Queso Mozzarella 500g', category: 'Lacteos', stock: 45, price: 8.50 },
  { id: 4, sku: 'ACE-001', name: 'Aceite de Oliva 1L', category: 'Aceites', stock: 60, price: 12.00 },
  { id: 5, sku: 'LEV-001', name: 'Levadura Fresca', category: 'Panaderia', stock: 5, price: 1.50 },
  { id: 6, sku: 'JAM-001', name: 'Jamón Serrano', category: 'Embutidos', stock: 3, price: 25.00 },
  { id: 7, sku: 'PIM-001', name: 'Pimientos Rojos', category: 'Verduras', stock: 8, price: 4.00 },
  { id: 8, sku: 'ORE-001', name: 'Orégano 100g', category: 'Especias', stock: 200, price: 2.00 },
  { id: 9, sku: 'PAN-001', name: 'Pan de Molde', category: 'Panaderia', stock: 30, price: 2.00 },
  { id: 10, sku: 'LECH-001', name: 'Leche Entera 1L', category: 'Lacteos', stock: 120, price: 1.20 },
  { id: 11, sku: 'YOG-001', name: 'Yogurt Natural', category: 'Lacteos', stock: 50, price: 0.80 },
  { id: 12, sku: 'AJO-001', name: 'Ajos Malla', category: 'Verduras', stock: 40, price: 1.50 },
  { id: 13, sku: 'CEB-001', name: 'Cebolla Blanca 1kg', category: 'Verduras', stock: 60, price: 1.80 },
  { id: 14, sku: 'TOM-001', name: 'Tomate Pera 1kg', category: 'Verduras', stock: 80, price: 2.10 },
  { id: 15, sku: 'MAH-001', name: 'Mayonesa', category: 'Salsas', stock: 45, price: 2.50 },
  { id: 16, sku: 'VIN-001', name: 'Vinagre de Manzana', category: 'Aceites', stock: 25, price: 1.90 },
])

const categories = ['Todos', ...new Set(products.value.map(p => p.category))]
const selectedCategory = ref('Todos')
const searchQuery = ref('')

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCategory = selectedCategory.value === 'Todos' || p.category === selectedCategory.value
    const matchSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCategory && matchSearch
  })
})

interface OrderItem {
  product: Product
  quantity: number
}

const order = ref<OrderItem[]>([])

const orderTotal = computed(() => {
  return order.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
})

const orderTaxes = computed(() => {
  return orderTotal.value * 0.21 // Asumiendo un 21% de IVA
})

function addToOrder(product: Product) {
  const existing = order.value.find(item => item.product.id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    order.value.push({ product, quantity: 1 })
  }
}

function updateQuantity(item: OrderItem, delta: number) {
  item.quantity += delta
  if (item.quantity <= 0) {
    order.value = order.value.filter(i => i.product.id !== item.product.id)
  }
}

function selectCategory(cat: string) {
  selectedCategory.value = cat
}

// Función para asignar colores bonitos a cada categoría a modo de "imagen"
function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    'Panaderia': 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800',
    'Salsas': 'bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-200 border-red-200 dark:border-red-800',
    'Lacteos': 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    'Aceites': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
    'Embutidos': 'bg-rose-100 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800',
    'Verduras': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
    'Especias': 'bg-orange-100 dark:bg-orange-900/40 text-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800',
  }
  return colors[category] || 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700'
}
</script>

<template>
  <!-- Contenedor principal ocupando toda la pantalla (layout: false) -->
  <div class="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans">
    
    <!-- BARRA SUPERIOR (Estilo Odoo) -->
    <div class="h-12 bg-gray-900 dark:bg-black text-white flex items-center justify-between px-4 shrink-0 z-20">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-primary-400">
          <UIcon name="i-lucide-store" class="w-5 h-5" />
          <span class="font-bold text-lg tracking-wide">Punto de Venta</span>
        </div>
        <span class="text-gray-400 text-sm hidden sm:inline-block">Administrador</span>
      </div>
      <NuxtLink to="/">
        <UButton icon="i-lucide-x" color="gray" variant="ghost" label="Cerrar" class="text-gray-300 hover:text-white hover:bg-gray-800" />
      </NuxtLink>
    </div>

    <!-- ÁREA PRINCIPAL POS -->
    <div class="flex-1 flex overflow-hidden">
      
      <!-- PANEL IZQUIERDO: TICKET / ORDEN -->
      <div class="w-1/3 flex flex-col bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-10 shadow-sm min-w-[320px] max-w-[400px]">
        
        <!-- Cliente / Cabecera -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-900/50 flex justify-between items-center shrink-0">
          <div class="flex items-center gap-2 cursor-pointer hover:opacity-80">
            <UAvatar icon="i-lucide-user" size="sm" class="bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300" />
            <span class="font-medium text-sm">Cliente Final</span>
          </div>
          <UButton icon="i-lucide-trash-2" variant="ghost" color="error" size="sm" @click="order = []" :disabled="!order.length" title="Vaciar orden" />
        </div>

      <!-- Lista de Productos en la Orden -->
      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        <div v-if="order.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
          <UIcon name="i-lucide-shopping-cart" class="w-12 h-12 mb-2 opacity-30" />
          <p class="text-sm">La orden está vacía</p>
        </div>
        
        <div 
          v-for="item in order" 
          :key="item.product.id"
          class="flex flex-col p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors cursor-pointer group"
        >
          <div class="flex justify-between font-medium text-[15px]">
            <span class="truncate pr-2 text-gray-900 dark:text-white">{{ item.product.name }}</span>
            <span class="text-gray-900 dark:text-white">€{{ (item.product.price * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            <span>{{ item.quantity }} Unid. a €{{ item.product.price.toFixed(2) }} / Unid.</span>
          </div>
          <!-- Controles de cantidad al pasar el ratón -->
          <div class="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <UButton icon="i-lucide-minus" size="xs" color="neutral" variant="soft" @click.stop="updateQuantity(item, -1)" />
             <span class="font-medium w-6 text-center text-sm">{{ item.quantity }}</span>
             <UButton icon="i-lucide-plus" size="xs" color="neutral" variant="soft" @click.stop="updateQuantity(item, 1)" />
          </div>
        </div>
      </div>

      <!-- Resumen de Orden y Teclado Numérico -->
      <div class="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div class="flex justify-between items-center mb-1 text-gray-500 dark:text-gray-400 text-sm">
          <span>Impuestos</span>
          <span>€{{ orderTaxes.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-center mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          <span>Total</span>
          <span>€{{ (orderTotal + orderTaxes).toFixed(2) }}</span>
        </div>
        
        <!-- Teclado estilo POS -->
        <div class="grid grid-cols-4 gap-2 mb-2">
          <UButton label="1" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="2" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="3" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="Cant" variant="solid" color="primary" class="h-12 font-medium" />
          
          <UButton label="4" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="5" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="6" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="Desc" variant="soft" color="neutral" class="h-12 font-medium bg-white dark:bg-gray-800 shadow-sm" />
          
          <UButton label="7" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="8" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="9" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="Prec" variant="soft" color="neutral" class="h-12 font-medium bg-white dark:bg-gray-800 shadow-sm" />
          
          <UButton label="+/-" variant="soft" color="neutral" class="h-12 font-medium bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="0" variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton label="." variant="soft" color="neutral" class="h-12 text-lg font-semibold bg-white dark:bg-gray-800 shadow-sm" />
          <UButton icon="i-lucide-delete" variant="soft" color="neutral" class="h-12 bg-white dark:bg-gray-800 shadow-sm" />
        </div>
        
        <UButton 
          icon="i-lucide-chevron-right" 
          label="Pagos" 
          size="xl" 
          block 
          color="success" 
          class="h-14 text-lg shadow-md mt-2 font-bold" 
          :disabled="order.length === 0"
        />
      </div>
    </div>

    <!-- PANEL DERECHO: CATEGORÍAS Y PRODUCTOS -->
    <div class="flex-1 flex flex-col min-w-0 bg-gray-100/50 dark:bg-gray-900/20">
      
      <!-- Barra Superior: Categorías y Búsqueda -->
      <div class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur flex items-center justify-between px-4 gap-4 shrink-0 shadow-sm z-10">
        <!-- Carrusel de Categorías -->
        <div class="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 py-1">
          <UButton 
            v-for="cat in categories" 
            :key="cat"
            :label="cat"
            :variant="selectedCategory === cat ? 'solid' : 'soft'"
            :color="selectedCategory === cat ? 'primary' : 'neutral'"
            @click="selectCategory(cat)"
            class="whitespace-nowrap rounded-full font-medium"
            size="sm"
          />
        </div>
        
        <!-- Búsqueda -->
        <div class="w-48 sm:w-64 shrink-0">
          <UInput 
            v-model="searchQuery" 
            icon="i-lucide-search" 
            placeholder="Buscar productos..." 
            class="w-full"
            variant="outline"
            color="white"
          />
        </div>
      </div>

      <!-- Cuadrícula de Productos -->
      <div class="flex-1 overflow-y-auto p-4 md:p-6">
        <div v-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
          <UIcon name="i-lucide-package-search" class="w-16 h-16 mb-4 opacity-40" />
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">No se encontraron productos</h3>
          <p class="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
        </div>

        <div v-else class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 auto-rows-max">
          <button 
            v-for="product in filteredProducts" 
            :key="product.id"
            @click="addToOrder(product)"
            class="relative flex flex-col h-32 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary-500/50 transition-all active:scale-95 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-left group focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <!-- Etiqueta de Precio -->
            <div class="absolute top-2 right-2 z-10">
              <UBadge color="primary" variant="solid" class="shadow-sm font-semibold opacity-90 group-hover:opacity-100">
                €{{ product.price.toFixed(2) }}
              </UBadge>
            </div>
            
            <!-- Representación visual de la categoría (reemplaza la imagen) -->
            <div :class="['h-16 w-full flex items-center justify-center border-b p-2 transition-colors', getCategoryColor(product.category)]">
              <!-- Iniciales como marcador de posición para la imagen -->
              <span class="text-2xl font-bold opacity-60 uppercase tracking-wider drop-shadow-sm">
                {{ product.name.substring(0, 2) }}
              </span>
            </div>
            
            <!-- Información del Producto -->
            <div class="p-2.5 flex-1 flex flex-col justify-between bg-white dark:bg-gray-900">
              <span class="text-sm font-medium line-clamp-2 leading-tight text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ product.name }}
              </span>
              <span class="text-[10px] text-gray-500 dark:text-gray-400 mt-1 uppercase font-bold tracking-wider">
                {{ product.category }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
/* Ocultar barra de desplazamiento para la lista de categorías, manteniendo la funcionalidad */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
