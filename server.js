/* Imports */
// Loads Express to create and run the web server.
import express from 'express';

// Loads tools for building file paths and working with file system paths.
import path from 'path';
import { fileURLToPath } from 'url';

/* Important variables */
// Creates the Express application.
const app = express();
// Gets this file's full path. and gets the folder containing this file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sets the name shown on the home page, with a default value.
const name = process.env.NAME || 'Helga Gaona';

// Sets the environment and server port, using production and 3000 by default.
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

/**
 * Middleware
 */
// Serves files from the public folder.
app.use(express.static(path.join(__dirname, 'public')));

// EJS Middleware
// Configures EJS as the template engine and sets the views folder.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// makes common variables available to all EJS templates without having to pass them individually from each route handler.
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    next();
});

const boardGames = {
    'CATAN': {
        id: 'CATAN',
        title: 'Catan',
        description: 'Collect resources, build settlements, and trade with other players.',
        players: '3–4 players',
        playTime: '60–90 minutes',
        difficulty: 'Beginner',
        category: 'Strategy',
        available: 3,
        image: '/images/games/catan.png'
    },

    'CLUEDO': {
        id: 'CLUEDO',
        title: 'Cluedo',
        description: 'Solve the mystery by discovering who committed the crime.',
        players: '3–6 players',
        playTime: '45–60 minutes',
        difficulty: 'Beginner',
        category: 'Mystery',
        available: 2,
        image: '/images/games/cluedo.png'
    },

    'TICKET-TO-RIDE': {
        id: 'TICKET-TO-RIDE',
        title: 'Ticket to Ride',
        description: 'Build railway routes across the country.',
        players: '2–5 players',
        playTime: '30–60 minutes',
        difficulty: 'Beginner',
        category: 'Family',
        available: 4,
        image: '/images/games/ticket-to-ride.png'
    },

    'PANDEMIC': {
        id: 'PANDEMIC',
        title: 'Pandemic',
        description: 'Work together to stop the spread of diseases.',
        players: '2–4 players',
        playTime: '45 minutes',
        difficulty: 'Intermediate',
        category: 'Cooperative',
        available: 1,
        image: '/images/games/pandemic.png'
    },

    'WINGSPAN': {
        id: 'WINGSPAN',
        title: 'Wingspan',
        description: 'Attract birds to your wildlife preserve.',
        players: '1–5 players',
        playTime: '40–70 minutes',
        difficulty: 'Intermediate',
        category: 'Strategy',
        available: 2,
        image: '/images/games/wingspan.png'
    },

    'DIXIT': {
        id: 'DIXIT',
        title: 'Dixit',
        description: 'Use creativity and imagination to describe beautifully illustrated cards.',
        players: '3–8 players',
        playTime: '30 minutes',
        difficulty: 'Beginner',
        category: 'Party',
        available: 3,
        image: '/images/games/dixit.png'
    },

    'AZUL': {
        id: 'AZUL',
        title: 'Azul',
        description: 'Decorate the walls of a royal palace with colorful tiles.',
        players: '2–4 players',
        playTime: '30–45 minutes',
        difficulty: 'Intermediate',
        category: 'Strategy',
        available: 2,
        image: '/images/games/azul.png'
    },

    'SCRABBLE': {
        id: 'SCRABBLE',
        title: 'Scrabble',
        description: 'Create words with letter tiles and earn the highest score.',
        players: '2–4 players',
        playTime: '50 minutes',
        difficulty: 'Beginner',
        category: 'Word Game',
        available: 5,
        image: '/images/games/scrabble.png'
    },

    'RISK': {
        id: 'RISK',
        title: 'Risk',
        description: 'Conquer territories and defeat your opponents through strategic planning.',
        players: '2–6 players',
        playTime: '2–4 hours',
        difficulty: 'Advanced',
        category: 'Strategy',
        available: 1,
        image: '/images/games/risk.png'
    },

    'CARCASSONNE': {
        id: 'CARCASSONNE',
        title: 'Carcassonne',
        description: 'Build a medieval landscape with cities, roads, monasteries, and fields.',
        players: '2–5 players',
        playTime: '35–45 minutes',
        difficulty: 'Intermediate',
        category: 'Strategy',
        available: 3,
        image: '/images/games/carcassonne.png'
    }
};

/* Routes: Will be moved into src/middleware */
// Handles requests to the home page. 
app.get('/', (req, res) => {
    res.render('home', { title: 'Game Shelf', NAME: name });
});
app.get('/games', (req, res) => {

    // Get sort parameter (default to 'available')
    const sortBy = req.query.sort || 'available';
    
    let sortedGames = Object.values(boardGames);
    // Log the parameter for debugging
    console.log(`sorted by: ${sortBy}`);
    
    switch (sortBy) {
        case 'available':
            sortedGames.sort((a, b) => b.available - a.available);
            break;
        case 'difficulty':
            sortedGames.sort((a, b) => a.difficulty.localeCompare(b.difficulty));
            break;
        case 'category':
            sortedGames.sort((a, b) => a.category.localeCompare(b.category));
            break;
        default:
            sortedGames.sort((a, b) => b.available - a.available);
            break;
    }
    res.render('games', { 
        title: 'Game Shelf',
        boardGames: sortedGames,
        currentSort: sortBy
    });
});

app.get('/games/:boardGameId', (req, res, next) => {
    // Extract the boardgame ID from the URL
    const boardGameId = req.params.boardGameId;

    // Look up the board game in our data
    const boardGame = boardGames[boardGameId];

    // Handle board game not found
    if (!boardGame) {
        const err = new Error(`Board game ${boardGameId} not found`);
        err.status = 404;
        return next(err);
    }
    // Log the parameter for debugging
    console.log(`Viewing game: ${boardGameId}`);

    // Render the game detail template
    res.render('game-detail', {
        title: `${boardGame.id} - ${boardGame.title}`,
        boardGame: boardGame,
    });
});

// Test route for 500 errors
app.get('/test-error', (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
});

// Catch-all middleware for unmatched routes
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err); // Forward to global error handler
});


// Global error handler
app.use((err, req, res, next) => {
    // Prevent infinite loops, if a response has already been sent, do nothing
    if (res.headersSent || res.finished) {
        return next(err);
    }

    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: NODE_ENV === 'production' ? 'An error occurred' : err.message,
        stack: NODE_ENV === 'production' ? null : err.stack,
        NODE_ENV // Our WebSocket check needs this and its convenient to pass along
    };

    // Render the appropriate error template with fallback
    try {
        res.status(status).render(`errors/${template}`, context);
    } catch (renderErr) {
        // If rendering fails, send a simple error page instead
        if (!res.headersSent) {
            res.status(status).send(`<h1>Error ${status}</h1><p>An error occurred.</p>`);
        }
    }
});

// When in development mode, start a WebSocket server for live reloading
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

/* Start the server */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});