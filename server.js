import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://prathmeshcoder69_db_user:Parthislive@cluster0.okaazwr.mongodb.net/anime-db?retryWrites=true&w=majority';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable not set');
  process.exit(1);
}

console.log('🔗 Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Anime Schema
const animeSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail_url: String,
  banner_url: String,
  genres: [String],
  languages: [String],
  season: String,
  release_year: Number,
  status: String,
  content_type: String,
  total_episodes: Number,
  next_episode_date: Date,
  series_name: String,
  season_number: Number,
  rating: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

// Episode Schema
const episodeSchema = new mongoose.Schema({
  anime_id: String,
  episode_number: Number,
  title: String,
  description: String,
  video_url: String,
  duration: Number,
  thumbnail_url: String,
  created_at: { type: Date, default: Date.now }
});

// Profile Schema
const profileSchema = new mongoose.Schema({
  id: String,
  username: String,
  avatar_url: String,
  role: { type: String, default: 'user' },
  created_at: { type: Date, default: Date.now }
});

const Anime = mongoose.model('Anime', animeSchema);
const Episode = mongoose.model('Episode', episodeSchema);
const Profile = mongoose.model('Profile', profileSchema);

// Anime Routes
app.get('/api/anime', async (req, res) => {
  try {
    const anime = await Anime.find().sort({ created_at: -1 });
    res.json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/anime/:id', async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    res.json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/anime', async (req, res) => {
  try {
    const anime = new Anime(req.body);
    await anime.save();
    res.json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/anime/:id', async (req, res) => {
  try {
    const anime = await Anime.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/anime/:id', async (req, res) => {
  try {
    await Anime.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Episode Routes
app.get('/api/episodes/:animeId', async (req, res) => {
  try {
    const episodes = await Episode.find({ anime_id: req.params.animeId }).sort({ episode_number: 1 });
    res.json(episodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/episodes', async (req, res) => {
  try {
    const episode = new Episode(req.body);
    await episode.save();
    res.json(episode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/episodes/:id', async (req, res) => {
  try {
    await Episode.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profile Routes
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profiles/:id/role', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));
