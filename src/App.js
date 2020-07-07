import React, { useState } from 'react';
import './App.scss';
import { useTasks } from './hooks';
import { TaskEditor } from './components/TaskEditor';
import { ActiveTasks } from './components/ActiveTasks';
import { CompletedTasks } from './components/CompletedTasks';
import { Navbar } from './components/Navbar';

export default function App() {
  const [showNewTask, setShowNewTask] = useState(false);
  const { tasks, order } = useTasks();

  return (
    <div className="App">
      <h2 className="title">TODO</h2>
      {tasks && order ? (
        <div className="tasks">
          <TaskEditor
            expanded={showNewTask}
            finish={() => showNewTask && setShowNewTask(false)}
          />
          <ActiveTasks tasks={tasks.active} order={order.active} />
          <CompletedTasks tasks={tasks.completed} order={order.completed} />
        </div>
      ) : (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}
      <Navbar handleAddTask={() => !showNewTask && setShowNewTask(true)} />
    </div>
  );
}
