const app = require('../app');
const connectDB = require('../src/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Database connection failed', error: err.message }));
    return;
  }
  return app(req, res);
};
