/* Wraps app.html (an artifact fragment) into a standalone index.html
   you can open straight from the filesystem:  node build-local.mjs  */
import { readFileSync, writeFileSync } from "node:fs";

const body = readFileSync("app.html", "utf8");
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root { color-scheme: light dark }
  body { margin: 0; font: 14px/1.5 system-ui, sans-serif }
  img { max-width: 100% }
  [hidden] { display: none !important }
</style>
</head>
<body>
${body}
</body>
</html>
`;
writeFileSync("index.html", page);
console.log("wrote index.html — open it in a browser");
