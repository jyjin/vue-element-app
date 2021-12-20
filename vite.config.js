import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  "presets": ["@vue/app"],
  plugins: [
    vue(),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    [
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ],
  module: {
    rules: [
      // 普通的 `.scss` 文件和 `*.vue` 文件中的
      // `<style lang="scss">` 块都应用它
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          // 'sass-loader',
          {
            loader: 'sass-loader',
            options: {
              // 你也可以从一个文件读取，例如 `variables.scss`
              // 如果 sass-loader 版本 = 8，这里使用 `prependData` 字段
              // 如果 sass-loader 版本 < 8，这里使用 `data` 字段
              additionalData: `$color: red;`,
              indentedSyntax: true,
              // sass-loader version >= 8
              sassOptions: {
                indentedSyntax: true
              }
            }
          }
        ]
      },
      // less
      // `<style lang="less">` 块都应用它
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  server: {
    port: 3000,
  }
})
