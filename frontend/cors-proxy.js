/**
 * CORS Proxy Server for development use
 * 
 * This simple proxy server forwards requests to the OpenWebUI API server
 * and adds CORS headers to allow requests from the development frontend.
 * 
 * Usage:
 * 1. Install dependencies: npm install express cors http-proxy-middleware
 * 2. Run the proxy: node cors-proxy.js
 * 3. Update your frontend API config to use http://localhost:3080 instead of the OpenWebUI URL
 */

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3080;

// OpenWebUI API server URL
const API_URL = 'http://localhost:8000';

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
  next();
});

// Proxy all requests to the API server
app.use('/', createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  secure: false,
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers
    proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin || '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,PATCH,POST,DELETE';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
  }
}));

app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on http://localhost:${PORT}`);
  console.log(`Forwarding requests to ${API_URL}`);
});