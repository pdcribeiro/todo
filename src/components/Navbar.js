import React from 'react';
import { FaPlus } from 'react-icons/fa';

export function Navbar({ toggleNewTask }) {
  return (
    <div className="navbar">
      <div className="navbar__add-task" onClick={toggleNewTask}>
        <FaPlus />
      </div>
    </div>
  );
}
