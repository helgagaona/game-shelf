// The model handles all data-related operations.
// Handles queries related to the board game catalog, including retrieval, sorting, and filtering of board game data.

import db from '../db.js';

// SELECT so every function returns the same field names the views use.
const SELECT_GAMES = `
    SELECT g.id, g.title, g.description, g.players,
           g.play_time AS "playTime",
           g.difficulty,
           COUNT(gc.id) FILTER (
               WHERE gc.availability_status = TRUE
           ) AS available,
           g.image,
           c.name AS category
    FROM board_games g
    JOIN categories c ON c.id = g.category_id AND c.is_active = TRUE
    LEFT JOIN game_copies gc ON gc.game_id = g.id
    WHERE g.is_active = TRUE
`;
// Hiding: a game with is_active = FALSE never appears here, and neither do the games of a category
// with is_active = FALSE. Every function below builds on this SELECT, so they all hide them.
// Because the SELECT already has a WHERE, extra conditions below are added with AND.
// (The admin pages use their own query in games.js and still see everything.)

const GROUP_GAMES = 'GROUP BY g.id, c.name';

// This function returns all board games in the catalog
const getAllBoardGames = async () => { 
    const { rows } = await db.query(`${SELECT_GAMES} ${GROUP_GAMES}`);
    return rows;
 };

 // This function returns a specific board game by its ID
 const getBoardGameById = async (id) => {
    const { rows } = await db.query(
        `${SELECT_GAMES} AND g.id = $1 ${GROUP_GAMES}`,
        [id]
    );
    return rows[0] || null;
};

// This function returns all board games in a specific category
const getSortedBoardGames = async (sortBy) => {
        const orderBy = {
            available: 'COUNT(gc.id) FILTER (WHERE gc.availability_status = TRUE) DESC',
            difficulty: 'g.difficulty ASC',
            category: 'c.name ASC',
        }[sortBy] || 'COUNT(gc.id) FILTER (WHERE gc.availability_status = TRUE) DESC';

    const { rows } = await db.query(`${SELECT_GAMES} ${GROUP_GAMES} ORDER BY ${orderBy}, g.title`);
    return rows;
};


const getBoardGamesByCategory = async (category) => {
    const { rows } = await db.query(
        `${SELECT_GAMES} AND LOWER(c.name) = LOWER($1) ${GROUP_GAMES} ORDER BY g.title`,
        [category]
    );
    return rows;
};


export { getAllBoardGames, getBoardGameById, getSortedBoardGames, getBoardGamesByCategory };