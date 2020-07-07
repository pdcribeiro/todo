import React from 'react';
import { TaskEditor } from './TaskEditor';
import { FaCheck, FaRegCircle, FaTimes } from 'react-icons/fa';

const DRAG_BACK_SECS = 0.5;
const DRAG_STYLE = {
  borderWidth: 0,
  boxShadow: '0 0 2px 2px #555',
  zIndex: 10,
};

export function Task({
  task,
  editing,
  finishEditing,
  positionX,
  unswiping,
  positionY,
  undragging,
  handleMark,
  handleMouseLeave,
  deleteTask,
}) {
  function preHandleMark(event) {
    event.stopPropagation();
    handleMark(task.id);
  }

  function bubbleTaskId(event) {
    event.taskId = task.id;
  }

  if (editing) {
    return <TaskEditor task={task} finish={finishEditing} />;
  }

  const cssModifier = task.completed ? '--completed' : '';
  return (
    <li
      className={`task${cssModifier}`}
      style={{
        ...(positionX !== undefined && { left: positionX + 'px' }),
        ...(positionY !== undefined && {
          top: positionY + 'px',
          ...DRAG_STYLE,
        }),
        ...(unswiping && { transition: `left ${DRAG_BACK_SECS}s` }),
        ...(undragging && {
          transition: `top ${DRAG_BACK_SECS}s`,
          top: '0px',
          ...DRAG_STYLE,
        }),
      }}
      onTouchStart={bubbleTaskId}
      onTouchMove={bubbleTaskId}
      onTouchEnd={bubbleTaskId}
      onMouseDown={bubbleTaskId}
      onMouseMove={bubbleTaskId}
      onMouseUp={bubbleTaskId}
      onMouseLeave={handleMouseLeave}
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
