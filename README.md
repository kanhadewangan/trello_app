# back

## Setup

Install dependencies:

```bash
bun install
```

Run the API:

```bash
bun run index.ts
```

Server runs on `http://localhost:3000`.

## API Endpoints

Base URL: `http://localhost:3000`

### Users

| Method | Full Route |
| --- | --- |
| POST | `http://localhost:3000/users/create` |
| GET | `http://localhost:3000/users/:email` |
| PUT | `http://localhost:3000/users/forget-password/:email` |
| PUT | `http://localhost:3000/users/change-name/:id` |

### Boards

| Method | Full Route |
| --- | --- |
| POST | `http://localhost:3000/boards/` |
| GET | `http://localhost:3000/boards/:boardId` |
| DELETE | `http://localhost:3000/boards/:boardId` |
| GET | `http://localhost:3000/boards/` |

### Cards

| Method | Full Route |
| --- | --- |
| POST | `http://localhost:3000/cards/:listId` |
| GET | `http://localhost:3000/cards/:listId` |
| PUT | `http://localhost:3000/cards/:cardId` |

### Test Data

| Method | Full Route |
| --- | --- |
| GET | `http://localhost:3000/test-data/preview` |
| POST | `http://localhost:3000/test-data/seed` |
