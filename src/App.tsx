import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EstablishmentDescriptionPage from './pages/EstablishmentDescriptionPage';
import QuestionsPage from './pages/QuestionsPage';
import ImageUploadPage from './pages/ImageUploadPage';
import LinksPage from './pages/LinksPage';
import FinalArticlePage from './pages/FinalArticlePage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/establishment" element={<EstablishmentDescriptionPage />} />
              <Route path="/questions" element={<QuestionsPage />} />
              <Route path="/images" element={<ImageUploadPage />} />
              <Route path="/links" element={<LinksPage />} />
              <Route path="/article" element={<FinalArticlePage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
