const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');

// Kept for unit-test compatibility (tests read the generated code from here).
// MongoDB is the source of truth in production so verification survives
// serverless cold starts.
const otpStore = new Map();

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Invalid Indian phone number' });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    otpStore.set(phone, { otp, expiresAt: expiresAt.getTime() });
    await Otp.findOneAndUpdate(
      { phone },
      { phone, otp, expiresAt },
      { upsert: true, new: true }
    );

    console.log(`OTP for ${phone}: ${otp}`);

    // No SMS provider is wired up, so the code is returned for this demo
    // environment and shown on the verification screen.
    res.json({ message: 'OTP sent successfully', devOtp: otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' });
    }

    let record = await Otp.findOne({ phone });
    let expiresMs = record ? new Date(record.expiresAt).getTime() : null;

    if (!record && otpStore.has(phone)) {
      const mem = otpStore.get(phone);
      record = { otp: mem.otp };
      expiresMs = mem.expiresAt;
    }

    if (!record) {
      return res.status(400).json({ message: 'OTP not found. Request a new OTP.' });
    }

    if (expiresMs && Date.now() > expiresMs) {
      await Otp.deleteOne({ phone });
      otpStore.delete(phone);
      return res.status(400).json({ message: 'OTP expired. Request a new OTP.' });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await Otp.deleteOne({ phone });
    otpStore.delete(phone);

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const testLogin = async (req, res) => {
  try {
    const phone = '+919876543210';

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, phone: user.phone } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendOtp, verifyOtp, testLogin, otpStore };
