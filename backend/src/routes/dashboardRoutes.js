const router = require('express').Router();
const controller = require('../controllers/dashboardController');
router.get('/resumo', controller.resumo);
module.exports = router;
