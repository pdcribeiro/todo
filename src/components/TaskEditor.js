import React, { useContext, useEffect, useRef, useState } from 'react';
import * as firebase from 'firebase/app';

import { NewTaskContext } from '../context';
import { db } from '../firebase';
import { MdDragHandle } from 'react-icons/md';

export function TaskEditor({ task, hide }) {
  const newTask = useContext(NewTaskContext);
  const inputEl = useRef(null);
  const [taskContent, setTaskContent] = useState('');
  const [saving, setSaving] = useState(false);

  // Focus on render when editing and focus/blur on show/hide when creating.
  useEffect(() => {
    if (task) {
      setTaskContent(task.content);
      inputEl.current.focus();
    } else if (newTask.visible) {
      inputEl.current.focus();
    } else {
      inputEl.current.blur();
    }
    return hide;
    // eslint-disable-next-line
  }, [newTask.visible]);

  function save(event) {
    if (taskContent !== '') {
      setSaving(true);
      (task ? update() : create())
        .then(() => {
          setTaskContent('');
        })
        .catch(error => {
          console.error(
            `Error ${task ? 'updating' : 'creating'} task.`,
            error
          );
        })
        .finally(() => {
          setSaving(false);
          handleHide();
        });
    } else {
      handleHide();
    }
    if (task) event.taskId = task.id;
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

  function handleHide() {
    if (task) {
      hide();
    } else {
      newTask.hide();
    }
  }

  //TODO try removing '--editing' modifier
  const cssModifier = task ? '--editing' : newTask.visible ? '--expanded' : '';
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
