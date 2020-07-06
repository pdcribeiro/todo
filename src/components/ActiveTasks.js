import React from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { Task } from './Task';

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
        <Task
          task={task}
          handleClick={() => completeTask(task.id)}
          key={task.id}
        />
      ))}
    </ul>
  );
}
