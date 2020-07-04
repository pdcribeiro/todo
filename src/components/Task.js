import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { FaCheck, FaRegCircle, FaTimes } from 'react-icons/fa';

const DRAG_BACK_SECS = 0.5;
const MIN_DRAG = 100;

export function Task({ task, handleClick }) {
  const [dragging, setDragging] = useState(false);
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

  function handleTouchEnd() {
    if (Math.abs(position) > MIN_DRAG) {
      if (position > 0) {
        console.log('completing...');
        handleClick();
      } else {
        console.log('deleting...');
        deleteTask();
      }
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
      console.log(event);
      if (dragging) event.preventDefault();
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [dragging]);

  const cssModifier = task.completed ? '--completed' : '';
  return (
    <li
      className={`task${cssModifier}`}
      style={{
        left: position + 'px',
        ...(!dragging && { transition: `left ${DRAG_BACK_SECS}s` }),
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={thisEl}
    >
      {dragging && position >= 0 && (
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

      {dragging && position <= 0 && (
        <div className={`task${cssModifier}__after`}>
          <FaTimes />
        </div>
      )}
    </li>
  );
}
