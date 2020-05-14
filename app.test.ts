import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts';
const { test } = Deno;
import app from './app.ts';

(async () => {
  await app.listen({ port: 1234 });
})();

const URL_BASE: string = 'http://localhost:1234';

interface Dinosaur {
  id?: string;
  name: string;
  image: string;
}

const dino1: Dinosaur = { name: 'Deno', image: 'https://deno.land/logo.svg' };
const dino2: Dinosaur = {
  name: 'Sauroposeidon',
  image: 'https://i.imgur.com/lKe6EHm.jpg',
};

const hasKeySetTo = (obj: any, key: string, value: any) => {
  return obj.hasOwnProperty(key) && obj[key] == value;
};

test('GET /', async () => {
  const response = await fetch(URL_BASE);
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(body, { message: 'Hello World!' });
});

test("POST /dino, 'Deno'", async () => {
  const response = await fetch(`${URL_BASE}/dino`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dino1),
  });
  const body = await response.json();
  dino1.id = body.id;
  assertEquals(response.status, 200);
  assert(hasKeySetTo(body, 'image', dino1.image));
  assert(hasKeySetTo(body, 'name', dino1.name));
});

test("POST /dino, , 'Sauroposeidon'", async () => {
  const response = await fetch(`${URL_BASE}/dino`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dino2),
  });
  const body = await response.json();
  dino2.id = body.id;
  assertEquals(response.status, 200);
  assert(hasKeySetTo(body, 'image', dino2.image));
  assert(hasKeySetTo(body, 'name', dino2.name));
});

test('GET /dino', async () => {
  const response = await fetch(`${URL_BASE}/dino`);
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(body.length, 2);
});

test('GET /dino/:id, "Deno"', async () => {
  const response = await fetch(`${URL_BASE}/dino/${dino1.id}`);
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(typeof body, 'object');
  assert(hasKeySetTo(body, 'image', dino1.image));
  assert(hasKeySetTo(body, 'name', dino1.name));
});

test("PATCH /dino/:id, , 'Deno'", async () => {
  const newBody = {
    name: 'Deno the dinosaur',
  };
  const response = await fetch(`${URL_BASE}/dino/${dino1.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBody),
  });
  const body = await response.json();
  assertEquals(response.status, 200);
  assert(hasKeySetTo(body, 'name', body.name));
});

test("DELETE /dino/:id, , 'Sauroposeidon'", async () => {
  const response = await fetch(`${URL_BASE}/dino/${dino2.id}`, {
    method: 'DELETE',
  });
  const body = await response.text();
  assertEquals(response.status, 204);
});

test('GET /dino', async () => {
  const response = await fetch(`${URL_BASE}/dino`);
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(body.length, 1);
});
