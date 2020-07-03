import React, { useState, useEffect, useRef } from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { MdDragHandle } from 'react-icons/md';

export function NewTask({ visible, hide }) {

  const [newTask, setNewTask] = useState('');
  const inputEl = useRef(null);

  useEffect(() => {
    if (visible) {
      inputEl.current.focus();
    } else {
      inputEl.current.blur();
    }
  }, [visible]);

  function handleKeyDown(event) {
    // if (event.key === 'Enter') {
    if (event.keyCode === 13) {
      event.persist();
      db.collection('tasks')
        .add({
          content: newTask,
          created: firebase.firestore.Timestamp.now(),
        })
        .then(() => {
          hide();
        })
        .catch(error => {
          console.error('Error creating task: ', error);
        });
    }
  }

  return (
    <div className={'new-task' + (visible ? '--expanded' : '')}>
      <div className="new-task__drag-handle">
        <MdDragHandle />
      </div>
      <input
        type="text"
        ref={inputEl}
        value={newTask}
        onChange={e => setNewTask(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={hide}
        placeholder="New task"
      />
    </div>
  );
}
