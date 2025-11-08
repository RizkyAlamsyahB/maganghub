<script setup>
import { ref, onMounted, computed } from 'vue'
import { getSavedVacancies, clearAllSavedVacancies } from '@/services/bookmark'
import VacancyCard from '@/components/VacancyCard.vue'

const savedVacancies = ref([])
const searchQuery = ref('')

function loadSavedVacancies() {
  savedVacancies.value = getSavedVacancies()
}

function handleClearAll() {
  if (confirm('Apakah Anda yakin ingin menghapus semua lowongan yang tersimpan?')) {
    clearAllSavedVacancies()
    loadSavedVacancies()
  }
}

function handleBookmarkChanged() {
  loadSavedVacancies()
}

// Filter by search
const filteredVacancies = computed(() => {
  if (!searchQuery.value) return savedVacancies.value

  const query = searchQuery.value.toLowerCase()
  return savedVacancies.value.filter((vacancy) => {
    return (
      vacancy.posisi?.toLowerCase().includes(query) ||
      vacancy.perusahaan?.nama_perusahaan?.toLowerCase().includes(query) ||
      vacancy.perusahaan?.nama_provinsi?.toLowerCase().includes(query)
    )
  })
})

onMounted(() => {
  loadSavedVacancies()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Lowongan Tersimpan
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ savedVacancies.length }} lowongan disimpan
          </p>
        </div>

        <!-- Clear All Button -->
        <button
          v-if="savedVacancies.length > 0"
          @click="handleClearAll"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Hapus Semua
        </button>
      </div>

      <!-- Search -->
      <div v-if="savedVacancies.length > 0" class="max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari lowongan tersimpan..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="savedVacancies.length === 0"
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
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Belum Ada Lowongan Tersimpan
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        Klik icon ❤️ pada lowongan untuk menyimpannya
      </p>
      <a
        href="/"
        class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        Lihat Semua Lowongan
      </a>
    </div>

    <!-- Vacancy Grid -->
    <div
      v-else-if="filteredVacancies.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <VacancyCard
        v-for="vacancy in filteredVacancies"
        :key="vacancy.id_posisi"
        :vacancy="vacancy"
        @bookmark-changed="handleBookmarkChanged"
      />
    </div>

    <!-- No Search Results -->
    <div
      v-else
      class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center"
    >
      <p class="text-gray-600 dark:text-gray-400">
        Tidak ada lowongan yang cocok dengan pencarian "{{ searchQuery }}"
      </p>
    </div>
  </div>
</template>

<style scoped></style>
