// Simple static file server using built‑in Node modules
// Serve files from the directory where this script resides
// Run with: node serve.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const ROOT = __dirname; // directory of script (E:\parroto)

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  // Default to index.html for root or empty path
  if (pathname === '/' || pathname === '') pathname = '/index.html';
  const safePath = path.normalize(path.join(ROOT, pathname));
  // Prevent path traversal attacks
  if (!safePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }
  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }
    if (stats.isDirectory()) {
      // If a directory is requested, try to serve index.html inside it
      const indexFile = path.join(safePath, 'index.html');
      fs.access(indexFile, fs.constants.R_OK, (e) => {
        if (e) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          return res.end('403 Forbidden');
        }
        serveFile(indexFile, res);
      });
    } else {
      serveFile(safePath, res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}/`);
});
