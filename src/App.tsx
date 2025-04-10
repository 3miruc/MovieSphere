
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const HomePage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold text-center mb-8">MovieSphere</h1>
    <p className="text-center text-lg mb-6">
      Bienvenue sur MovieSphere, votre application de films et séries préférée.
    </p>
    <div className="text-center">
      <a 
        href="/movies" 
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Explorer les films
      </a>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
