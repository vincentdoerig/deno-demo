import { config } from "https://deno.land/x/dotenv/mod.ts";
import app from "./app.ts";

const env = config();

console.log(`Server listening on http://localhost:${env.PORT}`);

await app.listen({ port: Number(env.PORT) });
