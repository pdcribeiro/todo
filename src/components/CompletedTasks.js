import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import { useTasks } from '../hooks/useTasks';
import { db } from '../firebase';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export function CompletedTasks() {
  const [showCompleted, setShowCompleted] = useState(false);
  const { completedTasks } = useTasks();

  function unsetCompleted(taskId) {
    db.collection('tasks')
      .doc(taskId)
      .update({
        completed: firebase.firestore.FieldValue.delete(),
      })
      .catch(error => {
        console.error('Error completing task: ', error);
      });
  }

  return (
    <>
      <div
        className="show-completed"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        <span>Completed ({completedTasks.length})</span>
        {(showCompleted && (
          <FaChevronUp className="show-completed__toggler" />
        )) || <FaChevronDown className="show-completed__toggler" />}
      </div>

      {showCompleted && (
        <ul className="tasks__list">
          {completedTasks.map(task => (
            <li className="task--completed" key={task.id}>
              <div
                className="task--completed__check"
                onClick={() => unsetCompleted(task.id)}
              >
                <FaCheck />
              </div>

              <span className="task--completed__content">{task.content}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
