const router = require('express').Router();
const authController = require('../controllers/authController');
const articleController = require('../controllers/articleController');

router.post('/article', authController.verification, articleController);
