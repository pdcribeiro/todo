import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { Task } from './Task';

export function CompletedTasks({ tasks }) {
  
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    if (showCompleted) {
      window.scrollBy({
        top: 200,
        behavior: 'smooth',
      });
    }
  }, [showCompleted]);

  function unsetCompleted(taskId) {
    db.collection('tasks')
      .doc(taskId)
      .update({
        completed: firebase.firestore.FieldValue.delete(),
      })
      .catch(error => {
        console.error('Failed to set task active: ', error);
      });
  }

  return (
    <>
      <div
        className="show-completed"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        <span>Completed ({tasks.length})</span>
        {showCompleted ? (
          <FaChevronUp className="show-completed__toggler" />
        ) : (
          <FaChevronDown className="show-completed__toggler" />
        )}
      </div>

      {showCompleted && (
        <ul className="tasks__list">
          {tasks.map(task => (
            <Task
              task={task}
              handleClick={() => unsetCompleted(task.id)}
              key={task.id}
            />
          ))}
        </ul>
      )}
    </>
  );
}
