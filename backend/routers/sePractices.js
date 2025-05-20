const express = require('express');
const router = express.Router();
const { 
  getAllPractices, 
  getPracticeById, 
  addSamplePractices 
} = require('../controllers/sePracticeController');

// Get all practices
router.get('/', getAllPractices);

// Get single practice by ID
router.get('/:id', getPracticeById);

// Add sample practices (for development)
router.post('/samples', addSamplePractices);

module.exports = router;