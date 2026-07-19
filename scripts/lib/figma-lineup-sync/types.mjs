/**
 * @typedef {Object} SyncConfig
 * @property {string} figmaToken
 * @property {string} apiFootballKey
 * @property {string} figmaFileKey
 * @property {string} localFixtureId
 * @property {number | null} apiFixtureId
 * @property {number} pollIntervalMs
 * @property {number} lineupRevealMs
 * @property {number} pluginPort
 * @property {string} kickoffUtc
 * @property {string} venueLabel
 */

/**
 * @typedef {Object} ApiLineupPlayer
 * @property {string} name
 * @property {number | null} number
 * @property {string | null} pos
 * @property {string | null} grid
 */

/**
 * @typedef {Object} ApiLineupSide
 * @property {string} teamName
 * @property {string | null} formation
 * @property {string | null} coach
 * @property {ApiLineupPlayer[]} startXI
 * @property {ApiLineupPlayer[]} substitutes
 */

/**
 * @typedef {Object} MatchLineupPayload
 * @property {number} apiFixtureId
 * @property {string} fetchedAt
 * @property {ApiLineupSide | null} home
 * @property {ApiLineupSide | null} away
 * @property {string} kickoffLabel
 * @property {string} venueLabel
 */

/** @typedef {Record<string, string>} TextUpdates */

export {};
