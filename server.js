/* Imports */
// Loads Express to create and run the web server.
import express from 'express';

// Loads tools for building file paths and working with file system paths.
import path from 'path';
import { fileURLToPath } from 'url';

// Import MVC Components 
import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/global.js';

// Import database connection
import { setupDatabase, testConnection } from './src/models/setup.js';

/* Server Configuration */
// Gets this file's full path. and gets the folder containing this file.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Sets the environment and server port, using production and 3000 by default.
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

/* Set up Express Server */
// Creates the Express application.
const app = express();

/* Configure Express */
// Serves files from the public folder.
app.use(express.static(path.join(__dirname, 'public')));
// EJS Middleware
// Configures EJS as the template engine and sets the views folder.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

/* Global Middleware */
app.use(addLocalVariables); // Adds common variables to res.locals for all templates

// Parses incoming requests with URL-encoded payloads (like form submissions) and makes the data available in req.body.
app.use(express.urlencoded({ extended: true }));

/* Routes Middleware*/
// Mounts the routes defined in src/controllers/routes.js
app.use('/', routes);

/* Error Handling Middleware */
// Catch-all 404 handler
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
app.listen(PORT, async () => {
    await setupDatabase(); // ensure the database is set up before starting the server
    await testConnection(); // test the database connection
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
});