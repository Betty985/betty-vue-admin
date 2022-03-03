import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};
const alias = {
  "@": pathResolve("src"),
  "@a": pathResolve("src/assets"),
  "@c": pathResolve("src/components"),
  "@u": pathResolve("src/utils"),
  "@v": pathResolve("src/views"),
};
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias,
  },
  server: {
    port: 4399,
    //把mock设置为false,然后设置代理，进行数据联调
    proxy: {
      // 服务器端的接口
      "/api": {
        target: "http://localhost:3000/",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

//http://localhost:3000/api/xxx/
