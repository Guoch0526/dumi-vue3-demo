import { App, defineComponent, reactive, h } from 'vue';

const Too = defineComponent({
  name: 'too',
  props: ['title'],
  setup(props) {
    return () => h('div', [props.title]); // 渲染正常
    // return () => <div>{props.title}</div>; // 渲染异常
  },
});

Too.install = (app: App) => {
  app.component(Too.name, Too);
};

export default Too;
