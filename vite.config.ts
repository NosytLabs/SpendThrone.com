import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import viteCompression from 'vite-plugin-compression';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
    }),
    nodePolyfills({ 
      include: ['buffer', 'process', 'util', 'stream', 'events'],
      globals: {
        process: true,
        Buffer: true,
        global: true,
      },
    }),
    viteCompression(),
  ],
  resolve: {
    // Standardize absolute imports with the '@' alias pointing to project src
    alias: {
      '@': '/src',
      'vite-plugin-node-polyfills/shims/process': path.resolve(__dirname, 'node_modules/vite-plugin-node-polyfills/shims/process'),
    },
  },
  esbuild: {
    target: 'es2020',
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    // Optimize bundle splitting for better caching and performance
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "Module level directives cause errors when bundled" warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        // Suppress "use client" warnings
        if (warning.message.includes('use client')) {
          return;
        }
        // Suppress known third-party warnings
        if (warning.message.includes('contains an annotation that Rollup cannot interpret')) {
          return;
        }
        if (warning.message.includes('Use of eval')) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          // Separate vendor libraries for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'solana-vendor': [
            '@solana/web3.js',
            '@solana/wallet-adapter-react',
            '@solana/wallet-adapter-react-ui',
            '@solana/wallet-adapter-wallets',
            '@solana/wallet-adapter-base',
            '@solana/spl-token'
          ],
          
          'utils-vendor': ['date-fns', 'buffer']
        },
        // Optimize asset naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    // Enable source maps for better debugging in production
    sourcemap: true,
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable minification with better compression
    minify: 'esbuild',
    // Target modern browsers for better optimization
    target: 'es2020',
    // Disable CSS code splitting to avoid empty file warnings
    // cssCodeSplit: false,
    // Optimize asset inlining threshold
    assetsInlineLimit: 4096,
  },
  server: {
    port: 3001,
    host: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@solana/wallet-adapter-react-ui/styles.css";`
      }
    }
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@solana/web3.js',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-react-ui',
      '@solana/wallet-adapter-wallets',
      '@solana/wallet-adapter-base',
      'buffer',
      'lucide-react'
    ]
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  }
});
