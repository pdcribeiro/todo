import React from 'react';
import './App.scss';
import { NewTaskProvider } from './context';
import { Tasks } from './components/Tasks';
import { Navbar } from './components/Navbar';

export default function App() {

  return (
    <NewTaskProvider>
      <div className="App">
        <h2 className="title">TODO</h2>
        <Tasks />
        <Navbar />
      </div>
    </NewTaskProvider>
  );
}
