const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'FootballPlayerslist'
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const playerSchema = new mongoose.Schema({
  name: String,
  position: String,
  country: String,
  age: Number,
  stats: {
    goals: Number,
    assists: Number,
    appearances: Number
  }
});

const Player = mongoose.model('Player', playerSchema, 'players');

app.get('/api/players', async (req, res) => {
  try {
    console.log('Fetching players...');
    const players = await Player.find();
    console.log('Players found:', players);
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/players', async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.patch('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Temporary route to add a test player
app.get('/api/addtestplayer', async (req, res) => {
  try {
    const testPlayer = new Player({
      name: "Test Player",
      position: "Forward",
      country: "Testland",
      age: 25,
      stats: {
        goals: 10,
        assists: 5,
        appearances: 20
      }
    });
    await testPlayer.save();
    res.json({ message: "Test player added successfully" });
  } catch (error) {
    console.error('Error adding test player:', error);
    res.status(500).json({ message: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));