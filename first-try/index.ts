// server.js
import { serve } from "bun";
import { join } from "path";

const server = serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);

    // Serve the index.html file for the root route
    if (url.pathname === "/") {
      return new Response(Bun.file(join(import.meta.dir, "public/index.html")));
    }

    // Serve the main.js file
    if (url.pathname === "/main.js") {
      return new Response(Bun.file(join(import.meta.dir, "client/main.js")));
    }

    // Serve static files from the public directory
    const filePath = join(import.meta.dir, "public", url.pathname);
      return new Response(Bun.file(filePath));
    }

    // Serve static files from the client directory
    const clientFilePath = join(import.meta.dir, "client", url.pathname);
    if (Bun.file(clientFilePath).exists()) {
      return new Response(Bun.file(clientFilePath));
    }

    // Return 404 for unknown routes
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`bun Server is running on http://localhost:${server.port}`);
