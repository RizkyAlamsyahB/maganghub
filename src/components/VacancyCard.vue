<script setup>
import { computed, ref } from 'vue'
import { isVacancySaved, saveVacancy, removeSavedVacancy } from '@/services/bookmark'

const props = defineProps({
  vacancy: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['bookmark-changed'])

const isSaved = ref(isVacancySaved(props.vacancy.id_posisi))

// Toggle bookmark
function toggleBookmark() {
  if (isSaved.value) {
    removeSavedVacancy(props.vacancy.id_posisi)
    isSaved.value = false
  } else {
    saveVacancy(props.vacancy)
    isSaved.value = true
  }
  emit('bookmark-changed')
}

// Hitung peluang diterima (%)
const acceptanceChance = computed(() => {
  const kuota = props.vacancy.jumlah_kuota
  const pendaftar = props.vacancy.jumlah_terdaftar

  if (pendaftar === 0) return 100 // Jika belum ada pendaftar, peluang 100%
  if (kuota === 0) return 0 // Jika kuota 0, peluang 0%

  const chance = (kuota / pendaftar) * 100
  return Math.min(chance, 100).toFixed(1) // Max 100%, 1 desimal
})

// Warna badge berdasarkan peluang
const chanceColor = computed(() => {
  const chance = parseFloat(acceptanceChance.value)
  if (chance >= 50) return 'text-green-600 bg-green-50'
  if (chance >= 20) return 'text-yellow-600 bg-yellow-50'
  return 'text-red-600 bg-red-50'
})
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col h-full relative"
  >
    <!-- Bookmark Button -->
    <button
      @click="toggleBookmark"
      class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
      :title="isSaved ? 'Hapus dari tersimpan' : 'Simpan lowongan'"
    >
      <svg
        class="w-6 h-6 transition-colors"
        :class="isSaved ? 'text-red-500 fill-current' : 'text-gray-400'"
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
    </button>

    <!-- Header: Logo dan Nama Perusahaan -->
    <div class="flex items-start gap-4 mb-4 pr-8">
      <div class="shrink-0">
        <img
          v-if="vacancy.perusahaan?.logo"
          :src="vacancy.perusahaan.logo"
          :alt="vacancy.perusahaan?.nama_perusahaan"
          class="w-16 h-16 object-contain rounded-md border border-gray-200 dark:border-gray-700"
          @error="(e) => (e.target.style.display = 'none')"
        />
        <div
          v-else
          class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs font-medium"
        >
          No Logo
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {{ vacancy.posisi }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">
          {{ vacancy.perusahaan?.nama_perusahaan }}
        </p>
      </div>
    </div>

    <!-- Lokasi -->
    <div class="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
      <svg class="w-4 h-4 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <span class="line-clamp-1">
        {{ vacancy.perusahaan?.nama_kabupaten }}, {{ vacancy.perusahaan?.nama_provinsi }}
      </span>
    </div>

    <!-- Badge Peluang -->
    <!-- Spacer untuk push konten ke bawah -->
    <div class="grow"></div>

    <!-- Info Kuota, Pendaftar, Peluang dan Tombol dalam 4 kolom -->
    <div class="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
      <!-- Kuota -->
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Kuota</p>
        <p class="text-base font-bold text-blue-600 dark:text-blue-400">
          {{ vacancy.jumlah_kuota }}
        </p>
      </div>

      <!-- Pendaftar -->
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Pendaftar</p>
        <p class="text-base font-bold text-gray-600 dark:text-gray-300">
          {{ vacancy.jumlah_terdaftar }}
        </p>
      </div>

      <!-- Peluang -->
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Peluang</p>
        <div
          :class="[
            'inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold',
            chanceColor,
          ]"
        >
          {{ acceptanceChance }}%
        </div>
      </div>

      <!-- Tombol Lihat Detail -->
      <div class="flex items-end">
        <a
          :href="`https://maganghub.kemnaker.go.id/lowongan/view/${vacancy.id_posisi}`"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-xs font-medium py-2 px-1 rounded-lg transition-colors duration-200"
        >
          Detail
          <svg class="w-3 h-3 inline ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
