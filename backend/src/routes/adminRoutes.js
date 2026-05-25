const express = require('express');
const Restaurant = require('../models/Restaurant');
const { restaurants } = require('../seed/seed');

const router = express.Router();

router.post('/seed', async (req, res) => {
  const key = req.query.key || req.headers['x-seed-key'];
  if (!process.env.SEED_KEY || key !== process.env.SEED_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    await Restaurant.deleteMany({});
    const created = await Restaurant.insertMany(restaurants);
    const count = await Restaurant.countDocuments();
    res.json({ message: 'Seeded successfully', inserted: created.length, total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
