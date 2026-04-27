const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

router.get('/whoami', auth, (req, res) => {
  res.json({
    userId: req.userId,
    role: req.user?.role,
    email: req.user?.email
  });
});

module.exports = router;