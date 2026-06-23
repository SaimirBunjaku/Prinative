# Prinative — Task Manager

A simple React Native task management app built with Expo for the PRITECH technical assessment.

## Features

### Required
- **Task list screen** — view all tasks with title and description
- **Add new task** — form with title and description
- **Toggle completion** — mark tasks as completed or pending
- **Delete task** — remove tasks from the list
- **Task details view** — full task info with status and created date
- **Input validation** — title is required (min 3 characters)
- **Public API integration** — initial tasks loaded from [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos)

### Bonus
- **Search** — filter tasks by title
- **Status filter** — show All, Pending, or Done tasks
- **Local persistence** — tasks saved with AsyncStorage
- **Navigation** — React Navigation stack between list, add, and details screens

## Tech Stack

- React Native (Expo SDK 54 — compatible with Expo Go 54)
- TypeScript
- React Navigation (native stack)
- AsyncStorage
- Functional components and hooks

## Project Structure

```
src/
├── components/     # Reusable UI (Button, TaskItem, SearchBar, EmptyState)
├── constants/      # Theme colors and spacing
├── context/        # TaskContext for shared state
├── hooks/          # useTasks — CRUD, API, storage, search/filter
├── navigation/     # AppNavigator and route types
├── screens/        # TaskList, AddTask, TaskDetails
├── services/       # API fetch and AsyncStorage helpers
└── types/          # Task type definitions
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm
- [Expo Go](https://expo.dev/go) on your phone (Android or iOS), **or** an Android emulator / iOS simulator

## Setup & Run

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Prinative
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open the app**
   - Scan the QR code with **Expo Go** (Android) or the Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator (macOS only), `w` for web

## How It Works

1. On first launch, the app fetches 10 sample todos from JSONPlaceholder and maps them to the local task format.
2. Tasks are persisted locally with AsyncStorage — your changes survive app restarts.
3. Pull down on the task list to refresh API tasks (local tasks you created are kept).
4. Tap a task to open details; use the checkbox or details screen to toggle status.

## Screenshots

_Add screenshots or a screen recording here before submission._

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm start`    | Start Expo dev server    |
| `npm run android` | Open on Android       |
| `npm run ios`  | Open on iOS (macOS only) |
| `npm run web`  | Open in browser          |

## Author

Built for PRITECH React Native Technical Task.
