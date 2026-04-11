# Welcome to your Expo app 👋

## Backend Route Integration

Mobile API client lives in `services/api.ts` and uses `EXPO_PUBLIC_API_BASE_URL` (defaults to `http://10.210.128.39:3000`).

### Users

- `api.users.create` -> `POST /users/create`
- `api.users.login` -> `POST /users/login`
- `api.users.getByEmail` -> `GET /users/:email`
- `api.users.forgetPassword` -> `PUT /users/forget-password/:email`
- `api.users.changeName` -> `PUT /users/change-name/:id`

### Boards (Auth)

- `api.boards.create` -> `POST /boards/create`
- `api.boards.getAll` -> `GET /boards`
- `api.boards.getById` -> `GET /boards/:boardId`
- `api.boards.remove` -> `DELETE /boards/:boardId`

### Lists (Auth)

- `api.lists.create` -> `POST /lists/create`
- `api.lists.getMany` -> `GET /lists/get`
- `api.lists.getById` -> `GET /lists/get/:listId`
- `api.lists.getByBoardId` -> `GET /lists/getbyboard/:boardId`
- `api.lists.getAll` -> `GET /lists/getall`
- `api.lists.remove` -> `DELETE /lists/delete/:listId`

### Cards (Auth)

- `api.cards.create` -> `POST /cards/:listId`
- `api.cards.getByListId` -> `GET /cards/:listId`
- `api.cards.update` -> `PUT /cards/:cardId`

### Test Data

- `api.testData.preview` -> `GET /test-data/preview`
- `api.testData.seed` -> `POST /test-data/seed`

Note: board/list/card routes require token-aware calls, supported by passing the auth token as the second/third argument in `services/api.ts` methods.

Use `app/api-lab.tsx` (Profile -> API Lab) to manually trigger all integrated endpoints from the app UI.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
