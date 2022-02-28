import db from '$lib/backend/database';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function patch({ params, request }) {
  const { done } = await request.json();
  if (typeof done !== 'boolean') {
    return {
      status: 400,
      body: { error: 'Valid todo state missing' },
    };
  }

  const todo = db.todos.update(params.id, { done });
  if (!todo) {
    return {
      status: 404,
    };
  }

  return {
    status: 200,
    todo,
  };
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function del({ params }) {
  const todo = db.todos.delete(params.id);
  if (!todo) {
    return {
      status: 404,
    };
  }

  return {
    status: 200,
    todo,
  };
}
