// creates a modular, mountable route handler. A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.
import { Router } from 'express';

// Bring the functions needed
import { addLocalVariables } from '../middleware/global.js';
import { catalogPage, gameDetailPage } from '../controllers/catalog/catalog.js';
import {
    categoriesListingPage,
    categoriesAddPage,
    categoriesEditPage,
    createCategory,
    editCategory,
    deactivateCategory,
    activateCategory
} from '../controllers/categories/categories.js';
import {
    gamesListingPage,
    gamesAddPage,
    gamesEditPage,
    createGame,
    editGame,
    deactivateGame,
    activateGame
} from '../controllers/games/games.js';

import { homePage, testErrorPage, registrationPage, loginPage, adminDashboard, staffDashboard, memberDashboard} from '../controllers/index.js';

// Create a new router instance
const router = Router();

// Router middleware
// Add catalog-specific styles to all catalog routes
router.use('/', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/main.css">');
    next();
});
// Route definitions that connect URL paterns to handler functions

// Home and basic pages
router.get('/', homePage);

// Catalog routes
router.get('/games', catalogPage);
router.get('/games/:boardGameId', gameDetailPage);

// Registration and Login Routes
router.get('/registration', registrationPage);
router.get('/login', loginPage);

// User dashboard routes
router.get('/admin', adminDashboard); // Admin dashboard route
router.get('/staff', staffDashboard); // staff dashboard route
router.get('/member', memberDashboard); // Member dashboard route

// Categories routes
router.get('/admin/categories', categoriesListingPage); // Categories listing page route
router.get('/admin/categories/add-category', categoriesAddPage); // Route to add a new category
router.get('/admin/categories/:id/edit', categoriesEditPage); // Route to edit a category

// categories form actions (POST)
router.post('/admin/categories', createCategory);
router.post('/admin/categories/:id', editCategory);
router.post('/admin/categories/:id/deactivate', deactivateCategory);
router.post('/admin/categories/:id/activate', activateCategory);

// Game routes
router.get('/admin/games', gamesListingPage); // Games listing page route
router.get('/admin/games/add-game', gamesAddPage); // Route to add a new game
router.get('/admin/games/:id/edit', gamesEditPage); // Route to edit a game

// games form actions (POST)
router.post('/admin/games', createGame);
router.post('/admin/games/:id', editGame);
router.post('/admin/games/:id/deactivate', deactivateGame);
router.post('/admin/games/:id/activate', activateGame);

// Route to trigger test error
router.get('/test-error', testErrorPage);


export default router;