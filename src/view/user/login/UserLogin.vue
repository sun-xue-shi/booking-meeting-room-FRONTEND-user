<template>
  <div class="login-container">
    <h1>会议室预定系统</h1>
    <Tabs v-model:active-key="activeKey" type="card" centered :tabBarGutter="60"
      >nowrap
      <TabPane key="1" tab=" 密 码 登 录 ">
        <PasswordLogin ref="passRef" />
      </TabPane>

      <TabPane key="2" tab=" 邮 箱 登 录 ">
        <EmailLogin ref="emailRef" />
      </TabPane>
    </Tabs>

    <FormItem :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
      <div class="link">
        <RouterLink to="/register">注册账号</RouterLink>
        <RouterLink to="/update_password" v-if="activeKey === '1'">
          忘记密码
        </RouterLink>
      </div>
    </FormItem>

    <FormItem :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
      <Button class="btn" type="primary" @click="onSubmit" html-type="submit">
        登录
      </Button>
    </FormItem>
  </div>
</template>

<script setup lang="ts">
import { Button, FormItem, TabPane, Tabs } from "ant-design-vue";
import PasswordLogin from "./PasswordLogin.vue";
import EmailLogin from "./EmailLogin.vue";
import { ref } from "vue";

const passRef = ref<InstanceType<typeof PasswordLogin>>();
const emailRef = ref<InstanceType<typeof EmailLogin>>();
const activeKey = ref("1");

const onSubmit = () => {
  if (activeKey.value === "1") {
    passRef.value?.passLoginBtn();
  } else {
    emailRef.value?.emailLoginBtn();
  }
};
</script>

<style scoped lang="less">
.login-container {
  width: 400px;
  margin: 200px auto 0 auto;
  text-align: center;
  font-size: 15px;
  color: rgb(5, 35, 84);
  border: 5px solid rgb(127, 190, 137);
  border-radius: 5%;

  .link {
    display: flex;
    justify-content: space-between;
    margin: 0 25px;
  }

  .tabs {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .btn {
    width: 90%;
  }
}
</style>
