<script setup>
import { ref, onMounted, computed } from 'vue'
import { getVacancies } from '@/services/api'
import VacancyCard from '@/components/VacancyCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SearchFilter from '@/components/SearchFilter.vue'
import TimelineSteps from '@/components/TimelineSteps.vue'
import StatisticsCards from '@/components/StatisticsCards.vue'

const vacancies = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const pagination = ref(null)

// Filter states
const searchQuery = ref('')
const selectedProvince = ref('')
const selectedProdi = ref('')

// Cache untuk filtered data saat filter prodi aktif
const filteredCache = ref([])
const isCacheValid = ref(false)

// Computed properties untuk pagination
const totalPages = computed(() => pagination.value?.pagination?.last_page || 0)
const totalItems = computed(() => pagination.value?.pagination?.total || 0)
const fromItem = computed(() => pagination.value?.pagination?.from || 0)
const toItem = computed(() => pagination.value?.pagination?.to || 0)

// Generate page numbers to display
const pageNumbers = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    // Show all pages if total <= 7
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    // Show pages around current page
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
})

async function fetchVacancies() {
  isLoading.value = true
  error.value = null

  try {
    const filters = {
      search: searchQuery.value,
      province: selectedProvince.value,
    }

    let filteredData = []

    // Jika filter prodi aktif
    if (selectedProdi.value) {
      // Jika cache valid, gunakan cache
      if (isCacheValid.value && filteredCache.value.length > 0) {
        filteredData = filteredCache.value
      } else {
        // Fetch pertama untuk mendapatkan total yang akurat
        const initialResult = await getVacancies(1, 1000, filters)
        const total = initialResult.meta?.pagination?.total || 0
        const lastPage = initialResult.meta?.pagination?.last_page || 1

        console.log('Total available from API:', total) // Debug
        console.log('Last page:', lastPage) // Debug

        // Fetch multiple pages untuk mendapatkan semua data
        const allData = [...initialResult.data]

        // Fetch max 20 pages (20 x 1000 = 20,000 items) untuk performa
        const maxPages = Math.min(lastPage, 20)

        for (let page = 2; page <= maxPages; page++) {
          const pageResult = await getVacancies(page, 1000, filters)
          allData.push(...pageResult.data)
          console.log(`Fetched page ${page}/${maxPages}, total so far: ${allData.length}`)
        }

        console.log('Total data fetched:', allData.length) // Debug
        console.log('Filter prodi ID:', selectedProdi.value) // Debug

        // Debug: tampilkan sample program_studi dari 10 data pertama
        console.log('=== SAMPLE PROGRAM STUDI (10 first items) ===')
        allData.slice(0, 10).forEach((v, idx) => {
          if (v.program_studi) {
            try {
              const parsed = JSON.parse(v.program_studi)
              console.log(`Item ${idx + 1}:`, parsed)
            } catch {
              console.log(`Item ${idx + 1}: FAILED TO PARSE`)
            }
          }
        })
        console.log('===========================================')

        // Parse selected prodi IDs (bisa multiple IDs dalam array)
        let selectedProdiIds = []
        try {
          selectedProdiIds = JSON.parse(selectedProdi.value)
        } catch {
          selectedProdiIds = [selectedProdi.value] // Fallback ke single ID
        }

        console.log('Selected prodi IDs:', selectedProdiIds) // Debug

        // Filter by program studi on client-side
        filteredData = allData.filter((vacancy) => {
          if (!vacancy.program_studi) return false
          try {
            const programList = JSON.parse(vacancy.program_studi)
            // Check if any of the program studi matches any of selected IDs
            const isMatch = programList.some((program) => {
              const programId = String(program.id).trim()
              // Check if this ID is in the selected IDs array
              return selectedProdiIds.some((selectedId) => programId === String(selectedId).trim())
            })
            return isMatch
          } catch (error) {
            console.warn('Failed to parse program_studi:', vacancy.program_studi, error)
            return false
          }
        })

        console.log('Filtered results:', filteredData.length) // Debug

        // Simpan ke cache
        filteredCache.value = filteredData
        isCacheValid.value = true
      }

      // Implement client-side pagination for filtered results
      const startIndex = (currentPage.value - 1) * itemsPerPage.value
      const endIndex = startIndex + itemsPerPage.value
      const paginatedData = filteredData.slice(startIndex, endIndex)

      // Update pagination info for filtered results
      vacancies.value = paginatedData
      pagination.value = {
        pagination: {
          total: filteredData.length,
          per_page: itemsPerPage.value,
          current_page: currentPage.value,
          last_page: Math.ceil(filteredData.length / itemsPerPage.value),
          from: startIndex + 1,
          to: Math.min(endIndex, filteredData.length),
        },
      }
    } else {
      // Normal pagination
      const result = await getVacancies(currentPage.value, itemsPerPage.value, filters)
      vacancies.value = result.data
      pagination.value = result.meta
    }

    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    error.value = 'Gagal memuat data lowongan. Silakan coba lagi.'
    console.error('Error fetching vacancies:', err)
  } finally {
    isLoading.value = false
  }
}

