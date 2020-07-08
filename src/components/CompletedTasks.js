import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { TaskList } from './TaskList';

export function CompletedTasks({ tasks, order }) {
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
        console.error('Failed to set task active.', error);
      });
  }

  return (
    <>
      <div
        className="show-completed"
        onClick={() => setShowCompleted(!showCompleted)}
      >
        <span>Completed ({order.length})</span>
        {showCompleted ? (
          <FaChevronUp className="show-completed__toggler" />
        ) : (
          <FaChevronDown className="show-completed__toggler" />
        )}
      </div>

      {showCompleted && (
        <TaskList tasks={tasks} order={order} checkTask={unsetCompleted} />
      )}
    </>
  );
}
