# To-Do List

A web application for task management, developed with HTML, CSS, JavaScript, Express, and JSON Server.

## Features

- Add tasks with a title and description.
- Mark tasks as completed.
- Edit existing tasks.
- Delete tasks.
- Persistent storage using JSON Server.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** JSON Server
- **Development:** Nodemon, Concurrently

## Project Structure

```bash
├── db.json
├── package.json
├── README.md
├── server.js
└── public
    ├── css
    │   └── home.css
    ├── js
    │   └── home.js
    └── index.html
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/jean-D-alves/to-do-list.git
cd to-do-list
```

2. Install dependencies:

```bash
npm install
```

## Start the project

```bash
npm run dev
```

- This will start **Express** on port 3000 and **JSON Server** on port 3001.
- Open your browser at:

```bash
http://localhost:3000/index.html?user=jean
```
