import React, { useContext } from 'react';
import { NewTaskContext } from '../context';
import { FaPlus } from 'react-icons/fa';

export function Navbar() {
  const newTask = useContext(NewTaskContext);

  return (
    <div className="navbar">
      <div className="navbar__add-task" onClick={newTask.show}>
        <FaPlus />
      </div>
    </div>
  );
}
