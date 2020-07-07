import React from 'react';
import { TaskEditor } from './TaskEditor';
import { FaCheck, FaRegCircle, FaTimes } from 'react-icons/fa';

const UNSWIPE_SECS = 0.5;

export function Task({
  task,
  editing,
  finishEditing,
  positionX,
  unswiping,
  handleMark,
  deleteTask,
}) {
  function preHandleMark(event) {
    event.stopPropagation();
    handleMark(task.id);
  }

  // if (editing) {
  //   return <TaskEditor task={task} finish={finishEditing} />;
  // }

  const cssModifier = task.completed ? '--completed' : '';
  return (
    <li
      className={`task${cssModifier}`}
      style={{
        ...(positionX !== undefined && { left: positionX + 'px' }),
        ...(unswiping && { transition: `left ${UNSWIPE_SECS}s` }),
      }}
    >
      {positionX >= 0 && (
        <div className={`task${cssModifier}__before`}>
          {task.completed ? <FaRegCircle /> : <FaCheck />}
        </div>
      )}

      <div
        className={`task${cssModifier}__check`}
        onClick={preHandleMark}
        onMouseUp={e => e.stopPropagation()}
      >
        {task.completed ? <FaCheck /> : <FaRegCircle />}
      </div>

      <span className={`task${cssModifier}__content`}>{task.content}</span>

      <div className="delete-task" onClick={deleteTask}>
        <FaTimes />
      </div>

      {positionX <= 0 && (
        <div className={`task${cssModifier}__after`}>
          <FaTimes />
        </div>
      )}
    </li>
  );
}
