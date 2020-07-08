import React, { useState, useEffect, useRef } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import { Task } from './Task';
import { db } from '../firebase';
import { ORDER_DOC } from '../hooks';

const SortableTask = SortableElement(({ task, editing, check }) => (
  <Task task={task} editing={editing} check={check} />
));

const SortableTaskList = SortableContainer(
  ({
    tasks,
    order,
    checkTask,
    editingTask,
    thisRef,
    onMouseDown,
    onMouseUp,
    handleBlur,
  }) => {
    return (
      <ul
        className="task-list"
        ref={thisRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onBlur={handleBlur}
      >
        {order.map((taskId, index) => (
          <SortableTask
            task={taskId ? tasks[taskId] : null}
            editing={taskId && taskId === editingTask ? true : false}
            check={checkTask}
            key={taskId}
            index={index}
          />
        ))}
      </ul>
    );
  }
);

export function TaskList({ tasks, order, newTask, checkTask }) {
  const thisRef = useRef(null);
  const [localOrder, setLocalOrder] = useState(order.slice());
  const [editingTask, setEditingTask] = useState(null);
  const [mouseDownTask, setMouseDownTask] = useState(null);

  useEffect(() => {
    setLocalOrder([...(newTask ? [null] : []), ...order]);
  }, [newTask, order]);

  function shouldCancelStart() {
    return mouseDownTask === null;
  }

  function handleSortEnd({ oldIndex, newIndex }) {
    if (newIndex !== oldIndex) {
      //TODO handle new task placement
      if (oldIndex === 0) {
        
      } else if (newIndex === 0) {
        newIndex = 1;
      }
      setLocalOrder(localOrder => reorder(localOrder, oldIndex, newIndex));
    }
  }

  function reorder(localOrder, from, to) {
    const newOrder = localOrder.slice();
    const parsedTo = to < 0 ? newOrder.length + to : to;
    const item = newOrder.splice(from, 1)[0];
    newOrder.splice(parsedTo, 0, item);
    updateOrder(newOrder);
    return newOrder;
  }

  function updateOrder(newOrder) {
    // console.log(newOrder);
    return;
    const taskGroup = tasks[newOrder[0]].completed ? 'completed' : 'active';
    db.collection('meta')
      .doc(ORDER_DOC)
      .update({ ['order.' + taskGroup]: newOrder.slice(newTask ? 1 : 0) })
      .catch(error => {
        console.error('Failed to set new task order.', error);
      });
  }

  function handleMouseDown(event) {
    console.log('mouse down')
    setMouseDownTask(event.taskId);
  }

  function handleMouseUp(event) {
    if (!editingTask && event.taskId) {
      setEditingTask(event.taskId);
    }
    setMouseDownTask(null);
  }

  function handleBlur(event) {
    console.log('blur')
    if (editingTask && editingTask !== event.taskId) {
      setEditingTask(null);
    }
  }

  console.log(localOrder);
  return (
    <SortableTaskList
      tasks={tasks}
      order={localOrder}
      checkTask={checkTask}
      editingTask={editingTask}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onBlur={handleBlur}
      thisRef={thisRef}
      lockAxis="y"
      pressDelay={200}
      lockToContainerEdges={true}
      lockOffset={0}
      helperContainer={() => thisRef.current}
      shouldCancelStart={shouldCancelStart}
      onSortEnd={handleSortEnd}
    />
  );
}
