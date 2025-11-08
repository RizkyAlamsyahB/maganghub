<script setup>
import { ref, onMounted } from 'vue'

const isOpen = ref(false)

onMounted(() => {
  // Cek apakah user sudah pernah menutup modal
  const hasClosedModal = localStorage.getItem('profileModalClosed')
  if (!hasClosedModal) {
    // Delay 500ms untuk smooth experience
    setTimeout(() => {
      isOpen.value = true
    }, 500)
  }
})

const closeModal = (dontShowAgain = false) => {
  isOpen.value = false
  if (dontShowAgain) {
    localStorage.setItem('profileModalClosed', 'true')
  }
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}
</script>

<template>
  <!-- Modal Backdrop -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      @click="handleBackdropClick"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <!-- Modal Content -->
      <Transition name="slide">
        <div
          v-if="isOpen"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          @click.stop
        >
          <!-- Header Simple dengan Close Button -->
          <div class="flex justify-end p-4 pb-0">
            <button
              @click="closeModal(false)"
              class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <!-- Request Fitur Section -->
            <div
              class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
            >
              <div class="flex items-start gap-3 mb-3">
                <div
                  class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1">
                    💡 Punya Ide Fitur Baru?
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Yuk request fitur atau laporkan bug! Semangat yah, mari kita kembangkan aplikasi
                    ini bareng-bareng! 🚀
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-500">
                    follow TikTok
                    <a
                      href="https://www.tiktok.com/@rizkyalamsyah.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="font-semibold text-pink-600 dark:text-pink-400 hover:underline"
                    >
                      @rizkyalamsyah.dev
                    </a>
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <a
                  href="https://wa.me/6287840177803?text=Halo%20Kak%2C%20saya%20mau%20request%20fitur%20untuk%20aplikasi%20Magang%20Hub%3A%0A"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                    />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="mailto:rizkyalamsyah.dev@gmail.com?subject=Request%20Fitur%20Aplikasi%20Magang%20Hub&body=Halo%20Kak%2C%0A%0ASaya%20mau%20request%20fitur%3A%0A"
                  class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    />
                  </svg>
                  Email
                </a>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4">
            <button
              @click="closeModal(false)"
              class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Fade transition untuk backdrop */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition untuk modal */
.slide-enter-active {
  transition: all 0.3s ease;
}

.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
