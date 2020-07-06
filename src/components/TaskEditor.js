import React, { useState, useEffect, useRef } from 'react';
import * as firebase from 'firebase/app';
import { db } from '../firebase';
import { MdDragHandle } from 'react-icons/md';

export function TaskEditor({ task, expanded, finish }) {
  const inputEl = useRef(null);
  const [taskContent, setTaskContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Focus on render when editing and focus/blur on show/hide when creating.
  useEffect(() => {
    if (task) {
      setTaskContent(task.content);
      inputEl.current.focus();
    } else if (expanded) {
      inputEl.current.focus();
    } else {
      inputEl.current.blur();
    }
    return finish;
  }, [expanded]);

  function save() {
    if (taskContent !== '') {
      setSaving(true);
      (task ? update() : create())
        .then(() => {
          setTaskContent('');
        })
        .catch(error => {
          console.error(
            `Error ${task ? 'updating' : 'creating'} task: `,
            error
          );
        })
        .finally(() => {
          setSaving(false);
          finish();
        });
    } else {
      finish();
    }
  }

  function update() {
    if (taskContent !== task.content) {
      return db
        .collection('tasks')
        .doc(task.id)
        .update({ content: taskContent });
    } else {
      return Promise.resolve();
    }
  }

  function create() {
    return db.collection('tasks').add({
      content: taskContent,
      created: firebase.firestore.Timestamp.now(),
    });
  }

  const cssModifier = task ? '--editing' : expanded ? '--expanded' : '';
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
        onBlur={() => !saving && save()}
        placeholder={task ? 'Task content' : 'New task'}
      />
    </div>
  );
}
