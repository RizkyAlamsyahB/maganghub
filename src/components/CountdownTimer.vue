<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  targetDate: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Pendaftaran Ditutup Dalam',
  },
})

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const isExpired = ref(false)

let intervalId = null

function updateCountdown() {
  const now = new Date().getTime()
  const target = new Date(props.targetDate).getTime()
  const distance = target - now

  if (distance < 0) {
    isExpired.value = true
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    if (intervalId) {
      clearInterval(intervalId)
    }
    return
  }

  days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
}

onMounted(() => {
  updateCountdown()
  intervalId = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div
    v-if="!isExpired"
    class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6"
  >
    <div class="flex items-center justify-center gap-2 mb-3">
      <svg
        class="w-5 h-5 text-orange-600 dark:text-orange-400"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clip-rule="evenodd"
        />
      </svg>
      <h3 class="text-sm font-bold text-orange-700 dark:text-orange-300">{{ title }}</h3>
    </div>

    <div class="grid grid-cols-4 gap-3">
      <!-- Days -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
        <div class="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
          {{ days }}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Hari</div>
      </div>

      <!-- Hours -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
        <div class="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
          {{ String(hours).padStart(2, '0') }}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Jam</div>
      </div>

      <!-- Minutes -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
        <div class="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
          {{ String(minutes).padStart(2, '0') }}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Menit</div>
      </div>

      <!-- Seconds -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
        <div class="text-2xl md:text-3xl font-bold text-orange-600 dark:text-orange-400">
          {{ String(seconds).padStart(2, '0') }}
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Detik</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
