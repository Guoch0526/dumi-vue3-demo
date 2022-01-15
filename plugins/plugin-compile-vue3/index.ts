import { IApi } from '@umijs/types';
import path from 'path';
const rollup = require('rollup');
import vuePlugin from 'rollup-plugin-vue';

/**
 * 编译 .vue 为 可执行的.js
 * input: 入口文件路径
 * file: 编译后产物路径
 */
const compilePreviewr = (input: string, file: string) => {
  rollup
    .rollup({
      input,
      plugins: [vuePlugin()],
      external: ['vue'],
    })
    .then((bundle: any) => {
      bundle.generate({ format: 'es' }).then(() => {
        bundle
          .write({
            file,
          })
          .then(() => {
            bundle.close();
          });
      });
    });
};

export default (api: IApi) => {
  api.register({
    key: 'dumi.registerCompiletime',
    fn: () => {
      return {
        name: 'test',
        component: path.join(__dirname, 'previewer.tsx'),
        transformer: ({
          attrs, // code 标签的属性
          mdAbsPath, // 当前 Markdown 文件的路径
          node, // 语法树节点
        }: {
          attrs: any;
          mdAbsPath: any;
          node: any;
        }) => {
          const { source } = node.properties; // 组件源码

          /**
           * srcVueRltPath: 组件源码.vue的相对路径
           * 由组件对应index.md文件路径转换而来
           * Foo/index.vue
           */
          const srcVueRltPath = path
            .relative(api.paths.absSrcPath, mdAbsPath)
            .replace(/\.md$/, '.vue');
          /**
           * tmpVuePath: api.writeTmpFile 需要传入的相对路径
           * dumi/vue/Foo/index.vue
           */
          const tmpVuePath = path.join('dumi', 'vue', srcVueRltPath);
          /**
           * api.writeTmpFile
           * 将组件中index.md中渲染的模版内容以.vue格式输出文件
           * 后面rollup需要把.vue编译成.js
           */
          api.writeTmpFile({
            path: tmpVuePath,
            content: source,
          });
          /**
           * srcVueAbsPath: 组件源码.vue的绝对路径
           * ···/src/.umi/dumi/vue/Too/index.vue
           */
          const srcVueAbsPath = path.join(api.paths.absTmpPath, tmpVuePath);
          /**
           * srcVueCompileAbsPath: 组件源码.vue编译后的的绝对路径
           * ···/src/.umi/dumi/vue/Too/index.js
           */
          const srcVueCompileAbsPath = srcVueAbsPath.replace(/\.vue$/, '.js');

          compilePreviewr(srcVueAbsPath, srcVueCompileAbsPath);

          return {
            rendererProps: {
              path: srcVueRltPath,
            },
            previewerProps: {
              sources: { _: { path: srcVueAbsPath } },
              dependencies: {},
            },
          };
        },
      };
    },
  });
  api.chainWebpack((config) => {
    config.resolve.alias.set('vue', 'vue/dist/vue.esm-bundler.js');

    // https://link.vuejs.org/feature-flags
    config.plugin('define').tap((args) => {
      args[0] = {
        ...args[0],
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
      };
      return args;
    });

    return config;
  });
};
