import React from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { TaskList } from './TaskList';

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

  return <TaskList tasks={tasks} handleMark={completeTask} />;
}
