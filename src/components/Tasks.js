import React, { useState } from 'react';
import * as firebase from 'firebase/app';
import {
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaRegCircle,
} from 'react-icons/fa';
import { useTasks } from '../hooks/useTasks';
import { db } from '../firebase';

export function Tasks() {
  const { tasks, completedTasks } = useTasks();
  const [showCompleted, setShowCompleted] = useState(false);

  function completeTask(taskId) {
    db.collection('tasks')
      .doc(taskId)
      .update({
        completed: firebase.firestore.Timestamp.now(),
      })
      .catch(error => {
        console.error('Error completing task: ', error);
      });
  }

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
    <div className="tasks">
      <ul className="tasks__list">
        {tasks.map(task => (
          <li className="task" key={task.id}>
            <div className="task__check" onClick={() => completeTask(task.id)}>
              <FaRegCircle />
            </div>
            <span className="task__content">{task.content}</span>
          </li>
        ))}
      </ul>
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
    </div>
  );
}

// To get a Date object from firestore timestamp do: new Date(timestamp.seconds * 1000)
