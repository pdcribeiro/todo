import React from 'react';
import * as firebase from 'firebase/app';
import { useTasks } from '../hooks/useTasks';
import { db } from '../firebase';
import { FaRegCircle } from 'react-icons/fa';

export function ActiveTasks() {
  const { tasks } = useTasks();

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

  return (
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
  );
}
