import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  //路径别名
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  css: {
    preprocessorOptions: {
      scss: {
        //scss全局数据
        additionalData: `@import "./src/assets/css/util.scss";`,
      },
    },
  },
});

// export default {
//   plugins: [vue()],
//   resolve:{   //路径别名
//     alias:[{find:"@",replacement:"/src"}]
//   },
//   css:{
//     preprocessorOptions:{
//       scss:{  //scss全局数据
//         additionalData:`@import "./src/index.scss";`
//       }
//     }
//   }
// }
