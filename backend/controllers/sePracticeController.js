const SEPractice = require('../models/SEPractice');

// Get all SE practices
exports.getAllPractices = async (req, res) => {
  try {
    const practices = await SEPractice.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: practices.length,
      data: practices
    });
  } catch (error) {
    console.error('Error fetching SE practices:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single SE practice by ID
exports.getPracticeById = async (req, res) => {
  try {
    const practice = await SEPractice.findById(req.params.id);
    
    if (!practice) {
      return res.status(404).json({
        success: false,
        error: 'Practice not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: practice
    });
  } catch (error) {
    console.error('Error fetching SE practice:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add some sample practices (for development purposes)
exports.addSamplePractices = async (req, res) => {
  try {
    // Check if practices already exist
    const count = await SEPractice.countDocuments();
    if (count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Sample practices already exist'
      });
    }
    
    const samplePractices = [
      {
        name: 'Test-Driven Development (TDD)',
        description: 'Development approach where tests are written before code implementation',
        evidenceCount: 15
      },
      {
        name: 'Continuous Integration (CI)',
        description: 'Practice of frequently integrating code changes into a shared repository',
        evidenceCount: 12
      },
      {
        name: 'Pair Programming',
        description: 'Development technique where two programmers work together at one workstation',
        evidenceCount: 8
      },
      {
        name: 'Agile Scrum',
        description: 'Framework for managing complex product development using iterative approach',
        evidenceCount: 20
      },
      {
        name: 'Kanban',
        description: 'Visual system for managing work as it moves through a process',
        evidenceCount: 6
      }
    ];
    
    await SEPractice.insertMany(samplePractices);
    
    res.status(201).json({
      success: true,
      count: samplePractices.length,
      message: 'Sample practices added successfully'
    });
  } catch (error) {
    console.error('Error adding sample practices:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};