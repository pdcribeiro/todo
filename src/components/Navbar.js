import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

export function Navbar() {
  const [showAddTask, setShowAddtask] = useState(false);
  const [task, setTask] = useState('');

  return (
    // <div className="navbar">
    <div className={"navbar" + (showAddTask ? '--expanded' : '')}>
      <div className="navbar__add-task" onClick={() => setShowAddtask(!showAddTask)}>
        <FaPlus />
      </div>
      {/* <div className={"navbar__task-data" + (showAddTask ? '--expanded' : '')}> */}
      <div className="navbar__task-data">
        <input type="text" value={task} onChange={e => setTask(e.target.value)} />
      </div>
    </div>
  );
}
