// Local test transport only: executes the real Lua scripts against a local Redis.
// It never contacts Upstash, reads production credentials or flushes a database.
import http from "node:http";
import net from "node:net";
const redisPort = Number(process.env.CMS_TEST_REDIS_PORT || 16479);
const httpPort = Number(process.env.CMS_TEST_REST_PORT || 16480);
function command(args) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: "127.0.0.1", port: redisPort });
    let bytes = Buffer.alloc(0);
    socket.setTimeout(5000, () =>
      socket.destroy(new Error("Local Redis timed out")),
    );
    socket.on("error", reject);
    socket.on("connect", () => {
      const parts = [Buffer.from(`*${args.length}\r\n`)];
      for (const arg of args) {
        const value = Buffer.from(String(arg));
        parts.push(
          Buffer.from(`$${value.length}\r\n`),
          value,
          Buffer.from("\r\n"),
        );
      }
      socket.write(Buffer.concat(parts));
    });
    socket.on("data", (chunk) => {
      bytes = Buffer.concat([bytes, chunk]);
      const end = bytes.indexOf("\r\n");
      if (end < 0) return;
      const type = String.fromCharCode(bytes[0]),
        line = bytes.subarray(1, end).toString();
      if (
        type === "$" &&
        Number(line) >= 0 &&
        bytes.length < end + 2 + Number(line) + 2
      )
        return;
      socket.end();
      if (type === "-") {
        reject(new Error(line));
        return;
      }
      if (type === "+") resolve(line);
      else if (type === ":") resolve(Number(line));
      else if (type === "$")
        resolve(
          Number(line) === -1
            ? null
            : bytes.subarray(end + 2, end + 2 + Number(line)).toString(),
        );
      else reject(new Error("Unexpected local Redis response"));
    });
  });
}
http
  .createServer(async (request, response) => {
    if (request.url === "/health") {
      try {
        await command(["PING"]);
        response.end("ready");
      } catch {
        response.writeHead(503);
        response.end("Local Redis is unavailable");
      }
      return;
    }
    if (
      request.method !== "POST" ||
      request.headers.authorization !== "Bearer local-redis-test-token"
    ) {
      response.writeHead(401);
      response.end();
      return;
    }
    try {
      let input = "";
      for await (const chunk of request) {
        input += chunk;
        if (input.length > 10 * 1024 * 1024)
          throw new Error("Test request is too large");
      }
      const args = JSON.parse(input);
      if (
        !Array.isArray(args) ||
        !["GET", "SET", "DEL", "EVAL", "TTL"].includes(args[0])
      )
        throw new Error("Unsupported test command");
      const result = await command(args);
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ result }));
    } catch {
      response.writeHead(503);
      response.end(
        JSON.stringify({ error: "Local Redis test command failed" }),
      );
    }
  })
  .listen(httpPort, "127.0.0.1", () =>
    console.log(`Local Redis test adapter: http://127.0.0.1:${httpPort}`),
  );
