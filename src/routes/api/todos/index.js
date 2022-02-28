import db from '$lib/backend/database';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
  const todos = db.todos.list();
  return {
    status: 200,
    body: todos,
  };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
  const { content } = await request.json();
  if (!content) {
    return {
      status: 400,
      body: { error: 'Todo content missing' },
    };
  }

  const todo = db.todos.create({ content });
  return {
    status: 201,
    body: todo,
  };
}
