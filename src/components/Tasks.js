import React from 'react';
import { useTasks } from '../hooks';
import { NewTask } from './NewTask';
import { ActiveTasks } from './ActiveTasks';
import { CompletedTasks } from './CompletedTasks';

export function Tasks() {
  const { activeTasks, completedTasks } = useTasks();

  return (
    <div className="tasks">
      <NewTask />
      <ActiveTasks tasks={activeTasks} />
      <CompletedTasks tasks={completedTasks} />
    </div>
  );
}

// To get a Date object from firestore timestamp do: new Date(timestamp.seconds * 1000)
