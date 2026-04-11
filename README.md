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
| POST | `http://localhost:3000/users/login` |
| GET | `http://localhost:3000/users/:email` |
| PUT | `http://localhost:3000/users/forget-password/:email` |
| PUT | `http://localhost:3000/users/change-name/:id` |

### Boards

| Method | Full Route |
| --- | --- |
| POST | `http://localhost:3000/boards/create` |
| GET | `http://localhost:3000/boards` |
| GET | `http://localhost:3000/boards/:boardId` |
| DELETE | `http://localhost:3000/boards/:boardId` |

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

### Lists

| Method | Full Route |
| --- | --- |
| POST | `http://localhost:3000/lists/create` |
| GET | `http://localhost:3000/lists/get` |
| GET | `http://localhost:3000/lists/get/:listId` |
| DELETE | `http://localhost:3000/lists/delete/:listId` |
| GET | `http://localhost:3000/lists/getbyboard/:boardId` |
| GET | `http://localhost:3000/lists/getall` |
