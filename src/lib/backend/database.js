const todos = [];

const database = {
  todos: {
    list: () => todos,
    create: (data) => {
      const newTodo = {
        ...data,
        id: String(todos.length),
      };
      todos.push(newTodo);
      return newTodo;
    },
    delete: (id) => {
      const index = todos.findIndex((t) => t.id === id);
      if (index === -1) return null;

      return todos.splice(index, 1)[0];
    },
  },
};

export default database;
