import React, { useState, useEffect } from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import { db } from '../firebase';
import { Task } from './Task';

const MIN_SWIPE = 100;
const MAX_START_DRAG = 50;

export function TaskList({ tasks, handleMark }) {
  let scrolling = false;
  const [editingTask, setEditingTask] = useState(null);
  const [initialPosition, setInitialPosition] = useState(null);
  const [swipingTask, setSwipingTask] = useState(null);
  const [positionX, setPositionX] = useState(0);
  const [unswipingTask, setUnswipingTask] = useState(null);
  const [dragTimer, setDragTimer] = useState(null);
  const [holding, setHolding] = useState(false);
  const [draggingTask, setDraggingTask] = useState(null);
  const [positionY, setPositionY] = useState(0);
  const [undraggingTask, setUndraggingTask] = useState(null);

  useEffect(() => {
    if (swipingTask) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }

    // function handleScroll() {
    //   const docEl = document.documentElement;
    //   // if (swipingTask) alert(docEl.scrollTop);
    //   if (swipingTask) docEl.scrollTo(0, docEl.scrollTop);
    // }

    // window.addEventListener('scroll', handleScroll);

    // return () => window.removeEventListener('scroll', handleScroll);
  }, [swipingTask]);

  function handleTouchStart(event) {
    const { screenX, screenY } = event.touches[0];
    handleMouseDown({ screenX, screenY, taskId: event.taskId });
  }
  function handleMouseDown(event) {
    if (editingTask) return;
    setInitialPosition({ x: event.screenX, y: event.screenY });
    setHolding(true);

    setDragTimer(setTimeout(() => {
      setDraggingTask(event.taskId);
      setPositionY(0);
    }, 200));
  }

  function handleTouchMove(event) {
    if (editingTask) return;
    const touch = event.touches[0];
    const offsetX = touch.screenX - initialPosition.x;
    const offsetY = touch.screenY - initialPosition.y;
    if (draggingTask) {
      setPositionY(Math.trunc(offsetY));
    } else if (swipingTask) {
      // event.preventDefault();
      setPositionX(Math.trunc(offsetX));
    } else {
      const absOffsetX = Math.abs(offsetX);
      const absOffsetY = Math.abs(offsetY);
      if (checkCanDrag(absOffsetX, absOffsetY) && !scrolling) {
        if (absOffsetX > absOffsetY) {
          setSwipingTask(event.taskId);
          setPositionX(0);
        } else {
          scrolling = true;
        }
      }
    }
  }
  function checkCanDrag(absOffsetX, absOffsetY) {
    if (!holding) {
      return false;
    } else if (Math.max(absOffsetX, absOffsetY) > MAX_START_DRAG) {
      clearTimeout(dragTimer);
      setHolding(false);
      return false;
    } else {
      return true;
    }
  }
  function handleMouseMove(event) {
    if (editingTask || !holding) return;
    const offsetY = event.screenY - initialPosition.y;
    if (draggingTask) {
      setPositionY(Math.trunc(offsetY));
    } else {
      const offsetX = event.screenX - initialPosition.x;
      checkCanDrag(Math.abs(offsetX), Math.abs(offsetY));
    }
  }

  function handleTouchEnd(event) {
    if (scrolling) {
      scrolling = false;
    } else if (swipingTask) {
      handleSwipe(event.taskId);
    } else {
      handleMouseUp(event);
    }
  }
  function handleSwipe(taskId) {
    if (Math.abs(positionX) > MIN_SWIPE) {
      if (positionX > 0) {
        handleMark(taskId);
      } else {
        deleteTask(taskId);
      }
    } else {
      setUnswipingTask(taskId);
      setTimeout(() => setUnswipingTask(null), 500);
    }
    setSwipingTask(null);
    setPositionX(0);
  }
  function handleMouseUp(event) {
    if (draggingTask) {
      handleDrag(event.taskId);
    } else {
      if (holding) {
        clearTimeout(dragTimer);
        setHolding(false);
        // setDraggingTask(null);
      }
      setEditingTask(event.taskId);
    }
  }
  // unfinished
  function handleDrag(taskId) {
    clearTimeout(dragTimer);
    setUndraggingTask(taskId);
    setTimeout(() => setUndraggingTask(null), 500);
    setHolding(false);
    setDraggingTask(null);
    setPositionY(0);
  }

  function handleMouseLeaveTask() {
    if (holding && !draggingTask) {
      clearTimeout(dragTimer);
      setHolding(false);
      setDraggingTask(null);
    }
  }

  function deleteTask(taskId, event) {
    event && event.stopPropagation();
    db.collection('tasks')
      .doc(taskId)
      .delete()
      .catch(function (error) {
        console.error('Failed to delete task: ', error);
      });
  }

  return (
    <ul
      className="task-list"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {tasks.map(task =>
        task.id === editingTask ? (
          <Task
            task={task}
            editing={true}
            finishEditing={() => setEditingTask(null)}
            key={task.id}
          />
        ) : task.id === swipingTask ? (
          <Task task={task} positionX={positionX} key={task.id} />
        ) : task.id === unswipingTask ? (
          <Task task={task} unswiping={true} key={task.id} />
        ) : task.id === draggingTask ? (
          <Task task={task} positionY={positionY} key={task.id} />
        ) : task.id === undraggingTask ? (
          <Task task={task} undragging={true} key={task.id} />
        ) : (
          <Task
            task={task}
            handleMark={handleMark}
            handleMouseLeave={handleMouseLeaveTask}
            deleteTask={e => deleteTask(task.id, e)}
            key={task.id}
          />
        )
      )}
      <p>{`height: ${0}`}</p>
      <p>{`holding: ${holding}, draggingTask: ${draggingTask}`}</p>
    </ul>
  );
}
