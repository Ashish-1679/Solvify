const express = require('express');
const router = express.Router();

const {
    getSolverDashboard,
    getAskerDashboard,
    getSolverHistory
} = require('../controllers/workspace.js');

router.get('/solver', getSolverDashboard);
router.get('/asker', getAskerDashboard);
router.get('/solver/history', getSolverHistory);

module.exports = router;