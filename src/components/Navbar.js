import React from 'react';
import { FaPlus } from 'react-icons/fa';

export function Navbar({ handleAddTask }) {
  return (
    <div className="navbar">
      <div className="navbar__add-task" onClick={handleAddTask}>
        <FaPlus />
      </div>
    </div>
  );
}
