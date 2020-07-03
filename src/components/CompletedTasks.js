import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { FaChevronUp, FaChevronDown, FaCheck } from 'react-icons/fa';
import { DeleteTask } from './DeleteTask';

export function CompletedTasks({ tasks }) {
  const [showCompleted, setShowCompleted] = useState(false);

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
        {(showCompleted && (
          <FaChevronUp className="show-completed__toggler" />
        )) || <FaChevronDown className="show-completed__toggler" />}
      </div>

      {showCompleted && (
        <ul className="tasks__list">
          {tasks.map(task => (
            <li className="task--completed" key={task.id}>

              <div
                className="task--completed__check"
                onClick={() => unsetCompleted(task.id)}
              >
                <FaCheck />
              </div>

              <span className="task--completed__content">{task.content}</span>

              <DeleteTask id={task.id} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
