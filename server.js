const express = require('express');
const session = require('express-session');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'college-event-secret-key', // In production, use a strong secret from environment
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// In-memory storage
let users = [];
let registrations = [];

// Routes

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>College Event Registration Portal</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 {
          margin: 0;
          color: white;
          font-size: 1.8rem;
        }
        .status {
          color: #4CAF50;
          font-weight: bold;
          background: rgba(76, 175, 80, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          display: inline-block;
          margin: 1rem 0;
        }
        .container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          flex: 1;
        }
        .nav {
          text-align: center;
          margin: 2rem 0;
        }
        .nav a {
          display: inline-block;
          margin: 0 1rem;
          padding: 0.75rem 1.5rem;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background 0.3s;
        }
        .nav a:hover {
          background: #5a6fd8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Launch Day - College Event Registration Portal</h1>
      </div>
      <div class="container">
        <div class="status">Status: OK</div>
        <div class="nav">
          <a href="/register">Register</a>
          <a href="/login">Login</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Registration form
app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Register - College Event Portal</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 {
          margin: 0;
          color: white;
          font-size: 1.8rem;
        }
        .container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          flex: 1;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
        }
        button {
          padding: 0.75rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: #5a6fd8;
        }
        .back-link {
          text-align: center;
          margin-top: 1rem;
        }
        .back-link a {
          color: #667eea;
          text-decoration: none;
        }
        .back-link a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Launch Day - College Event Registration Portal</h1>
      </div>
      <div class="container">
        <h1>User Registration</h1>
        <form action="/register" method="post">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Register</button>
        </form>
        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Handle registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).send('Username already exists');
  }
  users.push({ username, password });
  res.redirect('/login');
});

// Login form
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - College Event Portal</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 {
          margin: 0;
          color: white;
          font-size: 1.8rem;
        }
        .container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          flex: 1;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 1rem;
        }
        button {
          padding: 0.75rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: #5a6fd8;
        }
        .back-link {
          text-align: center;
          margin-top: 1rem;
        }
        .back-link a {
          color: #667eea;
          text-decoration: none;
        }
        .back-link a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Launch Day - College Event Registration Portal</h1>
      </div>
      <div class="container">
        <h1>Login</h1>
        <form action="/login" method="post">
          <input type="text" name="username" placeholder="Username" required>
          <input type="password" name="password" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Handle login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }
  req.session.user = user;
  res.redirect('/dashboard');
});

// Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dashboard - College Event Portal</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 {
          margin: 0;
          color: white;
          font-size: 1.8rem;
        }
        .container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          flex: 1;
        }
        .welcome {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }
        .stats {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 2rem 0;
          text-align: center;
        }
        .stats h3 {
          margin: 0 0 0.5rem 0;
          color: #667eea;
        }
        .register-btn {
          display: block;
          width: 100%;
          padding: 1rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1.1rem;
          cursor: pointer;
          margin: 1rem 0;
          transition: background 0.3s;
        }
        .register-btn:hover {
          background: #218838;
        }
        .nav {
          text-align: center;
          margin-top: 2rem;
        }
        .nav a {
          display: inline-block;
          margin: 0 0.5rem;
          padding: 0.5rem 1rem;
          color: #667eea;
          text-decoration: none;
          border-radius: 5px;
          transition: background 0.3s;
        }
        .nav a:hover {
          background: #f8f9fa;
        }
        .logout {
          color: #dc3545 !important;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Launch Day - College Event Registration Portal</h1>
      </div>
      <div class="container">
        <h1 class="welcome">Welcome, ${req.session.user.username}!</h1>
        <div class="stats">
          <h3>Total Event Registrations</h3>
          <p style="font-size: 2rem; margin: 0; color: #28a745;">${registrations.length}</p>
        </div>
        <button class="register-btn" onclick="window.location.href='/register-event'">Register for Event</button>
        <div class="nav">
          <a href="/">Home</a>
          <a href="/logout" class="logout">Logout</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Event registration form
app.get('/register-event', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Registration - College Event Portal</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header h1 {
          margin: 0;
          color: white;
          font-size: 1.8rem;
        }
        .container {
          max-width: 500px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          flex: 1;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }
        .event-info {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          text-align: center;
        }
        .event-info h2 {
          margin: 0 0 0.5rem 0;
          color: #667eea;
        }
        .register-btn {
          display: block;
          width: 100%;
          padding: 1rem;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1.1rem;
          cursor: pointer;
          margin: 1rem 0;
          transition: background 0.3s;
        }
        .register-btn:hover {
          background: #218838;
        }
        .back-link {
          text-align: center;
          margin-top: 1rem;
        }
        .back-link a {
          color: #667eea;
          text-decoration: none;
        }
        .back-link a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Launch Day - College Event Registration Portal</h1>
      </div>
      <div class="container">
        <h1>Event Registration</h1>
        <div class="event-info">
          <h2>College Launch Day Event</h2>
          <p>Join us for an exciting day of activities, networking, and fun!</p>
        </div>
        <form action="/register-event" method="post">
          <button type="submit" class="register-btn">Register for Event</button>
        </form>
        <div class="back-link">
          <a href="/dashboard">← Back to Dashboard</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Handle event registration
app.post('/register-event', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Not logged in');
  }
  registrations.push({ username: req.session.user.username, timestamp: new Date() });
  res.redirect('/dashboard');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});