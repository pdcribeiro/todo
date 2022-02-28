<script>
  import { onMount } from 'svelte';
  import api from '$lib/frontend/api';

  const fetchingTodos = api('todos').get();
  let newTodo = '';
  let todos = [];

  onMount(async () => (todos = await fetchingTodos));

  async function addTodo() {
    const content = newTodo.trim();
    if (!content) return;

    const todo = await api('todos').post({ content });
    todos = todos.concat(todo);
    newTodo = '';
  }

  async function completeTodo(id) {
    await api('todos').delete(id);
    todos = todos.filter((t) => t.id !== id);
  }
</script>

<svelte:head>
  <title>TODO</title>
</svelte:head>

<a href="/">Back</a>

<h1>TODO</h1>

<form on:submit|preventDefault={addTodo}>
  <input type="text" bind:value={newTodo} />
</form>

{#await fetchingTodos}
  <p>We're fetching your todo list. Please wait a moment</p>
{:then}
  {#if todos.length}
    <ul>
      {#each todos as todo}
        <li on:click={completeTodo(todo.id)}>{todo.content}</li>
      {/each}
    </ul>
  {:else}
    <p>You're all done!</p>
  {/if}
{:catch}
  <p>Sorry. We couldn't fetch your todo list :(</p>
{/await}
