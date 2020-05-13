import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import * as yup from 'https://cdn.pika.dev/yup';
const env = config();

interface Dinosaur {
  id: string;
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

router.post('/dino', async (ctx) => {
  try {
    const body = await ctx.request.body();
    if (body.type !== 'json') throw new Error('Invlaid Body');
    const dino = (await dinoSchema.validate(body.value)) as Dinosaur;
    dino.id = v4.generate();
    DB.set(dino.id, dino);
    ctx.response.body = dino;
  } catch (error) {
    ctx.response.status = 422;
    ctx.response.body = { message: error.message };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server listening on http://localhost:${env.PORT}`);

await app.listen({ port: Number(env.PORT) });
