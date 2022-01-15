import { App, defineComponent, reactive } from 'vue';

const Foo = defineComponent({
  name: 'foo',
  props: ['title'],
  template: `<div>{{title}}</div>`, // 渲染正常
});

Foo.install = (app: App) => {
  app.component(Foo.name, Foo);
};

export default Foo;
