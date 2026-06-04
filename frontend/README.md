# STUDENT EXPENSE TRACKER (Full-Stack Mobile Application)

A complete full-stack mobile application featuring a cross-platform React Native frontend built with Expo and a dedicated backend server architecture.

## Project Architecture

This repository contains both the client-side mobile interface and the supporting server infrastructure:
* **`/frontend`**: The mobile user interface built with React Native and Expo (utilizing modern file-based routing).
* **`/backend`**: The server-side API handling data management, routing, and business logic.

## Tech Stack

* **Frontend:** React Native, Expo framework, JavaScript / TypeScript
* **Backend:** Node.js (and your server-side frameworks/databases)

## Core Features

* **Cross-Platform Performance:** Fully optimized to run natively on both iOS and Android devices.
* **File-Based Routing:** Leverages modern Expo Router structures for clean mobile navigation.
* **API Integration:** Seamless client-to-server data communication between the mobile front-end and backend environment.

## Local Setup & Installation

Follow these steps to run both the backend API and the mobile application locally on your machine.

### Prerequisites
1. Download the **Expo Go** app on your physical iPhone or Android device.
2. Ensure you have **Node.js** and **npm** installed on your computer.

---

### Step 1: Running the Backend Server
Navigate to the backend directory, download the server libraries, and start the engine:
```bash
cd backend
npm install
npm start

Step 2: Running the Mobile Frontend
Open a new terminal window, navigate to the mobile frontend folder, install dependencies, and start Expo:
Bash
cd front
npm install
npx expo start

Step 3: Launching on Your Physical Device
   A QR Code will appear directly inside your terminal window.
   For iOS: Open your iPhone's native Camera app, scan the terminal QR code, and tap the link to open it in Expo Go.
   For Android: Open the Expo Go app directly, select Scan QR Code, and scan your terminal screen.
