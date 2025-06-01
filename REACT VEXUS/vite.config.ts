import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5436,
    open: true,
    proxy: {
      '/api/hepatic': {
        target: 'https://gsiegel14--vexus-hepatic-endpoint-hepaticmodel-predict.modal.run',
        changeOrigin: true,
        rewrite: (path) => '/',
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Hepatic proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Hepatic proxy request:', req.method, req.url);
          });
        }
      },
      '/api/portal': {
        target: 'https://gsiegel14--vexus-renal-portal-endpoint-portalmodel-predict.modal.run',
        changeOrigin: true,
        rewrite: (path) => '/',
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Portal proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Portal proxy request:', req.method, req.url);
          });
        }
      },
      '/api/renal': {
        target: 'https://gsiegel14--vexus-renal-portal-endpoint-renalmodel-predict.modal.run',
        changeOrigin: true,
        rewrite: (path) => '/',
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Renal proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Renal proxy request:', req.method, req.url);
          });
        }
      },
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true
  }
});
