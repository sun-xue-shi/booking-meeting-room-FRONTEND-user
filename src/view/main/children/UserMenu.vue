<template>
  <div class="main-container">
    <div class="menu">
      <Menu
        :items="menuItems"
        :theme="state.theme"
        @click="handleMenuClick"
        :selected-keys="state.selectedKeys"
      >
      </Menu>
    </div>
    <div class="body">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UnorderedListOutlined } from "@ant-design/icons-vue";
import { Menu, type MenuProps, type MenuTheme } from "ant-design-vue";
import type {
  MenuClickEventHandler,
  MenuInfo,
} from "ant-design-vue/es/menu/src/interface";
import { h, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const routes = useRoute();

const state = reactive({
  theme: "light" as MenuTheme,
  selectedKeys: getSelectedKeys(),
});

const menuItems: MenuProps["items"] = [
  {
    key: "1",
    label: "会议室列表",
    icon: () => h(UnorderedListOutlined),
  },
];

const router = useRouter();
const handleMenuClick: MenuClickEventHandler = (info: MenuInfo) => {
  let path = "";
  switch (info.key) {
    case "1":
      path = "/menu/room_list";
      state.selectedKeys = ["1"];
      break;
  }
  router.push(path);
};

function getSelectedKeys() {
  if (routes.path === "/menu/room_list") {
    return ["1"];
  } else {
    return ["1"];
  }
}
</script>

<style scoped lang="less">
.main-container {
  display: flex;
  flex-direction: row;
  margin-top: 20px;

  .body {
    width: 100%;
  }
}
</style>
