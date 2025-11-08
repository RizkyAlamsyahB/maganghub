<script setup>
import { ref, onMounted } from 'vue'
import { getStatistics } from '@/services/api'

const stats = ref(null)
const isLoading = ref(true)
const error = ref(null)

async function fetchStatistics() {
  try {
    isLoading.value = true
    error.value = null
    stats.value = await getStatistics()
  } catch (err) {
    console.error('Error fetching statistics:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Format number with thousand separator
function formatNumber(num) {
  return new Intl.NumberFormat('id-ID').format(num)
}

onMounted(() => {
  fetchStatistics()
})
</script>

<template>
  <div class="mb-8">
    <!-- Loading state -->
    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div
        v-for="i in 5"
        :key="i"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse"
      >
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-3"></div>
        <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
      </div>
    </div>

    <!-- Statistics cards -->
    <div v-else-if="stats && !error" class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <!-- Total Lowongan -->
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex flex-col">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Lowongan</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ formatNumber(stats.totalLowongan) }}
          </p>
        </div>
      </div>

      <!-- Total Pelamar -->
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex flex-col">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Pelamar</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ formatNumber(stats.totalPelamar) }}
          </p>
        </div>
      </div>

      <!-- Total Pendaftar -->
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex flex-col">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Pendaftar</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ formatNumber(stats.totalPendaftar) }}
          </p>
        </div>
      </div>

      <!-- Total Perusahaan -->
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex flex-col">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Perusahaan</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ formatNumber(stats.totalPerusahaan) }}
          </p>
        </div>
      </div>

      <!-- Total Peserta Magang -->
      <div
        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex flex-col">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Peserta</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ formatNumber(stats.totalPeserta) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div
      v-if="error && !isLoading"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center"
    >
      <p class="text-sm text-red-700 dark:text-red-300">Gagal memuat statistik</p>
    </div>
  </div>
</template>
