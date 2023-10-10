const server = Bun.serve({
  port: 8080,
  fetch(req) {
    return new Response("Bun");
  },
});

console.log(`Listening on ${server.hostname}: ${server.port}...`);
