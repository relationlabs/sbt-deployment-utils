import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        'vue-router',
        'pinia',
        {
          '@/utils/utils': [
            // named imports
            'logErr', // import { logErr } from '@/utils/utils',
            'getProvider',
            'getUserWorldCupAddr',
            'saveUserWorldCupAddr'
          ]
        }
      ],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    // svg
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
      symbolId: 'icon-[dir]-[name]'
    }),
  ],
  resolve: {
    // https://cn.vitejs.dev/config/#resolve-alias
    alias: {
      '@': resolve(__dirname, './src')
    },
    // https://cn.vitejs.dev/config/#resolve-extensions
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  define: { 'process.env': {} },

  css: {
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  }
})
