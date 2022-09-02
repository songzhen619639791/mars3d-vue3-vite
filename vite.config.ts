import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import mars3dCesium from "vite-plugin-mars3d"
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 9530
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@mars": path.join(__dirname, "src")
        },
        extensions: [".js", ".ts", ".jsx", ".tsx", ".json"]
    },
    plugins: [
        vue(),
        mars3dCesium(),
    ],
});
