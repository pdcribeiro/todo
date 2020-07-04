import React, { useState } from 'react';
import './App.scss';
import { useTasks } from './hooks';
// import { Tasks } from './components/Tasks';
import { TaskEditor } from './components/TaskEditor';
import { ActiveTasks } from './components/ActiveTasks';
import { CompletedTasks } from './components/CompletedTasks';
import { Navbar } from './components/Navbar';

export default function App() {
  const [showNewTask, setShowNewTask] = useState(false);
  const { activeTasks, completedTasks } = useTasks();

  return (
    <div className="App">
      <h2 className="title">TODO</h2>
      {activeTasks === null || completedTasks === null ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="tasks">
          <TaskEditor
            visible={showNewTask}
            hide={() => showNewTask && setShowNewTask(false)}
          />
          <ActiveTasks tasks={activeTasks} />
          <CompletedTasks tasks={completedTasks} />
        </div>
      )}
      <Navbar handleAddTask={() => !showNewTask && setShowNewTask(true)} />
    </div>
  );
}
