import db from '../db.js';

const SELECT_CATEGORIES = `
    SELECT c.id, c.name, c.description, c.is_active AS "isActive",
           COUNT(g.id) AS "gameCount"
    FROM categories c
    LEFT JOIN board_games g ON g.category_id = c.id
    GROUP BY c.id
`;

const getAllCategories = async () => {
    const { rows } = await db.query(SELECT_CATEGORIES);
    return rows;
};

const getCategoryById = async (categoryId) => {
    const SELECT_CATEGORY_BY_ID = `
        SELECT c.id, c.name, c.description, c.is_active AS "isActive",
               COUNT(g.id) AS "gameCount"
        FROM categories c
        LEFT JOIN board_games g ON g.category_id = c.id
        WHERE c.id = $1
        GROUP BY c.id
    `;

    const { rows } = await db.query(SELECT_CATEGORY_BY_ID, [categoryId]);
    return rows[0];
}
const addCategory = async (name, description, isActive) => {
    const INSERT_CATEGORY = `
        INSERT INTO categories (name, description, is_active)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const { rows } = await db.query(INSERT_CATEGORY, [name, description, isActive]);
    return rows[0];
}
// Function to update a category by its ID
const updateCategory = async (id, name, description, isActive) => {
    const { rows } = await db.query(
        `UPDATE categories
        SET name = $1, description = $2, is_active = $3
        WHERE id = $4 RETURNING *`,
        [name, description, isActive, id]
    );
    return rows[0];            // undefined if no category has that id
};
// Function to set the active status of a category by its ID
const setCategoryActive = async (id, isActive) => {
    const { rows } = await db.query(
        `UPDATE categories SET is_active = $1 WHERE id = $2 RETURNING *`,
        [isActive, id]
    );
    return rows[0];
};

const setCategoryInactive = async (id) => {
    const { rows } = await db.query(
        `UPDATE categories SET is_active = false WHERE id = $1 RETURNING *`,
        [id]
    );
    return rows[0];
}

export { getAllCategories, getCategoryById, addCategory, updateCategory, setCategoryActive, setCategoryInactive };