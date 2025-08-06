const mongoose = require('mongoose');

// Define schema
const tokenSchema = new mongoose.Schema({
  device: String,
  token: String,
  timestamp: Number,
});
const Token = mongoose.models.Token || mongoose.model('Token', tokenSchema);

// Connect once
let conn = null;
async function connectToDB() {
  if (!conn) {
    conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send({ error: 'Method Not Allowed' });

  try {
    await connectToDB();
    const { device, token } = req.body;

    if (!token) return res.status(400).send({ error: 'Missing token' });

    await Token.create({
      device: device || 'Anonymous',
      token,
      timestamp: Date.now(),
    });

    res.status(200).json({ message: 'Token saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'DB error', details: err.message });
  }
};
