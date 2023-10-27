<template>
  <div class="container">
    <div class="header">
      <h1>会议室预定系统</h1>
      <UserOutlined class="icon" @click="$router.push('/update')" />
    </div>
    <div class="body">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
</script>

<style scoped lang="less">
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    line-height: 80px;
    border-bottom: 1px solid #aaa;
    padding: 0 20px;
    color: rgb(37, 42, 40);

    h1 {
      margin: 0;
      padding: 0;
    }

    .icon {
      font-size: 40px;
      margin-top: 20px;
    }
  }
}
</style>
