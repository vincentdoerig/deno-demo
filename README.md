# Deno Demo

> A simple REST api with an in-memory database created with [Deno](https://deno.land).

## Installation

To run this programm, you will need Deno. Look at the [installation](https://deno.land/#installation) for more info.

## Run

```bash
deno run --allow-net --allow-env --allow-read index.ts
```

## Run tests

```bash
deno test --allow-net
```

## Routes

| Route              | Description                 |
| ------------------ | --------------------------- |
| `GET /`            | Respond with `Hello World!` |
| `GET /dinos`       | List all dinosaurs          |
| `GET /dino/:id`    | List dinosaur by id         |
| `POST /dino`       | Create a new dinosaur       |
| `PATCH /dino/:id`  | Update dinosaur by id       |
| `DELETE /dino/:id` | Delete dinosaur by id       |

## Resources

- [Oak middleware framework](https://oakserver.github.io/oak/)
- [Yup object schema validation](https://github.com/jquense/yup)
- Testing
  - [Deno Standard Testing Library](https://deno.land/std/testing)

## Contributing

Feedback and PRs are welcome! Just make sure to run `deno fmt` before committing to format all files.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
