const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/Ro-authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors());
app.use(express.json());

// Registration endpoint
app.post('/api/register', async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: 'ok' });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', error: 'Duplicate email' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid login' });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      'secret123'
    );

    return res.json({ status: 'ok', user: token });
  } else {
    return res.json({ status: 'error', user: false });
  }
});

// GET quote endpoint
app.get('/api/quote', async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, 'secret123');
    const email = decoded.email;
    const user = await User.findOne({ email: email });
    res.json({ status: 'ok', quote: user.quote });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', error: 'Invalid token' });
  }
});

// POST quote endpoint
app.post('/api/quote', async (req, res) => {
  const token = req.headers['x-access-token'];
  try {
    const decoded = jwt.verify(token, 'secret123');
    const email = decoded.email;
    await User.updateOne(
      { email: email },
      { $set: { quote: req.body.quote } }
    );
    const user = await User.findOne({ email: email });
    res.json({ status: 'ok', quote: user.quote });
  } catch (err) {
    console.log(err);
    res.json({ status: 'error', error: 'Invalid token' });
  }
});

app.listen(1337, () => {
  console.log('Server is running on http://localhost:1337');
});