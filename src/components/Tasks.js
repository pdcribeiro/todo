import React from 'react';
import { useTasks } from '../hooks';
import { ActiveTasks } from './ActiveTasks';
import { CompletedTasks } from './CompletedTasks';

export function Tasks() {
  const { tasks, order } = useTasks();

  return tasks && order ? (
    <div className="tasks">
      <ActiveTasks tasks={tasks.active} order={order.active} />
      <CompletedTasks tasks={tasks.completed} order={order.completed} />
    </div>
  ) : (
    <div className="loading">
      <div className="spinner"></div>
    </div>
  );
}
