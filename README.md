# Prinative — Task Manager

A simple React Native task management app built with Expo for the PRITECH technical assessment.

## Features
- **Task list screen** — view all tasks with title and description
- **Add new task** — form with title and description
- **Toggle completion** — mark tasks as completed or pending
- **Delete task** — remove tasks from the list
- **Task details view** — full task info with status and created date
- **Input validation** — title is required (min 3 characters)
- **Public API integration** — initial tasks loaded from [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos)
- **Search** — filter tasks by title
- **Status filter** — show All, Pending, or Done tasks
- **Local persistence** — tasks saved with AsyncStorage
- **Edit tasks** — update title and notes from the details screen
- **Animations** — spring checkbox, swipe-to-delete, staggered list, progress bar, haptics
- **Navigation** — bottom tabs (All / To Do / Done) + stack for add, edit, and details

## Tech Stack

- React Native (Expo SDK 54 — compatible with Expo Go 54)
- TypeScript
- React Navigation (native stack + bottom tabs)
- Reanimated 3 + Gesture Handler
- AsyncStorage + Expo Haptics

## Project Structure

```
src/
├── components/     # UI (TaskItem, AnimatedCheckbox, ProgressBar, …)
├── constants/      # Theme + motion tokens
├── context/        # TaskContext for shared state
├── hooks/          # useTasks — CRUD, API, storage, search
├── navigation/     # Tabs + stack navigator
├── screens/        # TaskList, TaskForm, TaskDetails
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
   npm start (npx expo start)
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

<img width="378" height="818" alt="image" src="https://github.com/user-attachments/assets/ab49b9b7-f8b6-4a0f-92c1-b073c3a3a94e" />
<img width="378" height="821" alt="image" src="https://github.com/user-attachments/assets/fe484b63-3afc-49d7-8daf-22c55f169039" />
<img width="375" height="817" alt="image" src="https://github.com/user-attachments/assets/f7eef1b0-216e-436f-80c4-045f8f85fe4d" />
<img width="379" height="817" alt="image" src="https://github.com/user-attachments/assets/b66c3420-4ab0-47f9-a3f5-9d8a31809d26" />
<img width="378" height="819" alt="image" src="https://github.com/user-attachments/assets/eaceb67c-e731-4ec5-9176-76851d7d8647" />





## Scripts

| Command           | Description              |
|-------------------|--------------------------|
| `npm start expo`  | Start Expo dev server    |


## Author
Saimir Bunjaku
Built for PRITECH React Native Technical Task.
