# backend

Install bun

```
url -fsSL 'https://bun.sh/install' | bash
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

Install prisma

```
bun add prisma
```

Prisma

```
bunx prisma init
```

```
bunx prisma generate
```

```
bunx prisma migrate dev --name init
```

Run docker

```
docker-compose up -d
```

Check if docker is running

```
docker ps
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
