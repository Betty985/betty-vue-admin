<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { toRefs } from "vue";

let props = defineProps({
  userMenu: {
    type: Array,
    default() {
      return [];
    },
  },
});
let userMenu = reactive({
  id: 9,
  a: 1,
  tableData: [
    {
      _id: "1",
      icon: "",
      menuName: "123",
      children: [],
    },
  ],
});

const { id, a, tableData } = toRefs(userMenu);
</script>

<template>
  <!-- 
     1.admin
     2.js基础
     3.es6
     4.疯狂背题【pdf】【css、vue、http、js、es6】
      -->
  <div>
    <!-- 根元素只能有一个，v-for是循环,返回更多的元素，所以v-for放在根元素上Vue会不知道怎么渲染。 -->
    <template v-for="menu in tableData">
      <el-sub-menu
        v-if="
          menu.children &&
          menu.children.length > 0 &&
          menu.children[0].menuType == 1
        "
        :key="menu._id"
        :index="menu.path"
      >
        <template #title>
          <i :class="menu.icon"></i>
          <span>{{ menu.menuName }}</span>
        </template>
        <tree-menu :userMenu="menu.children"></tree-menu>
      </el-sub-menu>
      <!--  menu.menuType等于2是按钮-->
      <el-menu-item
        v-else-if="menu.menuType === 1"
        :index="menu.path"
        :key="menu._id"
      >
        {{ menu.menuName }}</el-menu-item
      >
    </template>
  </div>
</template>

<style scoped></style>
