import React, { useState, useEffect, useRef } from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { MdDragHandle } from 'react-icons/md';

export function TaskEditor({ task, blur, visible, hide }) {
  const inputEl = useRef(null);
  const [taskContent, setTaskContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Focus on render when editing and focus/blur on show/hide when creating.
  useEffect(() => {
    if (task || visible) {
      inputEl.current.focus();
    } else {
      inputEl.current.blur();
    }
    return () => blur?.();
  }, [visible]);

  function save() {
    if (taskContent !== '') {
      setSaving(true);
      db.collection('tasks')
        .add({
          content: taskContent,
          created: firebase.firestore.Timestamp.now(),
        })
        .then(() => {
          setTaskContent('');
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

  const cssModifier = task ? '--editing' : visible ? '--expanded' : '';
  return (
    <div className={`task-editor${cssModifier}`}>
      <div className={`task-editor${cssModifier}__drag-handle`}>
        <MdDragHandle />
      </div>
      <input
        type="text"
        ref={inputEl}
        value={taskContent}
        onChange={e => setTaskContent(e.target.value)}
        onKeyDown={e => e.keyCode === 13 && !saving && save()}
        onBlur={!saving && save}
        placeholder={task ? 'Task content' : 'New task'}
      />
    </div>
  );
}
