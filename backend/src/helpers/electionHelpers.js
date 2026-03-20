// helpers/electionHelpers.js
const { getAvailableSlave } = require('../config/database');
const { broadcastElectionUpdate } = require('../socket');
const db = getAvailableSlave();
/**
 * Fetch full election data with positions and candidates
 * @param {number} electionId
 * @returns {Object} election object
 */
async function getFullElection(electionId) {
  const [elections] = await db.query('SELECT * FROM elections WHERE id = ?', [electionId]);
  if (elections.length === 0) throw new Error('Election not found');

  const [positionsData] = await db.query(
    'SELECT * FROM positions WHERE election_id = ? ORDER BY created_at ASC',
    [electionId]
  );

  const positionsWithCandidates = [];
  for (const p of positionsData) {
    const [candidates] = await db.query(
      'SELECT id, name FROM candidates WHERE position_id = ? ORDER BY created_at ASC',
      [p.id]
    );
    positionsWithCandidates.push({
      id: p.id,
      name: p.name,
      description: p.description,
      candidates
    });
  }

  return {
    ...elections[0],
    positions: positionsWithCandidates
  };
}

/**
 * Fetch election + broadcast update (for positions)
 * @param {number} electionId
 */
async function broadcastElectionFromPosition(electionId) {
  const election = await getFullElection(electionId);
  broadcastElectionUpdate(election);
  return election;
}

module.exports = { getFullElection, broadcastElectionFromPosition };