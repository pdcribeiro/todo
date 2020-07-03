import React, { useState } from 'react';
import { MdDragHandle } from 'react-icons/md';
import { ActiveTasks } from './ActiveTasks';
import { CompletedTasks } from './CompletedTasks';

export function Tasks({ showNewTask }) {
  const [newTask, setNewTask] = useState('');

  return (
    <div className="tasks">

      <div className={'new-task' + (showNewTask ? '--expanded' : '')}>
        <div className="new-task__drag-handle">
          <MdDragHandle />
        </div>
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="New task"
        />
      </div>

      <ActiveTasks />
      <CompletedTasks />
    </div>
  );
}

// To get a Date object from firestore timestamp do: new Date(timestamp.seconds * 1000)
