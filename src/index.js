const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3003;
const host = "127.0.0.1";

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const searchParams = reqUrl.searchParams;

  const hello = searchParams.get("hello");
  const users = searchParams.has("users");

  // Обработка запроса `?hello=<name>`
  if (hello !== null) {
    if (hello.trim() !== "") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Hello, ${hello}.`);
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Enter a name");
    }
    return;
  }

  if (users) {
    const filePath = path.join(__dirname, "data", "users.json");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
      }
    });
    return;
  }

  if ([...searchParams.keys()].length === 0) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, World!");
    return;
  }

  res.writeHead(500, { "Content-Type": "text/plain" });
  res.end();
});

server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

// Написать обработчик запроса:
// - Ответом на запрос `?hello=<name>` должна быть **строка** "Hello, <name>.", код ответа 200
// - Если параметр `hello` указан, но не передано `<name>`, то ответ **строка** "Enter a name", код ответа 400
// - Ответом на запрос `?users` должен быть **JSON** с содержимым файла `data/users.json`, код ответа 200
// - Если никакие параметры не переданы, то ответ **строка** "Hello, World!", код ответа 200
// - Если переданы какие-либо другие параметры, то пустой ответ, код ответа 500
