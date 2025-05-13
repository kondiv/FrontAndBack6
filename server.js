const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(session({
  secret: crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const users = [];
const cache = {};

const requireAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/');
  next();
};

app.post('/register', async (req, res) => {
  try {
    const { login, password } = req.body;
    if (users.some(u => u.login === login)) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ login, password: hashedPassword });
    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ error: 'Не удалось зарегестрироваться' });
  }
});

app.post('/login', async (req, res) => {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login);
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = login;
    return res.sendStatus(200);
  }
  res.status(401).json({ error: 'Некорректные данные' });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.sendStatus(200);
});

app.get('/profile', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

app.get('/user', requireAuth, (req, res) => {
  res.json({ username: req.session.userId });
});

app.get('/data', requireAuth, (req, res) => {
  const cacheKey = 'api-data';
  
  if (cache[cacheKey] && Date.now() < cache[cacheKey].expires) {
    return res.json(cache[cacheKey].data);
  }

  const newData = {
    timestamp: Date.now(),
    value: Math.random().toString(36).substr(2, 9)
  };
  
  cache[cacheKey] = {
    data: newData,
    expires: Date.now() + 60000
  };
  
  res.json(newData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});