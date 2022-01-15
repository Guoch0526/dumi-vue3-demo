## Too

Demo:

```vue ｜ preview
<template>
  <div>demo: {{ number }}</div>
  <too title="i am too"></too>
</template>

<script>
import { ref } from 'vue';
export default {
  components: {},
  setup(props) {
    const number = ref(2);
    // 暴露给 template
    return {
      number,
    };
  },
};
</script>
```

More skills for writing demo: https://d.umijs.org/guide/basic#write-component-demo
