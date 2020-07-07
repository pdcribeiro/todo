import { useState, useEffect } from 'react';
import { db } from '../firebase';

// export const USER_ID = 'JuYpEGxmn1bmDfpAFeRU';
export const ORDER_DOC = 'NpxTntymkx3zncLAJ2y5';

export function useTasks() {
  const [tasks, setTasks] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const tasksQuery = db.collection('tasks');
    const orderDocument = db.collection('meta').doc(ORDER_DOC);

    const unsubscribeTasks = tasksQuery.onSnapshot(col => {
      console.log('new tasks snapshot!');
      const newTasks = col.docs.reduce(
        (tasks, task) => {
          const taskData = task.data();
          if (taskData.completed) {
            tasks.completed[task.id] = taskData;
          } else {
            tasks.active[task.id] = taskData;
          }
          return tasks;
        },
        { active: {}, completed: {} }
      );

      setTasks(newTasks);
    });

    const unsubscribeOrder = orderDocument.onSnapshot(doc => {
      console.log('new order snapshot!');
      setOrder(doc.data().order);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeOrder();
    };
  }, []);

  return { tasks, order };
}
