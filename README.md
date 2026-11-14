### Deployment Journal:

#### Week 9
Added EJS views and connected them to Express routes. Implemented query-parameter sorting for the game catalog and centralized error handling.

#### Week 8
Set up the Express development environment by installing Node.js and Nodemon, creating server.js, configuring the server port and environment variables, and adding a route handler for the home page.

# GameShelf

GameShelf is a free, community-centered board game library. Members can discover board games, read community reviews, request loans, and return games after playing them. Library staff manage requests, checkouts, returns, and game condition, while administrators manage the catalog, users, categories, and community content.

> GameShelf helps a community discover, borrow, and share board games for free.

## Project Purpose

Board games can be expensive, and people may not know whether they will enjoy a game before buying it. GameShelf gives community members a way to try different board games without purchasing them. The application also encourages people to share recommendations and discover games through community reviews.

The system is designed as a shared physical library. Members pick up and return games at a designated library location. Payments, shipping, and loans between individual users are outside the initial project scope.

## Core Features

- Browse a catalog of board games
- Search and filter games by category, difficulty, and player count
- View detailed information about each game
- Create an account and sign in securely
- Request free game loans
- View current loans, pending requests, and loan history
- Track a loan through multiple statuses
- Write, edit, and delete personal reviews
- Approve or reject requests as library staff
- Record checkouts and returns
- Inspect returned games and report damage or missing pieces
- Manage games, categories, copies, users, roles, and reviews as an administrator
- Provide separate dashboards for members, library staff, and administrators

## User Roles

### Member

Members can:

- Create an account and sign in
- Browse and search the game catalog
- View game details and published reviews
- Request an available game
- Cancel a pending request
- View current loans and loan history
- Write reviews after returning a game
- Edit or delete their own reviews

### Library Staff

Library staff can:

- View pending loan requests
- Approve or reject requests
- Record when a game is checked out
- Record when a game is returned
- Inspect the condition of returned games
- Report missing pieces or damage
- Mark copies as available, damaged, or in repair
- View the loan history of a physical copy

### Admin/Owner

Administrators can:

- Add, edit, deactivate, and manage games
- Create and manage categories
- Add and manage physical game copies
- View and manage users
- Assign or change user roles
- Moderate or remove inappropriate reviews
- View system activity and operational statistics

## Main Workflows

### Loan Workflow

```text
Available → Requested → Approved → Checked Out → Returned → Inspected
```

Additional statuses may include:

- Rejected
- Cancelled
- Overdue
- Needs Repair

### Review Workflow

```text
Draft → Submitted → Approved → Published
```

Reviews may be moderated before they become visible to the community.

### Typical Member Journey

1. A member browses the catalog.
2. The member opens a game's details page.
3. The member signs in or creates an account.
4. The member requests a free loan.
5. Library staff review and approve the request.
6. The member picks up the game.
7. Staff record the checkout.
8. The member returns the game.
9. Staff inspect the copy and update its condition.
10. The game becomes available again, if no repair is needed.
11. The member writes a review.

## Application Pages

### Public Pages

- Home
- Browse Games
- Categories
- Game Details
- Login
- Register

### Member Pages

- Member Dashboard
- My Loans
- Loan Details
- My Reviews
- Profile

### Library Staff Pages

- Staff Dashboard
- Pending Requests
- Active Loans
- Return Inspection
- Damage Reports

### Admin Pages

- Admin Dashboard
- Manage Games
- Create Game
- Edit Game
- Manage Categories
- Manage Copies
- Manage Users
- Manage Reviews

## Data Model

The initial database will use PostgreSQL and include these related tables:

- `users` — account information and user roles
- `roles` — available permission levels
- `games` — catalog information for each board game
- `categories` — game categories such as Strategy, Family, Party, or Mystery
- `game_copies` — individual physical copies and their conditions
- `loan_requests` — requests and active or completed loans
- `loan_status_history` — every status change made to a loan
- `reviews` — member-generated ratings and written reviews
- `damage_reports` — missing pieces, damage, and repair information

Important relationships include:

- A user can create many loan requests.
- A game belongs to a category and can have multiple physical copies.
- A physical copy can be used in many loans over time.
- A loan request belongs to one member and one physical copy.
- A loan has many status history records.
- A member can write reviews for games they have borrowed.
- Staff can create damage reports connected to returned loans.

## Course Requirements

| Requirement | GameShelf Implementation |
|---|---|
| Related database tables | Users, games, copies, loans, reviews, categories, and reports |
| Multiple user roles | Member, Library Staff, and Admin/Owner |
| Authentication | Login, registration, sessions, and password hashing |
| Authorization | Role-based access to member, staff, and admin features |
| Server-side rendering | EJS views |
| Dynamic routing | Routes such as `/games/:id` and `/loans/:id` |
| CRUD operations | Games, categories, copies, reviews, users, and loan records |
| User-generated content | Loan requests, ratings, and reviews |
| Multi-stage workflow | Loan and review status workflows |
| Admin dashboard | Catalog, users, inventory, reviews, and statistics |
| Validation | Server-side validation for forms and user input |
| Security | Parameterized queries and protected routes |

## Project Scope

### Included in the MVP

- Home page
- Game catalog and categories
- Game detail pages
- Registration and login
- Free loan requests
- Loan approval, checkout, return, and inspection tracking
- Member, staff, and admin dashboards
- Reviews and basic moderation
- PostgreSQL database
- Deployment preparation for Render

### Not Included Initially

- Payments or online checkout
- Shipping or delivery
- Private messaging or real-time chat
- Loans between individual users
- Hourly reservations
- Mobile application
- Social media integrations
- Complex image-upload management
- Automatic late fees or fines

## Planned Technology

- Node.js
- Express
- EJS
- PostgreSQL
- `express-session`
- `bcrypt`
- Parameterized SQL queries
- Render for deployment

## Suggested Project Structure

```text
gameshelf/
├── controllers/
├── db/
│   ├── pool.js
│   ├── schema.sql
│   └── seed.sql
├── middleware/
├── models/
├── public/
│   ├── css/
│   ├── images/
│   └── js/
├── routes/
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── auth/
│   ├── games/
│   ├── loans/
│   ├── staff/
│   └── admin/
├── app.js
├── package.json
├── .env
└── README.md
```

## Development Roadmap

1. Set up Node.js, Express, EJS, and PostgreSQL.
2. Create the database schema and seed data.
3. Implement registration, login, password hashing, and sessions.
4. Add authorization middleware for each role.
5. Build the public catalog and game detail pages.
6. Implement free loan requests.
7. Add loan status history and member loan pages.
8. Build the staff request, checkout, return, and inspection tools.
9. Build the admin catalog and user management tools.
10. Add reviews and review moderation.
11. Add validation, error handling, and custom error pages.
12. Test each role and workflow.
13. Prepare the application for deployment on Render.
14. Complete project documentation.

## Initial Seed Data

The first version does not need a large database. A practical starting point is:

- 10 board games
- 5 categories
- 3 test members
- 2 library staff users
- 1 administrator
- 5 sample loan requests
- Several sample reviews

The database stores catalog details, not complete game files or rulebooks. Each game can include a name, description, category, player count, duration, difficulty, recommended age, cover image URL, and copy availability.

## Future Ideas

Possible future features include:

- Community recommendations and favorites
- Popular-games lists
- More advanced search and filtering
- Events or game nights
- Expanded activity statistics
- Fictional mystery case files as a new catalog category

## Project Status

GameShelf is currently in the planning and requirements-definition stage. The next development milestone is to finalize the database model and entity-relationship diagram before beginning implementation.
