import { useState, useEffect } from 'react';
import { db } from '../firebase';

export function useTasks() {
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    console.log('using effect...');
    const tasksQuery = db.collection('tasks');

    const unsubscribe = tasksQuery.onSnapshot(snapshot => {
      console.log('new snapshot!');
      const newTasks = snapshot.docs.map(task => ({
        id: task.id,
        ...task.data(),
      }));

      setActiveTasks(newTasks.filter(task => !task.completed));
      setCompletedTasks(newTasks.filter(task => task.completed));
    });

    return unsubscribe;
  }, []);

  return { activeTasks, completedTasks };
}

// demoUserId: JuYpEGxmn1bmDfpAFeRU
