import React, { useState, useEffect, useRef } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { db } from '../firebase';
import { Task } from './Task';
import { ORDER_DOC } from '../hooks';

export function TaskList({ tasks, order, handleMark }) {
  const thisEl = useRef(null);
  const [localOrder, setLocalOrder] = useState(order.slice());

  useEffect(() => {
    setLocalOrder(order.slice());
  }, [order]);

  const SortableTask = SortableElement(({ task }) => <Task task={task} />);

  const SortableTaskList = SortableContainer(({ tasks, order }) => (
    <ul className="task-list" ref={thisEl}>
      {order.map((taskId, index) => (
        <SortableTask key={taskId} index={index} task={tasks[taskId]} />
      ))}
    </ul>
  ));

  function handleSortEnd({ oldIndex, newIndex }) {
    if (newIndex !== oldIndex) {
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
    const taskGroup = tasks[newOrder[0]].completed ? 'completed' : 'active';
    db.collection('meta')
      .doc(ORDER_DOC)
      .update({ ['order.' + taskGroup]: newOrder })
      .catch(error => {
        console.error('Failed to set new task order.', error);
      });
  }

  return (
    <SortableTaskList
      tasks={tasks}
      order={localOrder}
      lockAxis="y"
      pressDelay={200}
      lockToContainerEdges={true}
      lockOffset={0}
      helperContainer={() => thisEl.current}
      onSortEnd={handleSortEnd}
    />
  );
}
