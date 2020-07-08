const http = require("http");
const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Create User</title> </head>");
    res.write(
      '<body><form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Submit</button> </form></body>'
    );
    res.write("</html>");
    res.end();
  } else if (url === "/create-user" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log(username);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      res.end();
    });
  } else if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    // res.write("<html>");
    res.write("<ul><li>User 1</li><li>User 2</li></ul>");
    // res.write("</html>");
    res.end();
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>My Nodejs Server</h1>");
    res.end();
  }
};

const server = http.createServer(requestHandler);

server.listen(3000);
