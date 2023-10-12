# backend

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

Run docker
```
docker-compose up -d
```

Check if docker is running
```
docker ps
```

Initialize prisma
```
bunx prisma init
```

Generate tables with prisma, rerun when models are added or changed
```
bunx prisma migrate dev --name init
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
