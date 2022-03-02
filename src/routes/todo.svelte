<script>
  import { onMount } from 'svelte';
  import api from '$lib/frontend/api';

  const fetchingTodos = api('todos').get();
  let newTodo = '';
  let todos = [];

  $: pending = todos.filter((t) => !t.done);
  $: done = todos.filter((t) => t.done);

  onMount(async () => (todos = await fetchingTodos));

  async function addTodo() {
    const content = newTodo.trim();
    if (!content) return;

    const todo = await api('todos').post({ content });
    todos = todos.concat(todo);
    newTodo = '';
  }

  async function toggleTodo(todo) {
    await api('todos').patch(todo.id, { done: !todo.done });
    todo.done = !todo.done;
    todos = todos;
  }

  async function deleteTodo(todo) {
    await api('todos').delete(todo.id);
    todos = todos.filter((t) => t.id !== todo.id);
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
  {#if pending.length}
    <ul>
      {#each pending as todo (todo.id)}
        <li>
          <button on:click={toggleTodo(todo)}>☐</button>
          {todo.content}
        </li>
      {/each}
    </ul>
  {:else}
    <p>You're all done!</p>
  {/if}
  <ul>
    {#each done as todo (todo.id)}
      <li style:color="gray">
        <button on:click={toggleTodo(todo)}>☒</button>
        {todo.content}
        <button on:click={deleteTodo(todo)}>X</button>
      </li>
    {/each}
  </ul>
{:catch}
  <p>Sorry. We couldn't fetch your todo list :(</p>
{/await}

<style>
  ul {
    padding: 0;
    list-style-type: none;
    font-size: 20px;
  }
  button {
    border: none;
    background: none;
    font-size: inherit;
    color: inherit;
  }
</style>
