import { config } from "https://deno.land/x/dotenv/mod.ts";
import { bgGreen, black } from "https://deno.land/std/fmt/colors.ts";
import app from "./app.ts";

const env = config();

const port: number = Number(env.PORT) | 5050;

console.log(bgGreen(black(`Server listening on http://localhost:${port}`)));

await app.listen({ port });
