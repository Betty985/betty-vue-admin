## 实现

- [ ] 动态路由
- [ ] 登录
- [ ] 权限指令
- [ ] 自动化
- [ ] 组件库
- [ ] 主题切换
- [ ] 布局

# 记录

```html
<div id="event-handling">
    {{ message }}
    <ul class="tab">
      <li>
        <router-link to="/home">首页</router-link>
      </li>
      <li>
        <router-link to="{ path: '/test' }">test</router-link>
      </li>
      <li>
        <router-link to="/login">login</router-link>
      </li>
      <li>
        <a
          href="#"
          @click="
            () => {
              this.$router.back();
            }
          "
          >点击回退</a
        >
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
const EventHandling = {
  data() {
    return {
      message: "我是home",
    };
  },
  methods: {
    404() {
      this.message = this.message.split("").reverse().join("");
    },
  },
};

Vue.createApp(EventHandling).mount("#event-handling");
export default {};
</script>
```

# css

## 一列定宽一列自适应

- position+margin

## BFC

作用：清除浮动、包裹浮动、避免边距塌陷
成为 BFC 的方式：

- html 根元素
- 设置 float 的元素
- 绝对定位的元素：position：absolute
- display：line-block
- display:table-\*
- overflow 除 visible 和 clip 以外的
- 设置 contain:(layout|content|paint)
- flex 和 gird 的子元素
- 多列布局设置了 colume-count 的元素或 column-span：all 的元素

# vue

## 生命周期函数：在**某个时刻** **自动执行**的函数

# 数据可视化

- opengl、skia
- webgl、canvas、svg
- echarts、highcharts、d3js、g2、l7

# js

## 全屏与退出全屏

```js
// 全屏
document.documentElement.requestFullscreen();
// 退出全屏
document.exitFullscreen();
```

# 组件

- 把库全部导入放在全局
- 按需导入
- 分析源码(如该位置的内容类型)
