// helpers/candidateHelpers.js
const {getAvailableSlave} = require('../config/database');
const { broadcastElectionUpdate } = require('../socket');

const db = getAvailableSlave();
/**
 * Fetch full election by position_id
 * @param {number} positionId
 */
async function getFullElectionByPosition(positionId) {
  // get election_id from position
  const [positions] = await db.query('SELECT * FROM positions WHERE id = ?', [positionId]);
  if (positions.length === 0) throw new Error('Position not found');
  const electionId = positions[0].election_id;

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
 * Fetch election by position_id + broadcast
 * @param {number} positionId
 */
async function broadcastElectionFromCandidate(positionId) {
  const election = await getFullElectionByPosition(positionId);
  broadcastElectionUpdate(election);
  return election;
}

module.exports = { getFullElectionByPosition, broadcastElectionFromCandidate };