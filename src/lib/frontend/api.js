import http from '$lib/http';

export default function api(resource) {
  const baseUrl = `/api/${resource}`;

  return {
    get: (id) => (id ? http.get(`${baseUrl}/${id}`) : http.get(baseUrl)),
    post: (data) => http.post(baseUrl, data),
    put: (id, data) => http.put(`${baseUrl}/${id}`, data),
    patch: (id, data) => http.patch(`${baseUrl}/${id}`, data),
    delete: (id) => http.delete(`${baseUrl}/${id}`),
  };
}
