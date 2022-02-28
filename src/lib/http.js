function get(url) {
  return fetch(url);
}

function post(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

function put(url, data) {
  return fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

function patch(url, data) {
  return fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

function del(url) {
  return fetch(url, {
    method: 'DELETE',
  });
}

function decorate(httpFunction) {
  return async (...params) => {
    const response = await httpFunction(...params);
    const data = await response.json();
    if (!response.ok) throw new HttpError({ status: response.status, data });

    return data;
  };
}

class HttpError extends Error {
  constructor({ message, status = 500, data }) {
    super(message ?? `HTTP Error ${status}`);
    this.status = status;
    if (data) this.data = data;
  }
}

const decoratedFunctions = {};
Object.entries({ get, post, put, patch, delete: del }).forEach(
  ([name, httpFunc]) => (decoratedFunctions[name] = decorate(httpFunc))
);

export default decoratedFunctions;
