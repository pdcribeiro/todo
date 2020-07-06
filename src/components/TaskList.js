import React from 'react';
import { Task } from './Task';

export function TaskList({ tasks, handleMark }) {


  return (
    <ul className="task-list">
      {tasks.map(task => (
        <Task
          task={task}
          handleMark={() => handleMark(task.id)}
          key={task.id}
        />
      ))}
    </ul>
  );
}
