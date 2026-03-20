const { getAvailableSlave } = require('../config/database');

// Get admin dashboard statistics
exports.getDashboard = async (req, res, next) => {
  try {

    const db = getAvailableSlave();
    // Get total counts
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM elections) as total_elections,
        (SELECT COUNT(*) FROM elections WHERE is_active = 1) as active_elections,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM votes) as total_votes,
        (SELECT COUNT(*) FROM positions) as total_positions,
        (SELECT COUNT(*) FROM candidates) as total_candidates
    `);

    // Get recent elections
    const [recentElections] = await db.query(`
      SELECT 
        e.*,
        u.username as created_by_username,
        COUNT(DISTINCT p.id) as position_count,
        COUNT(DISTINCT v.id) as vote_count
      FROM elections e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN positions p ON e.id = p.election_id
      LEFT JOIN votes v ON e.id = v.election_id
      GROUP BY e.id
      ORDER BY e.created_at DESC
      LIMIT 5
    `);

    // Get recent users
    const [recentUsers] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.email,
        u.role,
        u.created_at,
        COUNT(v.id) as votes_cast
      FROM users u
      LEFT JOIN votes v ON u.id = v.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT 10
    `);

    // Get voting activity (last 7 days)
    const [votingActivity] = await db.query(`
      SELECT 
        DATE(voted_at) as date,
        COUNT(*) as vote_count
      FROM votes
      WHERE voted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(voted_at)
      ORDER BY date ASC
    `);

    res.json({
      success: true,
      data: {
        statistics: stats[0],
        recentElections,
        recentUsers,
        votingActivity
      }
    });
  } catch (error) {
    next(error);
  }
};
