import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { TaskEditor } from './TaskEditor';
import { FaCheck, FaRegCircle, FaTimes } from 'react-icons/fa';

const DRAG_BACK_SECS = 0.5;
const MIN_SWIPE = 100;
const MAX_START_DRAG = 50;

export function Task({ task, handleMark }) {
  let scrolling = false;
  const [swiping, setSwiping] = useState(false);
  const [initialPosition, setInitialPosition] = useState(null);
  const [positionX, setPositionX] = useState(0);
  const [unswiping, setUnswiping] = useState(false);
  let dragTimer = null;
  const [dragging, setDragging] = useState(false);
  const [positionY, setPositionY] = useState(0);

  useEffect(() => {
    if (swiping) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }

    // function handleScroll() {
    //   const docEl = document.documentElement;
    //   // if (swiping) alert(docEl.scrollTop);
    //   if (swiping) docEl.scrollTo(0, docEl.scrollTop);
    // }

    // window.addEventListener('scroll', handleScroll);

    // return () => window.removeEventListener('scroll', handleScroll);
  }, [swiping]);

  function handleTouchStart(event) {
    handleMouseDown(event.touches[0]);
  }
  function handleMouseDown(event) {
    setInitialPosition({ x: event.pageX, y: event.pageY });
    
    dragTimer = setTimeout(() => {
      setDragging(true);
    }, 500);
  }

  function handleTouchMove(event) {
    const touch = event.touches[0];
    const offsetX = touch.pageX - initialPosition.x;
    const offsetY = touch.pageY - initialPosition.y;
    if (dragging) {
      setPositionY(Math.trunc(offsetY));
    } else if (swiping) {
      event.preventDefault();
      const newPosition = Math.trunc(offsetX);
      setPositionX(newPosition);
    } else {
      const absOffsetX = Math.abs(offsetX);
      const absOffsetY = Math.abs(offsetY);
      checkDragBounds(absOffsetX, absOffsetY);
      if (!scrolling) {
        if (absOffsetX > absOffsetY) {
          setSwiping(true);
        } else {
          scrolling = true;
        }
      }
    }
  }
  function checkDragBounds(absOffsetX, absOffsetY) {
    if (Math.max(absOffsetX, absOffsetY) > MAX_START_DRAG)
      clearTimeout(dragTimer);
  }
  function handleMouseMove(event) {
    if (initialPosition === null) return;
    const offsetY = event.pageY - initialPosition.y;
    if (dragging) {
      setPositionY(Math.trunc(offsetY));
    } else {
      const absOffsetX = Math.abs(event.pageX - initialPosition.x);
      const absOffsetY = Math.abs(offsetY);
      checkDragBounds(absOffsetX, absOffsetY);
    }
  }

  function handleTouchEnd() {
    if (scrolling) {
      scrolling = false;
    } else if (swiping) {
      handleSwipe();
    } else if (dragging) {
      endDrag();
    }
  }
  function handleSwipe() {
    if (Math.abs(positionX) > MIN_SWIPE) {
      if (positionX > 0) {
        handleClick();
      } else {
        deleteTask();
      }
    } else {
      setUnswiping(true);
      setTimeout(() => setUnswiping(false), 1000);
    }
    setSwiping(false);
    setPositionX(0);
  }
  function deleteTask() {
    db.collection('tasks')
      .doc(task.id)
      .delete()
      .catch(function (error) {
        console.error('Failed to delete task: ', error);
      });
  }
  function endDrag() {
    console.log('hold or drag stopped');
    clearTimeout(dragTimer);
    setDragging(false);
  }

  function handleClick() {
    if (dragging) {
      endDrag();
    } else {
      setEditing(true);
    }
  }

  function preHandleMark(event) {
    event.stopPropagation();
    handleClick();
  }

  const [editing, setEditing] = useState(false);

  if (editing) {
    return <TaskEditor task={task} finish={() => setEditing(false)} />;
  }

  const cssModifier = task.completed ? '--completed' : '';
  return (
    <li
      className={`task${cssModifier}`}
      style={{
        left: positionX + 'px',
        ...(unswiping && { transition: `left ${DRAG_BACK_SECS}s` }),
        top: positionY + 'px',
        ...(dragging && {borderBottom: 'none', zIndex: 10}), 
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      {(swiping || unswiping) && positionX >= 0 && (
        <div className={`task${cssModifier}__before`}>
          {task.completed ? <FaRegCircle /> : <FaCheck />}
        </div>
      )}

      <div className={`task${cssModifier}__check`} onClick={preHandleMark}>
        {task.completed ? <FaCheck /> : <FaRegCircle />}
      </div>

      <span className={`task${cssModifier}__content`}>{task.content}</span>

      <div className="delete-task" onClick={deleteTask}>
        <FaTimes />
      </div>

      {(swiping || unswiping) && positionX <= 0 && (
        <div className={`task${cssModifier}__after`}>
          <FaTimes />
        </div>
      )}
    </li>
  );
}
