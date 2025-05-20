// Backend implementation - server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Sample data - this would typically come from a database
const practices = [
  {
    id: 1,
    name: "Test-Driven Development (TDD)",
    description: "Writing tests before code to guide development.",
    evidence: [
      { id: 1, title: "Study on TDD Effectiveness", author: "Kim et al.", year: 2022, summary: "Showed 40% reduction in bugs when using TDD." },
      { id: 2, title: "TDD in Enterprise Applications", author: "Smith et al.", year: 2021, summary: "Case study of TDD implementation in large-scale applications." }
    ]
  },
  {
    id: 2,
    name: "Continuous Integration",
    description: "Frequently merging code changes to a shared repository.",
    evidence: [
      { id: 3, title: "CI/CD Pipeline Benefits", author: "Johnson et al.", year: 2023, summary: "Quantified delivery speed improvements with CI adoption." },
      { id: 4, title: "CI Best Practices", author: "Lee et al.", year: 2022, summary: "Guidelines for implementing effective CI workflows." }
    ]
  },
  {
    id: 3,
    name: "Pair Programming",
    description: "Two programmers working together at one workstation.",
    evidence: [
      { id: 5, title: "Pair Programming in Education", author: "Brown et al.", year: 2021, summary: "Benefits of pair programming for knowledge transfer." },
      { id: 6, title: "Cost-Benefit Analysis of Pair Programming", author: "Davis et al.", year: 2020, summary: "ROI assessment of pair programming in commercial settings." }
    ]
  },
  {
    id: 4,
    name: "Agile Development",
    description: "Iterative approach to software development.",
    evidence: [
      { id: 7, title: "Agile vs. Waterfall", author: "Wilson et al.", year: 2023, summary: "Comparative study of project outcomes in different methodologies." },
      { id: 8, title: "Scaling Agile", author: "Martinez et al.", year: 2022, summary: "Challenges and solutions for large-scale agile implementations." }
    ]
  },
  {
    id: 5,
    name: "Code Reviews",
    description: "Systematic examination of code by peers.",
    evidence: [
      { id: 9, title: "Code Review Effectiveness", author: "Taylor et al.", year: 2021, summary: "Measured impact of code reviews on product quality." },
      { id: 10, title: "Automating Code Reviews", author: "Patel et al.", year: 2023, summary: "Tools and techniques for efficient code reviews." }
    ]
  }
];

// Get all practices
app.get('/api/practices', (req, res) => {
  res.json(practices.map(practice => ({
    id: practice.id,
    name: practice.name,
    description: practice.description,
    evidenceCount: practice.evidence.length
  })));
});

// Get a specific practice with its evidence
app.get('/api/practices/:id', (req, res) => {
  const practice = practices.find(p => p.id === parseInt(req.params.id));
  
  if (!practice) {
    return res.status(404).json({ message: "Practice not found" });
  }
  
  res.json(practice);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});