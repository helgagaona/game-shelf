-- Seeds the database with SQL INSERTs; faster and more reliable than loading JSON in application code.
-- Target: PostgreSQL. Safe to re-run: tables use IF NOT EXISTS and inserts skip rows that already exist.

BEGIN;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One row per category (Strategy, Mystery, ...). Replaces the repeated
-- category strings in catalog.js.
CREATE TABLE IF NOT EXISTS categories (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- One row per board game. Mirrors the objects in catalog.js:
--   id, title, description, players, playTime, difficulty, category, available, image
CREATE TABLE IF NOT EXISTS board_games (
    id          VARCHAR(50)  PRIMARY KEY,                 -- slug used in the URL, e.g. 'TICKET-TO-RIDE'
    title       VARCHAR(100) NOT NULL,
    description TEXT         NOT NULL,
    players     VARCHAR(30)  NOT NULL,                    -- display text, e.g. '3–4 players'
    play_time   VARCHAR(30)  NOT NULL,                    -- display text, e.g. '60–90 minutes'
    difficulty  VARCHAR(20)  NOT NULL
                CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    category_id INTEGER      NOT NULL REFERENCES categories(id),
    units_available   INTEGER      NOT NULL DEFAULT 0 CHECK (units_available >= 0),
    image       VARCHAR(255) NOT NULL,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE        -- FALSE hides the game instead of deleting it
);

-- The table already exists in a running database, and CREATE TABLE IF NOT EXISTS never adds columns,
-- so add anything new here. Safe to run on every startup.
ALTER TABLE board_games ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- One row per physical copy of a board game. Each copy has a unique copy_number for that game.

CREATE TABLE IF NOT EXISTS game_copies (
    id          SERIAL PRIMARY KEY,
    game_id    VARCHAR(50)  NOT NULL REFERENCES board_games(id),
    copy_number INTEGER      NOT NULL CHECK (copy_number > 0),
    condition  VARCHAR(20)  NOT NULL CHECK (condition IN ('New', 'Good', 'Fair', 'Poor')),
    availability_status BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_game_copies_game_copy
    ON game_copies(game_id, copy_number);

-- Speeds up the "sort/filter by category" queries
CREATE INDEX IF NOT EXISTS idx_board_games_category ON board_games(category_id);


-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------

INSERT INTO categories (name, description, is_active) VALUES
    ('Strategy',    'Plan ahead and outsmart the board.',          TRUE),
    ('Mystery',     'Follow the clues and solve the case.',        TRUE),
    ('Family',      'Easy to learn and fun for all ages.',         TRUE),
    ('Cooperative', 'Work together against the game.',            TRUE),
    ('Party',       'Easygoing games for big groups.',             TRUE),
    ('Word Game',   'Letters, vocabulary and quick thinking.',     TRUE),
    ('Card Game',   'Quick games played with a deck of cards.',    TRUE)
ON CONFLICT (name) DO UPDATE
    SET description = COALESCE(categories.description, EXCLUDED.description);

-- ---------------------------------------------------------------------------
-- Board games
-- category_id is looked up by name so the script never depends on id numbers.
-- ---------------------------------------------------------------------------

INSERT INTO board_games (id, title, description, players, play_time, difficulty, category_id, image) VALUES
    ('CATAN', 'Catan',
     'Collect resources, build settlements, and trade with other players.',
     '3–4 players', '60–90 minutes', 'Beginner',
     (SELECT id FROM categories WHERE name = 'Strategy'), '/images/games/catan.png'),

    ('CLUEDO', 'Cluedo',
     'Solve the mystery by discovering who committed the crime.',
     '3–6 players', '45–60 minutes', 'Beginner',
     (SELECT id FROM categories WHERE name = 'Mystery'), '/images/games/cluedo.png'),

    ('TICKET-TO-RIDE', 'Ticket to Ride',
     'Build railway routes across the country.',
     '2–5 players', '30–60 minutes', 'Beginner',
     (SELECT id FROM categories WHERE name = 'Family'), '/images/games/ticket-to-ride.png'),

    ('PANDEMIC', 'Pandemic',
     'Work together to stop the spread of diseases.',
     '2–4 players', '45 minutes', 'Intermediate',
     (SELECT id FROM categories WHERE name = 'Cooperative'), '/images/games/pandemic.png'),

    ('WINGSPAN', 'Wingspan',
     'Attract birds to your wildlife preserve.',
     '1–5 players', '40–70 minutes', 'Intermediate',
     (SELECT id FROM categories WHERE name = 'Strategy'), '/images/games/wingspan.png'),

    ('DIXIT', 'Dixit',
     'Use creativity and imagination to describe beautifully illustrated cards.',
     '3–8 players', '30 minutes', 'Beginner',
     (SELECT id FROM categories WHERE name = 'Party'), '/images/games/dixit.png'),

    ('AZUL', 'Azul',
     'Decorate the walls of a royal palace with colorful tiles.',
     '2–4 players', '30–45 minutes', 'Intermediate',
     (SELECT id FROM categories WHERE name = 'Strategy'), '/images/games/azul.png'),

    ('SCRABBLE', 'Scrabble',
     'Create words with letter tiles and earn the highest score.',
     '2–4 players', '50 minutes', 'Beginner',
     (SELECT id FROM categories WHERE name = 'Word Game'), '/images/games/scrabble.png'),

    ('RISK', 'Risk',
     'Conquer territories and defeat your opponents through strategic planning.',
     '2–6 players', '2–4 hours', 'Advanced',
     (SELECT id FROM categories WHERE name = 'Strategy'), '/images/games/risk.png'),

    ('CARCASSONNE', 'Carcassonne',
     'Build a medieval landscape with cities, roads, monasteries, and fields.',
     '2–5 players', '35–45 minutes', 'Intermediate',
     (SELECT id FROM categories WHERE name = 'Strategy'), '/images/games/carcassonne.png'),

     ('UNO', 'UNO',
     'A fast-paced card game where players match colors and numbers to be the first to get rid of all their cards.',
     '2–10 players', '10–30 minutes', 'Beginner',
     (SELECT id FROM categories WHERE name = 'Card Game'), '/images/games/uno.png')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- Game copies
-- ----------------------------------------------------------------------------
INSERT INTO game_copies (game_id, copy_number, condition, availability_status) VALUES
    ('CATAN', 1, 'Good', TRUE),
    ('CATAN', 2, 'Fair', TRUE),
    ('CATAN', 3, 'New', TRUE),
    ('CATAN', 4, 'Good', FALSE),
    ('CLUEDO', 1, 'Good', TRUE),
    ('CLUEDO', 2, 'Good', FALSE),
    ('TICKET-TO-RIDE', 1, 'New', TRUE),
    ('TICKET-TO-RIDE', 2, 'Good', TRUE),
    ('TICKET-TO-RIDE', 3, 'Fair', FALSE),
    ('TICKET-TO-RIDE', 4, 'Good', TRUE),
    ('PANDEMIC', 1, 'New', TRUE),
    ('WINGSPAN', 1, 'Good', TRUE),
    ('WINGSPAN', 2, 'Fair', FALSE),
    ('DIXIT', 1, 'New', TRUE),
    ('DIXIT', 2, 'Good', TRUE),
    ('DIXIT', 3, 'Fair', FALSE),
    ('AZUL', 1, 'New', TRUE),
    ('AZUL', 2, 'Good', TRUE),
    ('SCRABBLE', 1, 'New', TRUE),
    ('SCRABBLE', 2, 'Good', TRUE),
    ('SCRABBLE', 3, 'Fair', FALSE),
    ('SCRABBLE', 4, 'Good', TRUE),
    ('SCRABBLE', 5, 'New', TRUE),
    ('RISK', 1, 'Good', FALSE),
    ('RISK', 2, 'Good', TRUE),
    ('CARCASSONNE', 1, 'New', TRUE),
    ('CARCASSONNE', 2, 'Good', TRUE),
    ('CARCASSONNE', 3, 'Fair', FALSE),
    ('UNO', 1, 'New', TRUE),
    ('UNO', 2, 'Good', TRUE),
    ('UNO', 3, 'Fair', FALSE),
    ('UNO', 4, 'Good', TRUE),
    ('UNO', 5, 'New', TRUE)
ON CONFLICT (game_id, copy_number) DO UPDATE
SET condition = EXCLUDED.condition,
    availability_status = EXCLUDED.availability_status;

COMMIT;

-- ---------------------------------------------------------------------------
-- Equivalent of your model functions (for reference / testing in psql)
-- ---------------------------------------------------------------------------
-- getAllBoardGames / getSortedBoardGames('available'):
--   SELECT g.*, c.name AS category FROM board_games g JOIN categories c ON c.id = g.category_id
--   ORDER BY g.available DESC;
-- getBoardGameById('CATAN'):
--   SELECT g.*, c.name AS category FROM board_games g JOIN categories c ON c.id = g.category_id
--   WHERE g.id = 'CATAN';
-- getBoardGamesByCategory('Strategy'):
--   SELECT g.*, c.name AS category FROM board_games g JOIN categories c ON c.id = g.category_id
--   WHERE LOWER(c.name) = LOWER('Strategy');
