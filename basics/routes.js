const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>Enter Message</title> </head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button> </form></body>'
    );
    res.write("</html>");
    return res.end();
  } else if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      console.log("CHUNK : " + chunk);
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1];
      //   fs.writeFileSync("messages.txt", message);
      fs.writeFile("messages.txt", message, (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  } else {
    res.setHeader("Content-Type", "text/html");
    res.write("<h1>My Nodejs Server</h1>");
    res.end();
  }
};

//Option 1
module.exports = requestHandler;

//Option 2
// module.exports = {
//   handler: requestHandler,
// };

//Option 3
// module.exports.handler = requestHandler;

//Option 4 - short cut supported by Nodejs
// exports.handler = requestHandler;
