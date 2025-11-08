<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSavedVacanciesCount } from '@/services/bookmark'

const router = useRouter()

const isDark = ref(false)
const savedCount = ref(0)

// Update saved count
function updateSavedCount() {
  savedCount.value = getSavedVacanciesCount()
}

// Listen to custom event for bookmark changes
function handleBookmarkChange() {
  updateSavedCount()
}

// Listen to storage events for cross-tab sync
window.addEventListener('storage', updateSavedCount)
window.addEventListener('bookmark-changed', handleBookmarkChange)

// Cleanup listeners
onUnmounted(() => {
  window.removeEventListener('storage', updateSavedCount)
  window.removeEventListener('bookmark-changed', handleBookmarkChange)
})

// Initialize theme from localStorage or system preference
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')

  if (savedTheme) {
    // Jika user pernah pilih tema, pakai pilihan user
    isDark.value = savedTheme === 'dark'
  } else {
    // Jika belum pernah pilih, ikuti preferensi sistem
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
  }

  // Apply tema ke DOM
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  // Load saved count
  updateSavedCount()
})

// Toggle theme
const toggleTheme = () => {
  isDark.value = !isDark.value

  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Navigate to saved page
function goToSaved() {
  router.push('/saved')
  // Update count when navigating
  setTimeout(updateSavedCount, 100)
}

// Navigate to home
function goToHome() {
  router.push('/')
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo & Title -->
        <div class="flex items-center gap-3 cursor-pointer" @click="goToHome">
          <div
            class="flex items-center justify-center w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">Magang Hub</h1>
            <p class="text-xs text-gray-600 dark:text-gray-400">Kemnaker</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Saved Vacancies Button -->
          <button
            @click="goToSaved"
            class="relative p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            title="Lowongan Tersimpan"
          >
            <svg
              class="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
              />
            </svg>
            <!-- Count Badge -->
            <span
              v-if="savedCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ savedCount > 9 ? '9+' : savedCount }}
            </span>
          </button>

          <!-- Theme Toggle Button -->
          <button
            @click="toggleTheme"
            class="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <!-- Sun Icon (Light Mode) -->
            <svg
              v-if="!isDark"
              class="w-5 h-5 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Moon Icon (Dark Mode) -->
            <svg v-else class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
