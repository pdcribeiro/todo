import React, { useState } from 'react';
import './App.scss';
import { Navbar } from './components/Navbar';
import { Tasks } from './components/Tasks';

function App() {
  const [showNewTask, setShowNewTask] = useState(false);

  return (
    <div className="App">
      <h2 className="title">TODO</h2>
      <Tasks showNewTask={showNewTask} />
      <Navbar toggleNewTask={() => setShowNewTask(!showNewTask)} />
    </div>
  );
}

export default App;
