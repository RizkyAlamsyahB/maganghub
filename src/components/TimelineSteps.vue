<script setup>
import { ref, onMounted, computed } from 'vue'
import CountdownTimer from '@/components/CountdownTimer.vue'

const timeline = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Fetch timeline data
async function fetchTimeline() {
  try {
    isLoading.value = true
    error.value = null

    const response = await fetch('https://maganghub.kemnaker.go.id/be/v1/api/timeline')

    if (!response.ok) {
      throw new Error('Failed to fetch timeline')
    }

    const result = await response.json()
    timeline.value = result.data
  } catch (err) {
    console.error('Error fetching timeline:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Check if a step is active (current date is between started_at and finished_at)
function isStepActive(schedule) {
  if (!schedule) return false

  const now = new Date()
  const startDate = new Date(schedule.started_at)
  const endDate = new Date(schedule.finished_at)

  return now >= startDate && now <= endDate
}

// Check if a step is completed
function isStepCompleted(schedule) {
  if (!schedule) return false

  const now = new Date()
  const endDate = new Date(schedule.finished_at)

  return now > endDate
}

// Format date to Indonesian
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const schedules = computed(() => timeline.value?.timeline?.schedules || [])
const alert = computed(() => timeline.value?.timeline?.alert || null)

// Get active registration deadline
const activeDeadline = computed(() => {
  const now = new Date()
  const activeSchedule = schedules.value.find((schedule) => {
    const startDate = new Date(schedule.started_at)
    const endDate = new Date(schedule.finished_at)
    return now >= startDate && now <= endDate
  })
  return activeSchedule?.finished_at || null
})

onMounted(() => {
  fetchTimeline()
})
</script>

<template>
  <div class="mb-8">
    <!-- Countdown Timer -->
    <CountdownTimer
      v-if="activeDeadline"
      :target-date="activeDeadline"
      title="Pendaftaran Ditutup Dalam"
    />

    <!-- Alert jika ada -->
    <div
      v-if="alert && !isLoading"
      :class="[
        'mb-6 p-4 rounded-lg border text-center',
        alert.type === 'error'
          ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
          : alert.type === 'warning'
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
      ]"
    >
      <div class="flex items-center justify-center gap-2">
        <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd"
          />
        </svg>
        <p class="text-sm font-medium">{{ alert.message }}</p>
      </div>
    </div>

    <!-- Timeline Steps -->
    <div v-if="!isLoading && schedules.length > 0" class="relative">
      <!-- Timeline line (desktop) -->
      <div
        class="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"
      ></div>

      <!-- Mobile: horizontal scroll, Desktop: grid -->
      <div
        class="md:grid md:grid-cols-4 md:gap-4 flex md:flex-none overflow-x-auto gap-6 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide"
      >
        <div
          v-for="(schedule, index) in schedules"
          :key="index"
          class="relative flex-none w-64 md:w-auto snap-center"
        >
          <!-- Step indicator - centered -->
          <div class="flex flex-col items-center mb-3">
            <div
              :class="[
                'w-16 h-16 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 mb-4',
                isStepActive(schedule)
                  ? 'bg-blue-600 dark:bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900/50'
                  : isStepCompleted(schedule)
                    ? 'bg-green-600 dark:bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-700',
              ]"
            >
              <!-- Check icon for completed -->
              <svg
                v-if="isStepCompleted(schedule)"
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>

              <!-- Number for active/upcoming -->
              <span
                v-else
                :class="[
                  'text-xl font-bold',
                  isStepActive(schedule) ? 'text-white' : 'text-gray-500 dark:text-gray-400',
                ]"
              >
                {{ index + 1 }}
              </span>
            </div>
          </div>

          <!-- Step content - centered -->
          <div class="text-center">
            <h3
              :class="[
                'text-sm font-bold mb-2',
                isStepActive(schedule)
                  ? 'text-blue-600 dark:text-blue-400'
                  : isStepCompleted(schedule)
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400',
              ]"
            >
              {{ schedule.title }}
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-500 mb-2">
              {{ formatDate(schedule.started_at) }} - {{ formatDate(schedule.finished_at) }}
            </p>

            <!-- Active badge -->
            <span
              v-if="isStepActive(schedule)"
              class="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded"
            >
              <span class="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></span>
              Sedang Berjalan
            </span>

            <!-- Completed badge -->
            <span
              v-if="isStepCompleted(schedule)"
              class="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded"
            >
              Selesai
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div
        class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Error state -->
    <div
      v-if="error && !isLoading"
      class="text-center py-4 text-gray-500 dark:text-gray-400 text-sm"
    >
      Gagal memuat timeline
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
