import React, { useRef, useEffect } from 'react';
import { createApp } from 'vue';
import * as components from '/src';

const ROOT_COMPONENT_NAME = 'app';
const RootComponent = (name: string) => <div id={name}></div>;

export default (props: { path: string }) => {
  // 挂载的 vue 实例
  const vueInstance = useRef<any>();

  const init = () => {
    const srcVueModuleName = props.path.replace(/\.vue$/, '');
    const srvVue = require(`/src/.umi/dumi/vue/${srcVueModuleName}.js`).default;
    // 创建 vue 实例
    vueInstance.current = createApp(srvVue);

    // 注册组件
    Object.keys(components).forEach((key) => {
      const component = components[key];
      if (component.install) {
        vueInstance.current.use(component);
      }
    });

    // 实例挂载
    vueInstance.current.mount(`#${ROOT_COMPONENT_NAME}`);
  };
  useEffect(() => {
    init();
    return () => {
      // react 卸载时 vue 实例也卸载
      vueInstance.current.unmount?.();
    };
  }, []);
  return RootComponent(ROOT_COMPONENT_NAME);
};
