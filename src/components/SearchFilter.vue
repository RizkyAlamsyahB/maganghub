<script setup>
import { ref, watch, onMounted } from 'vue'
import { getAllProgramStudi } from '@/services/api'

const emit = defineEmits(['search', 'filter-province', 'filter-prodi'])

const searchQuery = ref('')
const selectedProvince = ref('')
const selectedProdiList = ref([]) // Changed to array for multiple selection
const programStudiList = ref([])
const isLoadingProdi = ref(false)
const showProdiDropdown = ref(false)

// Fetch program studi list
async function fetchProgramStudi() {
  try {
    isLoadingProdi.value = true
    programStudiList.value = await getAllProgramStudi()
  } catch (error) {
    console.error('Error loading program studi:', error)
  } finally {
    isLoadingProdi.value = false
  }
}

onMounted(() => {
  fetchProgramStudi()
})

// Debounce search
let searchTimeout = null
watch(searchQuery, (newValue) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search', newValue)
  }, 500)
})

watch(selectedProvince, (newValue) => {
  emit('filter-province', newValue)
})

watch(
  selectedProdiList,
  (newValue) => {
    // Gabungkan semua IDs dari prodi yang dipilih
    const allIds = newValue.flatMap((prodi) => prodi.ids)
    emit('filter-prodi', JSON.stringify(allIds))
  },
  { deep: true },
)

// Toggle prodi selection
function toggleProdi(prodi) {
  const index = selectedProdiList.value.findIndex((p) => p.title === prodi.title)
  if (index > -1) {
    selectedProdiList.value.splice(index, 1)
  } else {
    selectedProdiList.value.push(prodi)
  }
}

// Check if prodi is selected
function isProdiSelected(prodi) {
  return selectedProdiList.value.some((p) => p.title === prodi.title)
}

// List provinsi (static - bisa diganti dengan API jika ada)
const provinces = ref([
  { code: '11', name: 'ACEH' },
  { code: '12', name: 'SUMATERA UTARA' },
  { code: '13', name: 'SUMATERA BARAT' },
  { code: '14', name: 'RIAU' },
  { code: '15', name: 'JAMBI' },
  { code: '16', name: 'SUMATERA SELATAN' },
  { code: '17', name: 'BENGKULU' },
  { code: '18', name: 'LAMPUNG' },
  { code: '19', name: 'KEPULAUAN BANGKA BELITUNG' },
  { code: '21', name: 'KEPULAUAN RIAU' },
  { code: '31', name: 'DKI JAKARTA' },
  { code: '32', name: 'JAWA BARAT' },
  { code: '33', name: 'JAWA TENGAH' },
  { code: '34', name: 'DI YOGYAKARTA' },
  { code: '35', name: 'JAWA TIMUR' },
  { code: '36', name: 'BANTEN' },
  { code: '51', name: 'BALI' },
  { code: '52', name: 'NUSA TENGGARA BARAT' },
  { code: '53', name: 'NUSA TENGGARA TIMUR' },
  { code: '61', name: 'KALIMANTAN BARAT' },
  { code: '62', name: 'KALIMANTAN TENGAH' },
  { code: '63', name: 'KALIMANTAN SELATAN' },
  { code: '64', name: 'KALIMANTAN TIMUR' },
  { code: '65', name: 'KALIMANTAN UTARA' },
  { code: '71', name: 'SULAWESI UTARA' },
  { code: '72', name: 'SULAWESI TENGAH' },
  { code: '73', name: 'SULAWESI SELATAN' },
  { code: '74', name: 'SULAWESI TENGGARA' },
  { code: '75', name: 'GORONTALO' },
  { code: '76', name: 'SULAWESI BARAT' },
  { code: '81', name: 'MALUKU' },
  { code: '82', name: 'MALUKU UTARA' },
  { code: '91', name: 'PAPUA' },
  { code: '92', name: 'PAPUA BARAT' },
])

function clearFilters() {
  searchQuery.value = ''
  selectedProvince.value = ''
  selectedProdiList.value = []
  showProdiDropdown.value = false
}
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search Input -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Cari Posisi Magang
        </label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari berdasarkan nama posisi..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      <!-- Province Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          Provinsi
        </label>
        <select
          v-model="selectedProvince"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        >
          <option value="">Semua Provinsi</option>
          <option v-for="province in provinces" :key="province.code" :value="province.code">
            {{ province.name }}
          </option>
        </select>
      </div>

      <!-- Program Studi Filter -->
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          Program Studi
          <span v-if="selectedProdiList.length > 0" class="text-blue-600 dark:text-blue-400">
            ({{ selectedProdiList.length }} dipilih)
          </span>
        </label>
        <div
          @click="showProdiDropdown = !showProdiDropdown"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <span v-if="selectedProdiList.length === 0" class="text-gray-500 dark:text-gray-400">
            {{ isLoadingProdi ? 'Memuat...' : 'Pilih Program Studi' }}
          </span>
          <span v-else class="text-sm">
            {{ selectedProdiList.map((p) => p.title).join(', ') }}
          </span>
        </div>

        <!-- Checkbox Dropdown -->
        <div
          v-if="showProdiDropdown && !isLoadingProdi"
          class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          <div
            v-for="prodi in programStudiList"
            :key="prodi.title"
            @click="toggleProdi(prodi)"
            class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2"
          >
            <input
              type="checkbox"
              :checked="isProdiSelected(prodi)"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              @click.stop
            />
            <span class="text-sm text-gray-900 dark:text-white">{{ prodi.title }}</span>
          </div>
        </div>
      </div>

      <!-- Reset Filter Button -->
      <div class="flex items-end">
        <button
          @click="clearFilters"
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
        >
          Reset Filter
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
