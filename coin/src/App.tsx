import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Header } from './Header';
import { Layout } from './Layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';
import { CurrencyPage } from './CurrencyPage';

function App() {
  const [isUser, setIsUser] = useState(false);

  return (
    <BrowserRouter>
      <Header />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="currency" element={<CurrencyPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
