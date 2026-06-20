import { http, HttpResponse } from 'msw';

const BASE = 'http://localhost:3333/sgla-api';

export const handlers = [
  http.post(`${BASE}/login`, () =>
    HttpResponse.json({ accessToken: 'mock-access-token' }),
  ),
  http.post(`${BASE}/logout`, () => new HttpResponse(null, { status: 204 })),
  http.get(`${BASE}/refresh`, () =>
    HttpResponse.json({ accessToken: 'mock-access-token' }),
  ),

  http.get(`${BASE}/users`, () => HttpResponse.json([])),
  http.get(`${BASE}/users/:id`, ({ params }) =>
    HttpResponse.json({
      _id: params.id,
      name: 'Test User',
      email: 'test@test.com',
    }),
  ),

  http.get(`${BASE}/academic-leagues`, () => HttpResponse.json([])),
  http.get(`${BASE}/events`, () => HttpResponse.json([])),
  http.get(`${BASE}/tasks`, () => HttpResponse.json([])),
  http.get(`${BASE}/universities`, () => HttpResponse.json([])),
  http.get(`${BASE}/permissions`, () => HttpResponse.json([])),
  http.get(`${BASE}/permissions/roles`, () => HttpResponse.json([])),
  http.get(`${BASE}/squads`, () => HttpResponse.json([])),
  http.get(`${BASE}/league-memberships`, () => HttpResponse.json([])),
  http.get(`${BASE}/certificates`, () => HttpResponse.json([])),
  http.get(`${BASE}/attendances`, () => HttpResponse.json([])),
];
