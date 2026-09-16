import { philippines } from "@ianlabicani/geoph-lite"

// Cache to prevent redundant lazy loads
let cachedProvinces = null
const cachedLocalities = new Map()
const cachedBarangays = new Map()

/**
 * Loads all Philippine Provinces plus Metro Manila (NCR) as the 1st tier selection.
 * Metro Manila (NCR) is placed at the top for convenience, followed by all provinces alphabetically.
 */
export async function getProvincesAndRegions() {
  if (cachedProvinces) {
    return cachedProvinces
  }

  try {
    const regions = philippines.regions()
    const list = []

    // 1. Add Metro Manila (NCR) first
    list.push({
      name: "Metro Manila (NCR)",
      code: "1300000000",
      isRegion: true,
    })

    // 2. Fetch provinces from all other regions
    const provincePromises = regions
      .filter((r) => r.psgc_code !== "1300000000")
      .map(async (reg) => {
        try {
          const provs = await philippines.provinces(reg.psgc_code)
          return provs.map((p) => ({
            name: p.name,
            code: p.psgc_code,
            isRegion: false,
          }))
        } catch {
          return []
        }
      })

    const nestedProvinces = await Promise.all(provincePromises)
    const allProvinces = nestedProvinces.flat()

    // Sort provinces alphabetically
    allProvinces.sort((a, b) => a.name.localeCompare(b.name))

    // Metro Manila at top, then alphabetical provinces
    cachedProvinces = [list[0], ...allProvinces]
    return cachedProvinces
  } catch (err) {
    console.error("Failed to load provinces:", err)
    return [
      { name: "Metro Manila (NCR)", code: "1300000000", isRegion: true },
    ]
  }
}

/**
 * Loads cities and municipalities under a given province or region.
 */
export async function getLocalities(parentCode) {
  if (!parentCode) return []

  if (cachedLocalities.has(parentCode)) {
    return cachedLocalities.get(parentCode)
  }

  try {
    const localities = await philippines.localities(parentCode)
    const sorted = localities
      .map((item) => ({
        name: item.name,
        code: item.psgc_code,
        type: item.type,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    cachedLocalities.set(parentCode, sorted)
    return sorted
  } catch (err) {
    console.error(`Failed to load localities for ${parentCode}:`, err)
    return []
  }
}

/**
 * Loads barangays under a given city or municipality.
 */
export async function getBarangays(localityCode) {
  if (!localityCode) return []

  if (cachedBarangays.has(localityCode)) {
    return cachedBarangays.get(localityCode)
  }

  try {
    const barangays = await philippines.barangays(localityCode)
    const sorted = barangays
      .map((item) => ({
        name: item.name,
        code: item.psgc_code,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    cachedBarangays.set(localityCode, sorted)
    return sorted
  } catch (err) {
    console.error(`Failed to load barangays for ${localityCode}:`, err)
    return []
  }
}

/**
 * Helper to match an existing text value to a list of options (case-insensitive fuzzy match)
 */
export function matchOption(list = [], targetName = "") {
  if (!targetName) return null
  const cleanTarget = targetName.toLowerCase().trim()

  return (
    list.find((item) => item.name.toLowerCase().trim() === cleanTarget) ||
    list.find(
      (item) =>
        item.name.toLowerCase().includes(cleanTarget) ||
        cleanTarget.includes(item.name.toLowerCase())
    ) ||
    null
  )
}

