const API_BASE_URL = 'https://maganghub.kemnaker.go.id/be/v1/api/list/vacancies-aktif'

/**
 * Mengambil data lowongan magang dari API Magang Hub Kemnaker
 * @param {number} page - Nomor halaman (default: 1)
 * @param {number} limit - Jumlah data per halaman (default: 20)
 * @param {Object} filters - Filter options
 * @param {string} filters.search - Search query untuk nama posisi
 * @param {string} filters.province - Kode provinsi
 * @returns {Promise<{data: Array, meta: Object}>} Object containing vacancy data and pagination metadata
 */
export async function getVacancies(page = 1, limit = 20, filters = {}) {
  try {
    const params = new URLSearchParams({
      order_by: 'jumlah_kuota',
      order_direction: 'DESC',
      page: page.toString(),
      limit: limit.toString(),
    })

    // Tambahkan filter jika ada
    if (filters.search) {
      params.append('keyword', filters.search) // API uses 'keyword' not 'search'
    }
    if (filters.province) {
      params.append('kode_provinsi', filters.province)
    }

    const response = await fetch(`${API_BASE_URL}?${params}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Validasi response data
    if (!result.data || !Array.isArray(result.data)) {
      throw new Error('Invalid API response format')
    }

    return {
      data: result.data,
      meta: result.meta || null,
    }
  } catch (error) {
    console.error('Error fetching vacancies:', error)
    throw error
  }
}

/**
 * Mengambil statistik dari API front page
 * @returns {Promise<Object>} Object containing statistics data
 */
export async function getStatistics() {
  try {
    const response = await fetch('https://maganghub.kemnaker.go.id/be/v1/api/statistik_front_page')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (!result.data) {
      throw new Error('Invalid API response format')
    }

    return {
      totalLowongan: result.data['Jumlah Lowongan'] || 0,
      totalLowonganVerifikasi: result.data['Jumlah Lowongan Terverifikasi'] || 0,
      totalPelamar: result.data['Jumlah Pelamar'] || 0,
      totalPendaftar: result.data['Jumlah Pendaftar Magang'] || 0,
      totalPerusahaan: result.data['Jumlah Perusahaan'] || 0,
      totalPeserta: result.data['Jumlah Peserta Magang'] || 0,
    }
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error
  }
}

/**
 * Mengambil semua program studi unik dari data lowongan
 * @returns {Promise<Array>} Array of program studi objects {id, title}
 */
export async function getAllProgramStudi() {
  try {
    // Ambil semua lowongan dengan limit yang lebih besar
    const response = await fetch(
      `${API_BASE_URL}?limit=10000&order_by=jumlah_kuota&order_direction=DESC`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    if (!result.data || !Array.isArray(result.data)) {
      throw new Error('Invalid API response format')
    }

    console.log('Total vacancies fetched:', result.data.length) // Debug log

    // Map untuk group program studi berdasarkan title (case-insensitive)
    // Value: array of IDs dengan title yang sama
    const programStudiGroupMap = new Map()

    result.data.forEach((vacancy) => {
      if (vacancy.program_studi) {
        try {
          // Parse JSON string
          const programList = JSON.parse(vacancy.program_studi)
          programList.forEach((program) => {
            if (program.id && program.title) {
              // Normalize title (lowercase, trim, remove extra spaces)
              const normalizedTitle = program.title.trim().toLowerCase().replace(/\s+/g, ' ') // Replace multiple spaces with single space

              // Jika title belum ada, buat entry baru
              if (!programStudiGroupMap.has(normalizedTitle)) {
                programStudiGroupMap.set(normalizedTitle, {
                  title: program.title.trim(), // Keep original case
                  ids: new Set(), // Set untuk avoid duplicate IDs
                })
              }

              // Tambahkan ID ke group
              programStudiGroupMap.get(normalizedTitle).ids.add(program.id)
            }
          })
        } catch (error) {
          console.warn('Failed to parse program_studi:', vacancy.program_studi, error)
        }
      }
    })

    // Convert Map ke array dan convert Set ke Array untuk IDs
    const programStudiList = Array.from(programStudiGroupMap.values())
      .map((item) => ({
        title: item.title,
        ids: Array.from(item.ids), // Convert Set to Array
      }))
      .sort((a, b) => a.title.localeCompare(b.title))

    console.log('Total unique program studi found:', programStudiList.length) // Debug log
    console.log('Program studi list:', programStudiList) // Debug log

    return programStudiList
  } catch (error) {
    console.error('Error fetching program studi:', error)
    throw error
  }
}
