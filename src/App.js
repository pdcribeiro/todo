import React from 'react';
import './App.scss';
import { Navbar } from './components/Navbar';
import { Tasks } from './components/Tasks';

function App() {
  return (
    <div className="App">
      <h2 className="title">TODO</h2>
      <Tasks />
      <Navbar />
    </div>
  );
}

export default App;
