import { getBoardGameById, getSortedBoardGames } from '../../models/catalog/catalog.js';

// Route handler for the game catalog list page
const catalogPage = async (req, res) => {
    const sortBy = req.query.sort || 'available';
    const boardGames = await getSortedBoardGames(sortBy);

    res.render('games', {
        title: 'Game Shelf',
        boardGames,
        currentSort: sortBy
    });
};

// Route handler for the game detail page
const gameDetailPage = async (req, res, next) => {
    const boardGameId = req.params.boardGameId;
    const boardGame = await getBoardGameById(boardGameId);

    // Handle board game not found
    if (!boardGame) {
        const err = new Error(`Board game ${boardGameId} not found`);
        err.status = 404;
        return next(err);
    }

    // Render the game detail template
    res.render('game-detail', {
        title: `${boardGame.id} - ${boardGame.title}`,
        boardGame,
    });
};

export { catalogPage, gameDetailPage };
