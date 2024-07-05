import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SecondPage from './components/SecondPage';
import UserForm from './components/UseForm';
// import "./App.css"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/second" element={
          localStorage.getItem('userDetails') ? <SecondPage /> : <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
};

export default App;
