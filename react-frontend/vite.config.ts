import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

console.log(__dirname);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            src: path.resolve(__dirname, "src"),
            "@gameserver": path.resolve(__dirname, "../gameserver/")
        }
    }
});
