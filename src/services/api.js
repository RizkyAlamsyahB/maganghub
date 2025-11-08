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