// Filter handlers
function handleSearch(query) {
  searchQuery.value = query
  currentPage.value = 1 // Reset to first page on search
  isCacheValid.value = false // Invalidate cache
  fetchVacancies()
}

function handleFilterProvince(provinceCode) {
  selectedProvince.value = provinceCode
  currentPage.value = 1 // Reset to first page on filter
  isCacheValid.value = false // Invalidate cache
  fetchVacancies()
}

function handleFilterProdi(prodiId) {
  selectedProdi.value = prodiId
  currentPage.value = 1 // Reset to first page on filter
  isCacheValid.value = false // Invalidate cache
  filteredCache.value = [] // Clear cache
  fetchVacancies()
}

function goToPage(page) {
  if (page === '...' || page === currentPage.value) return
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page
  fetchVacancies()
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchVacancies()
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchVacancies()
  }
}

onMounted(() => {
  fetchVacancies()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Lowongan Magang Tersedia
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        Temukan peluang magang terbaik dari Magang Hub Kemnaker
      </p>

      <!-- Timeline Steps -->
      <TimelineSteps />

      <!-- Statistics Cards -->
      <StatisticsCards />
    </div>

    <!-- Search and Filter -->
    <SearchFilter
      @search="handleSearch"
      @filter-province="handleFilterProvince"
      @filter-prodi="handleFilterProdi"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <LoadingSpinner />
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center max-w-2xl mx-auto"
    >
      <svg
        class="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="text-red-700 dark:text-red-300 font-medium mb-4">{{ error }}</p>
      <button
        @click="fetchVacancies"
        class="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
      >
        Coba Lagi
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="vacancies.length === 0"
      class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center max-w-2xl mx-auto"
    >
      <svg
        class="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        Tidak ada lowongan magang tersedia saat ini
      </p>
    </div>

    <!-- Vacancy Grid -->
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <VacancyCard v-for="vacancy in vacancies" :key="vacancy.id_posisi" :vacancy="vacancy" />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12">
        <!-- Pagination Info -->
        <div class="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          Menampilkan {{ fromItem }} - {{ toItem }} dari {{ totalItems }} lowongan
        </div>

        <!-- Pagination Controls -->
        <div class="flex justify-center items-center gap-2 flex-wrap">
          <!-- Previous Button -->
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              currentPage === 1
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-700',
            ]"
          >
            ← Sebelumnya
          </button>

          <!-- Page Numbers -->
          <div class="flex gap-1">
            <button
              v-for="(page, index) in pageNumbers"
              :key="index"
              @click="goToPage(page)"
              :disabled="page === '...'"
              :class="[
                'min-w-10 h-10 rounded-lg font-medium transition-colors',
                page === currentPage
                  ? 'bg-blue-600 dark:bg-blue-500 text-white'
                  : page === '...'
                    ? 'bg-transparent text-gray-400 dark:text-gray-600 cursor-default'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-700',
              ]"
            >
              {{ page }}
            </button>
          </div>

          <!-- Next Button -->
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              currentPage === totalPages
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-700',
            ]"
          >
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
