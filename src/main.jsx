/*import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { createRoot } from 'react-dom/client';
//import App from './app.jsx';

function App(){
  return <h1>Testing</h1>;
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);*/

import './style.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app.jsx';

const root = createRoot(document.getElementById('app'));
root.render(<App />);

/*
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);*/

/*
document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`*/

//setupCounter(document.querySelector('#counter'))
