import React from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { FaRegCircle } from 'react-icons/fa';
import { DeleteTask } from './DeleteTask';

export function ActiveTasks({ tasks }) {

  function completeTask(taskId) {
    db.collection('tasks')
      .doc(taskId)
      .update({
        completed: firebase.firestore.Timestamp.now(),
      })
      .catch(error => {
        console.error('Failed to set task completed: ', error);
      });
  }

  return (
    <ul className="tasks__list">
      {tasks.map(task => (
        <li className="task" key={task.id}>

          <div className="task__check" onClick={() => completeTask(task.id)}>
            <FaRegCircle />
          </div>

          <span className="task__content">{task.content}</span>
          
          <DeleteTask id={task.id} />
        </li>
      ))}
    </ul>
  );
}
