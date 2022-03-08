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

## vh

动态计算属性，动态计算视窗的高度

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

## 导航守卫

导航守卫可以控制路由访问权限。

```js
// 声明"全局导航守卫"
// 参数为守卫方法，访问路由规则就会触发守卫方法
router.beforeEach((to, from, next) => {
  // to 目标路由对象
  // from 当前导航正要离开的路由对象
  // next 一个函数，表示放行。不声明next形参，默认允许用户访问每一个路由。
  // 声明形参，但是不调用next函数，不允许访问任何一个路由
});
```

next 函数的三种调用方法

- 直接放行
- 强制其停留在当前页面 next(false)
- 强制跳转到指定页面 next('/login')

### 常用 API

beforEach(),afterEach(),getRoutes()、push()、back()、addRoute()、

- hasRoute():判断路由是否存在

### 404

- [正则]https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html#%E6%8D%95%E8%8E%B7%E6%89%80%E6%9C%89%E8%B7%AF%E7%94%B1%E6%88%96-404-not-found-%E8%B7%AF%E7%94%B1)
- next('/404')s

## 动态路由

url 必须提取出来
地址必须添加.vue 后缀
不可以使用@/views

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

# 权限控制

动态指令
