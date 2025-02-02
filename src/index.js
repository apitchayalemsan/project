import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import TestState from './TestState';
import reportWebVitals from './reportWebVitals';
import Login from './Login';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './Home';
import Processbuy from './Processbuy';
import History from './History';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="home" element={<Home />} />
        <Route path="processbuy" element={<Processbuy />} />
        <Route path="history" element={<History />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
