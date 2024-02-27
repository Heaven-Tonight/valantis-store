const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({
  target: 'http://api.valantis.store:40000',
  changeOrigin: true,
}));

app.listen(3001, () => {
  console.log('Proxy server is running on port 3001');
});