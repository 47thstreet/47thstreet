import index from "./index.html";
import article from "./article.html";

Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/article": article,
    "/article/the-last-master-cutter": article,
  },
  fetch(req) {
    return new Response(Bun.file("./404.html"), {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("47thstreet magazine → http://localhost:3000");
