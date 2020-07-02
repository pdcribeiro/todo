import { useState, useEffect } from 'react';
import { db } from '../firebase';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const tasksQuery = db.collection('tasks');

    const unsubscribe = tasksQuery.onSnapshot(snapshot => {
      const newTasks = snapshot.docs.map(task => ({
        id: task.id,
        ...task.data(),
      }));

      setTasks(newTasks.filter(task => !task.completed));
      setCompletedTasks(newTasks.filter(task => task.completed));
    });

    return unsubscribe;
  }, []);

  return { tasks, completedTasks };
}

// demoUserId: JuYpEGxmn1bmDfpAFeRU
