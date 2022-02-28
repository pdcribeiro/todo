import db from '$lib/backend/database';

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
