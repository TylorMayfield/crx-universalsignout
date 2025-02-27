import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import { resolve } from "path";
import fs from "fs";

// Custom plugin to copy background.js to the root of the dist folder
const copyBackgroundScript = () => ({
  name: 'copy-background-script',
  closeBundle: () => {
    // Find the generated background script file
    const files = fs.readdirSync(resolve(__dirname, 'dist/assets'));
    const backgroundFile = files.find(file => file.startsWith('background.js-'));
    
    if (backgroundFile) {
      // Read the content of the generated file
      const content = fs.readFileSync(resolve(__dirname, 'dist/assets', backgroundFile), 'utf-8');
      
      // Write it to the root of the dist directory as background.js
      fs.writeFileSync(resolve(__dirname, 'dist/background.js'), content);
      console.log('Successfully copied background.js to dist root');
    }
  }
});

export default defineConfig({
  plugins: [
    react(), 
    crx({ manifest }),
    copyBackgroundScript()
  ],
  build: {
    emptyOutDir: true,
    outDir: "dist",
    modulePreload: false,
    sourcemap: true,
    minify: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
