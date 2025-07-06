# 🧠 StreamX Backend – Real-Time Chat Server (Discord Clone)

**StreamX** is a backend-only, real-time chat server inspired by Discord. It supports **user authentication**, **channel creation**, **WebSocket-powered messaging**, and **RESTful APIs**. Built using Node.js, Express, MongoDB, and Socket.IO, it provides the full backend infrastructure for a Discord-like app.

---

## 🚀 Features

- ✅ **User Auth & Session Management** (Passport.js)
- 💬 **Channel-Based Messaging** with Access Control
- ⚡ **Real-Time Chat** using Socket.IO
- 📦 **REST APIs** for channels, users, and messages
- 🧠 **Middleware Protection** (Auth + Channel Membership)
- 🖼️ **Profile Picture Upload** with Multer
- 🔒 **Secure Routes**

---

## 🧱 Tech Stack

| Component     | Tech                          |
|---------------|-------------------------------|
| Runtime       | Node.js                       |
| Web Framework | Express.js                    |
| Database      | MongoDB + Mongoose            |
| Auth          | Passport.js (Local Strategy)  |
| Realtime      | Socket.IO                     |
| Uploads       | Multer                        |
| Session       | express-session + connect-mongo |

---

## ⚙️ Setup Instructions

### 📥 Clone & Install

```bash
git clone https://github.com/your-username/StreamX.git
cd StreamX
npm install
```

### 🧪 Environment Setup

Create a `.env` file in root:

```
PORT=3000
DB_URI=mongodb://localhost/streamx
SESSION_SECRET=your_session_secret
```

### ▶️ Run Server

```bash
npm start
```

Server will run at: [http://localhost:3000](http://localhost:3000)


## 🧠 Mongoose Models

### 📘 User Model

| Field               | Type     | Description                      |
|---------------------|----------|----------------------------------|
| `username`          | String   | User's display name              |
| `email`             | String   | User's email (unique)            |
| `password`          | String   | Hashed password                  |
| `profilePictureUrl` | String   | URL of the user's profile image |
| `joinedChannels`    | Array    | List of joined channel IDs       |


### 🔊 Channel Model

| Field          | Type     | Description                           |
|----------------|----------|---------------------------------------|
| `title`        | String   | Channel name                          |
| `description`  | String   | Optional description of the channel   |
| `participants` | Array    | List of user IDs                      |
| `messages`     | Array    | List of message references            |

### 💬 Message Model

| Field         | Type     | Description                         |
|---------------|----------|-------------------------------------|
| `sender`      | ObjectId | Reference to the sender (User)      |
| `content`     | String   | Message text content                |
| `timestamp`   | Date     | Time when the message was sent      |
| `channelRef`  | ObjectId | Reference to the parent channel     |


## 💬 Real-Time Chat

- Implemented using **Socket.IO**
- Each channel acts as a chat room
- Users emit and receive messages in real-time
- Built to support future integration with mobile/web frontends

---

## 📁 Project Structure

```
StreamX/
├── app.js                   # Main server entry point
├── config/                  # Passport & DB config
├── controllers/             # Business logic (user, channel, ajax)
├── middleware/              # Custom auth/membership middleware
├── models/                  # Mongoose schemas: User, Channel, Message
├── routes/
│   ├── ajax.js              # AJAX endpoints
│   ├── channel.js           # Channel routes (create/join/chat)
│   ├── index.js             # Root redirect
│   └── user.js              # Auth & profile routes
├── public/                  # Static assets (optional)
├── socket/                  # Socket.IO logic (if separated)
└── package.json
```

---

## 📘 API Documentation

### 📘 User Routes

#### POST /users/register

| Parameter  | Type     | Description                   |
| :--------- | :------- | :---------------------------- |
| username   | string   | **Required**. Unique username |
| email      | string   | **Required**. Email address   |
| password   | string   | **Required**. User password   |

---

#### POST /users/login

| Parameter  | Type     | Description                   |
| :--------- | :------- | :---------------------------- |
| email      | string   | **Required**. Email address   |
| password   | string   | **Required**. User password   |

---

#### GET /users/@me

| Parameter  | Type     | Description                         |
| :--------- | :------- | :---------------------------------- |
| Cookie     | string   | **Required**. Session cookie header |

---

#### PATCH /users/@me/update

| Parameter  | Type     | Description                |
| :--------- | :------- | :------------------------- |
| username   | string   | New username (optional)    |
| bio        | string   | New bio (optional)         |

---

#### POST /profile/img

| Parameter  | Type   | Description                       |
| :--------- | :----- | :-------------------------------- |
| image      | file   | **Required**. Profile image file  |

---

### 📺 Channel Routes

#### POST /channel/new

| Parameter    | Type     | Description                           |
| :----------- | :------- | :------------------------------------ |
| title        | string   | **Required**. Name of the channel     |
| description  | string   | Optional. Description of the channel  |

---

#### GET /channel/join/:id

| Parameter  | Type     | Description                         |
| :--------- | :------- | :---------------------------------- |
| id         | string   | **Required**. Channel ID to join    |

---

#### POST /channel/join/:id

| Parameter  | Type     | Description                         |
| :--------- | :------- | :---------------------------------- |
| id         | string   | **Required**. Channel ID to join    |

---

#### GET /channel/:id

| Parameter  | Type     | Description                           |
| :--------- | :------- | :------------------------------------ |
| id         | string   | **Required**. Channel ID to access    |

---

### 📡 Ajax Route

#### GET /current/channel/:id

| Parameter  | Type     | Description                                      |
| :--------- | :------- | :----------------------------------------------- |
| id         | string   | **Required**. Channel ID to get participants     |


## 📄 License

This project is licensed under the **MIT License**.


## 🧑‍💻 Author
**Mohit Bansal**  
🔗 [GitHub](https://github.com/WorkMohit17) | 💼 [LinkedIn](https://www.linkedin.com/in/workmohit17/)

