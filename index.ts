import index from "./index.html";

Bun.serve({
  port: 3000,
  routes: {
    "/": index,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("47thstreet magazine → http://localhost:3000");
