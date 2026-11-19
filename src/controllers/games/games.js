import { getAllGames, getGameById, addGame, updateGame, setGameActive } from '../../models/catalog/games.js';
import { getAllCategories } from '../../models/catalog/categories.js';

// page for listing games (including hidden ones), for staff and admin users
const gamesListingPage = async (req, res) => {
    const games = await getAllGames();
    res.render('dashboard/admin/games/games-list', {
        title: 'Games',
        games
    });
};

// page for adding a new game
const gamesAddPage = async (req, res) => {
    const categories = (await getAllCategories()).filter(category => category.isActive);
    res.render('dashboard/admin/games/add-game', {
        title: 'Add Game',
        categories
    });
};

// page for editing a game
const gamesEditPage = async (req, res, next) => {
    const gameId = req.params.id;
    const game = await getGameById(gameId);

    if (!game) {
        const err = new Error(`Game ${gameId} not found`);
        err.status = 404;
        return next(err);
    }

    // Offer active categories, plus the game's current one even if it was hidden later
    const categories = (await getAllCategories())
        .filter(category => category.isActive || category.id === game.categoryId);

    res.render('dashboard/admin/games/edit-game', {
        title: `Edit ${game.title}`,
        game,
        categories
    });
};

// Read the form fields the same way for add and edit
const readForm = (body) => ({
    title: (body.title || '').trim(),
    description: (body.description || '').trim(),
    players: (body.players || '').trim(),
    playTime: (body.play_time || '').trim(),
    difficulty: body.difficulty,
    categoryId: Number(body.category_id),
    image: (body.image || '').trim(),
    isActive: body.is_active === 'true' // an unchecked box sends nothing
});

// Turn a title into the game's id, e.g. 'Ticket to Ride' -> 'TICKET-TO-RIDE'
const makeSlug = (title) => title.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// route handler for creating a new game
const createGame = async (req, res) => {
    const game = readForm(req.body);
    await addGame({ id: makeSlug(game.title), ...game });
    res.redirect('/admin/games');
};

// route handler for editing an existing game
const editGame = async (req, res, next) => {
    const updated = await updateGame(req.params.id, readForm(req.body));
    if (!updated) {
        const err = new Error('Game not found');
        err.status = 404;
        return next(err);
    }
    res.redirect('/admin/games');
};

// Creates the handlers that hide (false) or show (true) a game
const changeActive = (isActive) => async (req, res, next) => {
    const updated = await setGameActive(req.params.id, isActive);
    if (!updated) {
        const err = new Error('Game not found');
        err.status = 404;
        return next(err);
    }
    res.redirect('/admin/games');
};

const deactivateGame = changeActive(false);
const activateGame = changeActive(true);

export { gamesListingPage, gamesAddPage, gamesEditPage, createGame, editGame, deactivateGame, activateGame };
