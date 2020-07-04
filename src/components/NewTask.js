import React, { useState, useEffect, useRef } from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { MdDragHandle } from 'react-icons/md';

export function NewTask({ visible, hide }) {
  const [saving, setSaving] = useState(false);
  const [newTask, setNewTask] = useState('');
  const inputEl = useRef(null);

  useEffect(() => {
    if (visible) {
      inputEl.current.focus();
    } else {
      inputEl.current.blur();
    }
  }, [visible]);

  function save() {
    if (saving) return;

    if (newTask !== '') {
      setSaving(true);
      db.collection('tasks')
        .add({
          content: newTask,
          created: firebase.firestore.Timestamp.now(),
        })
        .then(() => {
          setNewTask('');
        })
        .catch(error => {
          console.error('Error creating task: ', error);
        })
        .finally(() => {
          setSaving(false);
        });
    }
    hide();
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
        onKeyDown={e => e.keyCode === 13 && save()}
        onBlur={save}
        placeholder="New task"
      />
    </div>
  );
}
