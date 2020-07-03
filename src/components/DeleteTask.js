import React from 'react';
import { db } from '../firebase';
import { FaTimes } from 'react-icons/fa';

export function DeleteTask({ id }) {

  function deleteTask() {
    db.collection('tasks')
      .doc(id)
      .delete()
      .catch(function (error) {
        console.error('Failed to delete task: ', error);
      });
  }

  return (
    <div className="delete-task" onClick={deleteTask}>
      <FaTimes />
    </div>
  );
}
