import React, { useState } from 'react';
import './App.css';
import { Layout } from './Layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { HomePage } from './HomePage';
import { CurrencyPage } from './CurrencyPage';
import { AtmPage } from './AtmPage';
import { AccountPage } from './AccountPage';
import { BalancePage } from './BalancePage';
import { Header2 } from './Header2';

function App() {
  return (
    <BrowserRouter>
      <Header2 />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="account/:account" element={<AccountPage />} />
          <Route path="atm" element={<AtmPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="currency" element={<CurrencyPage />} />
          <Route path="balance/:account" element={<BalancePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
