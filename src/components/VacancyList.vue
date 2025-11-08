<script setup>
import { ref, onMounted, computed } from 'vue'
import { getVacancies } from '@/services/api'
import VacancyCard from '@/components/VacancyCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SearchFilter from '@/components/SearchFilter.vue'

const vacancies = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const pagination = ref(null)

// Filter states
const searchQuery = ref('')
const selectedProvince = ref('')

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

    const result = await getVacancies(currentPage.value, itemsPerPage.value, filters)
    vacancies.value = result.data
    pagination.value = result.meta

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
  fetchVacancies()
}

function handleFilterProvince(provinceCode) {
  selectedProvince.value = provinceCode
  currentPage.value = 1 // Reset to first page on filter
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
      <p class="text-gray-600 dark:text-gray-400">
        Temukan peluang magang terbaik dari Magang Hub Kemnaker
      </p>
    </div>

    <!-- Search and Filter -->
    <SearchFilter @search="handleSearch" @filter-province="handleFilterProvince" />

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
