import React from 'react';

import { db } from '../firebase';
import { TaskEditor } from './TaskEditor';
import { FaCheck, FaRegCircle, FaTimes } from 'react-icons/fa';

export function Task({ task, editing, check }) {
  function bubbleTaskId(event) {
    event.taskId = task.id;
  }

  function handleCheck(event) {
    event.stopPropagation();
    check(task.id);
  }

  function deleteTask() {
    db.collection('tasks')
      .doc(task.id)
      .delete()
      .catch(function (error) {
        console.error('Failed to delete task: ', error);
      });
  }

  if (!task) {
    return <TaskEditor />;
  }

  if (editing) {
    return <TaskEditor task={task} />;
  }

  const cssModifier = task.completed ? '--completed' : '';
  return (
    <li
      className={`task${cssModifier}`}
      onMouseDown={bubbleTaskId}
      onMouseUp={bubbleTaskId}
    >
      <div
        className={`task${cssModifier}__check`}
        onClick={handleCheck}
        onMouseUp={e => e.stopPropagation()}
      >
        {task.completed ? <FaCheck /> : <FaRegCircle />}
      </div>

      <span className={`task${cssModifier}__content`}>{task.content}</span>

      <div className="delete-task" onClick={deleteTask}>
        <FaTimes />
      </div>
    </li>
  );
}
