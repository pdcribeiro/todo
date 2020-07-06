import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { TaskEditor } from './TaskEditor';
import { FaCheck, FaRegCircle, FaTimes } from 'react-icons/fa';

const DRAG_BACK_SECS = 0.5;
const MIN_DRAG = 100;

export function Task({ task, handleClick }) {
  
  const [editing, setEditing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [initialPosition, setInitialPosition] = useState(null);
  const [position, setPosition] = useState(0);
  const thisEl = useRef(null);

  function handleTouchStart(event) {
    setInitialPosition(event.touches[0].pageX);
    setDragging(true);
  }

  function handleTouchMove(event) {
    if (dragging) {
      const newPosition = Math.trunc(event.touches[0].pageX - initialPosition);
      setPosition(newPosition);
    }
  }

  function handleTouchEnd(event) {
    if (Math.abs(position) > MIN_DRAG) {
      if (position > 0) {
        handleClick();
      } else {
        deleteTask();
      }
    }
    else {
      setRestoring(true);
      setTimeout(() => setRestoring(false), 1000);
    }
    setDragging(false);
    setPosition(0);
  }

  function preHandleClick(event) {
    event.stopPropagation();
    handleClick();
  }

  function deleteTask() {
    db.collection('tasks')
      .doc(task.id)
      .delete()
      .catch(function (error) {
        console.error('Failed to delete task: ', error);
      });
  }

  useEffect(() => {
    function handleScroll(event) {
      if (dragging) event.preventDefault();
      // if (dragging) event.stopPropagation();
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [dragging]);

  if (editing) {
    return <TaskEditor task={task} finish={() => setEditing(false)} />;
  }

  const cssModifier = task.completed ? '--completed' : '';
  return (
    <li
      className={`task${cssModifier}`}
      style={{
        left: position + 'px',
        ...(!dragging && { transition: `left ${DRAG_BACK_SECS}s` }),
      }}
      onClick={() => setEditing(true)}
      onMouseDown={e => handleTouchStart({touches: [{pageX: e.pageX, pageY: e.pageY}]})}
      onMouseMove={e => handleTouchMove({touches: [{pageX: e.pageX, pageY: e.pageY}]})}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={thisEl}
    >
      {(dragging || restoring) && position >= 0 && (
        <div className={`task${cssModifier}__before`}>
          {task.completed ? <FaRegCircle /> : <FaCheck />}
        </div>
      )}

      <div className={`task${cssModifier}__check`} onClick={preHandleClick}>
        {task.completed ? <FaCheck /> : <FaRegCircle />}
      </div>

      <span className={`task${cssModifier}__content`}>{task.content}</span>

      <div className="delete-task" onClick={deleteTask}>
        <FaTimes />
      </div>

      {(dragging || restoring)  && position <= 0 && (
        <div className={`task${cssModifier}__after`}>
          <FaTimes />
        </div>
      )}
    </li>
  );
}
