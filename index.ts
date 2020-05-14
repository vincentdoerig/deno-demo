import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import * as yup from 'https://cdn.pika.dev/yup';
const env = config();

interface RequestError extends Error {
  status: number;
}

interface Dinosaur {
  id?: string;
  name: string;
  image: string;
}

const dinoSchema = yup.object().shape({
  name: yup.string().trim().min(2).required(),
  image: yup.string().url().required(),
});

const DB = new Map<string, Dinosaur>();

const app = new Application();
const router = new Router();

router.get('/', (ctx) => {
  ctx.response.body = { message: 'Hello World!' };
});

router.get('/dino', (ctx) => {
  ctx.response.body = [...DB.values()];
});

router.get('/dino/:id', (ctx) => {
  const { id } = ctx.params;
  if (id && DB.has(id)) {
    ctx.response.body = DB.get(id);
  } else {
    const error = new Error('No dino with that ID found.') as RequestError;
    error.status = 404;
    throw error;
  }
});

router.post('/dino', async (ctx) => {
  try {
    const body = await ctx.request.body();
    if (body.type !== 'json') throw new Error('Invlaid Body');
    const dino = (await dinoSchema.validate(body.value)) as Dinosaur;
    dino.id = v4.generate();
    DB.set(dino.id, dino);
    ctx.response.body = dino;
  } catch (error) {
    error.status = 422;
    throw error;
  }
});

router.patch('/dino/:id', async (ctx) => {
  const { id } = ctx.params;
  if (id && DB.has(id)) {
    try {
      const body = await ctx.request.body();
      if (body.type !== 'json') throw new Error('Invlaid Body');
      const currentData: Dinosaur = DB.get(id)!;
      if (!body.value.name) body.value.name = currentData.name;
      if (!body.value.image) body.value.image = currentData.image;
      const dino = (await dinoSchema.validate(body.value)) as Dinosaur;
      dino.id = id;
      DB.set(id, dino);
      ctx.response.body = dino;
    } catch (error) {
      error.status = 422;
      throw error;
    }
  } else {
    const error = new Error('No dino with that ID found.') as RequestError;
    error.status = 404;
    throw error;
  }
});

router.delete('/dino/:id', (ctx) => {
  const { id } = ctx.params;
  if (id && DB.has(id)) {
    DB.delete(id);
    ctx.response.status = 204;
    ctx.response.body = { message: 'Success' };
  } else {
    const error = new Error('Not Found') as RequestError;
    error.status = 404;
    throw error;
  }
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const error = err as RequestError;
    ctx.response.status = error.status || 500;
    ctx.response.body = {
      message: error.message,
    };
  }
});
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server listening on http://localhost:${env.PORT}`);

await app.listen({ port: Number(env.PORT) });
