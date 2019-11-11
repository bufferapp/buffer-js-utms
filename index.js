const UTM_PARAMS = [
  "utm_campaign",
  "utm_medium",
  "utm_source",
  "utm_term",
  "utm_content"
]

// default TTL is 24 hours
let ttl = 24 * 60 * 60 * 1000

module.exports = {
  refreshUtms,
  getTimeToLive,
  setTimeToLive
}

function refreshUtms(queryParams = {}, previousUtms = {}) {
  const hasNew = hasUtmParams(queryParams)
  const hasValidPrevious = isValidPreviousUtms(previousUtms)

  if (!hasNew && hasValidPrevious) {
    return previousUtms
  }

  return {
    values: getUTMParams(queryParams),
    updatedAt: Date.now()
  }
}

function getUTMParams(params = {}) {
  return UTM_PARAMS.reduce((accumulator, utmKey) => {
    if (params[utmKey]) {
      accumulator[utmKey] = params[utmKey]
    }

    return accumulator
  }, {})
}

function hasUtmParams(queryParams = {}) {
  return UTM_PARAMS.some(utmKey => !!queryParams[utmKey])
}

function isValidPreviousUtms({ utms, updatedAt } = {}) {
  if (!updatedAt) {
    return false
  }

  const now = Date.now()
  const expiresAt = updatedAt + getTimeToLive()

  return expiresAt > now
}

function getTimeToLive() {
  return ttl
}

function setTimeToLive(hours) {
  if (typeof hours === "number" && hours >= 0) {
    // store TTL in miliseconds
    ttl = hours * 60 * 60 * 1000
  }
}
