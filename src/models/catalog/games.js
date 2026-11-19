// Admin-side queries for board games: list everything (including hidden games), add, update, hide/show.
// The public catalog queries live in catalog.js.

import db from '../db.js';

// Same field names the views use. Copy counts come from game_copies.
const SELECT_GAMES_ADMIN = `
    SELECT g.id, g.title, g.description, g.players,
           g.play_time AS "playTime",
           g.difficulty, g.image,
           g.is_active AS "isActive",
           g.category_id AS "categoryId",
           c.name AS category,
           c.is_active AS "categoryActive",
           COUNT(gc.id) AS "copyCount",
           COUNT(gc.id) FILTER (WHERE gc.availability_status = TRUE) AS "availableCount"
    FROM board_games g
    JOIN categories c ON c.id = g.category_id
    LEFT JOIN game_copies gc ON gc.game_id = g.id
`;

const GROUP_GAMES = 'GROUP BY g.id, c.id'; // both are primary keys, so every selected game/category column is covered

// All games, including inactive ones
const getAllGames = async () => {
    const { rows } = await db.query(`${SELECT_GAMES_ADMIN} ${GROUP_GAMES} ORDER BY g.title`);
    return rows;
};

// One game by id (undefined if there is none)
const getGameById = async (id) => {
    const { rows } = await db.query(`${SELECT_GAMES_ADMIN} WHERE g.id = $1 ${GROUP_GAMES}`, [id]);
    return rows[0];
};

// Insert a new game. The id is a slug such as 'TICKET-TO-RIDE'.
const addGame = async ({ id, title, description, players, playTime, difficulty, categoryId, image, isActive }) => {
    const { rows } = await db.query(
        `INSERT INTO board_games (id, title, description, players, play_time, difficulty, category_id, image, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [id, title, description, players, playTime, difficulty, categoryId, image, isActive]
    );
    return rows[0];
};

// Update a game by id (undefined if there is none)
const updateGame = async (id, { title, description, players, playTime, difficulty, categoryId, image, isActive }) => {
    const { rows } = await db.query(
        `UPDATE board_games
         SET title = $1, description = $2, players = $3, play_time = $4,
             difficulty = $5, category_id = $6, image = $7, is_active = $8
         WHERE id = $9
         RETURNING *`,
        [title, description, players, playTime, difficulty, categoryId, image, isActive, id]
    );
    return rows[0];
};

// Hide (false) or show (true) a game
const setGameActive = async (id, isActive) => {
    const { rows } = await db.query(
        `UPDATE board_games SET is_active = $1 WHERE id = $2 RETURNING *`,
        [isActive, id]
    );
    return rows[0];
};

export { getAllGames, getGameById, addGame, updateGame, setGameActive };
