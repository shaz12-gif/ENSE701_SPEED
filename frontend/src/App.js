import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PracticesList from './components/PracticesList';
import PracticeDetail from './components/PracticeDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Software Engineering Practices</h1>
        </header>
        <main>
          <Routes>
            <Route path="/practices" element={<PracticesList />} />
            <Route path="/practices/:id" element={<PracticeDetail />} />
            <Route path="/" element={<PracticesList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
