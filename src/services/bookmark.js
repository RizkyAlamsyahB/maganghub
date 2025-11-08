// Bookmark/Save vacancies functionality using localStorage

const STORAGE_KEY = 'maganghub_saved_vacancies'

/**
 * Get all saved vacancies from localStorage
 * @returns {Array} Array of saved vacancy objects
 */
export function getSavedVacancies() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error getting saved vacancies:', error)
    return []
  }
}

/**
 * Check if a vacancy is already saved
 * @param {string} vacancyId - The id_posisi of the vacancy
 * @returns {boolean}
 */
export function isVacancySaved(vacancyId) {
  const saved = getSavedVacancies()
  return saved.some((v) => v.id_posisi === vacancyId)
}

/**
 * Emit custom event for bookmark changes
 */
function emitBookmarkChanged() {
  window.dispatchEvent(new CustomEvent('bookmark-changed'))
}

/**
 * Save a vacancy to localStorage
 * @param {Object} vacancy - The vacancy object to save
 * @returns {boolean} Success status
 */
export function saveVacancy(vacancy) {
  try {
    const saved = getSavedVacancies()

    // Check if already saved
    if (isVacancySaved(vacancy.id_posisi)) {
      return false
    }

    // Add timestamp when saved
    const vacancyWithTimestamp = {
      ...vacancy,
      saved_at: new Date().toISOString(),
    }

    saved.push(vacancyWithTimestamp)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    emitBookmarkChanged()
    return true
  } catch (error) {
    console.error('Error saving vacancy:', error)
    return false
  }
}

/**
 * Remove a saved vacancy from localStorage
 * @param {string} vacancyId - The id_posisi of the vacancy to remove
 * @returns {boolean} Success status
 */
export function removeSavedVacancy(vacancyId) {
  try {
    const saved = getSavedVacancies()
    const filtered = saved.filter((v) => v.id_posisi !== vacancyId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    emitBookmarkChanged()
    return true
  } catch (error) {
    console.error('Error removing saved vacancy:', error)
    return false
  }
}

/**
 * Clear all saved vacancies
 * @returns {boolean} Success status
 */
export function clearAllSavedVacancies() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    emitBookmarkChanged()
    return true
  } catch (error) {
    console.error('Error clearing saved vacancies:', error)
    return false
  }
}

/**
 * Get count of saved vacancies
 * @returns {number}
 */
export function getSavedVacanciesCount() {
  return getSavedVacancies().length
}
