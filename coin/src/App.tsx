import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Header } from './Header';
import { Layout } from './Layout';
import { LoginForm } from './LoginForm';

function App() {
  return (
    <Layout>
      <Header />
      <LoginForm />
    </Layout>
  );
}

export default App;
