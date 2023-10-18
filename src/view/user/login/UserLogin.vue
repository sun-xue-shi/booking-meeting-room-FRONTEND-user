<template>
  <div class="login-container">
    <h1>会议室预定系统</h1>
    <Form
      :model="loginUser"
      @finish="loginBtn"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 17 }"
      :colon="false"
    >
      <FormItem
        label="用户名"
        name="username"
        :rules="{ required: true, message: '请输入用户名' }"
      >
        <Input
          placeholder="请输入用户名"
          :maxlength="20"
          v-model:value="loginUser.username"
        />
      </FormItem>

      <FormItem
        label="密码"
        name="password"
        :rules="{
          required: true,
          message: '请输入6-12位密码',
          max: 12,
          min: 6,
        }"
      >
        <InputPassword
          placeholder="请输入6~12位密码"
          :maxlength="12"
          v-model:value="loginUser.password"
        />
      </FormItem>

      <FormItem :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <div class="link">
          <RouterLink to="/register">创建账号</RouterLink>
          <RouterLink to="/update_password">忘记密码</RouterLink>
        </div>
      </FormItem>

      <FormItem :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <Button class="btn" type="primary" html-type="submit"> 登录 </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import {
  Form,
  FormItem,
  Input,
  InputPassword,
  Button,
  message,
} from "ant-design-vue";
import { login } from "@/service/user/login/login";
import { ref } from "vue";

interface LoginUser {
  username: string;
  password: string;
  remember: boolean;
}

const loginUser = ref<LoginUser>({
  username: "",
  password: "",
  remember: true,
});

// 登录逻辑
async function loginBtn(values: LoginUser) {
  const res = await login(values.username, values.password);
  const { code, data } = res.data;
  if (code === 201 || code === 200) {
    message.success("登录成功");

    // 保存信息
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("user_info", JSON.stringify(data.userInfo));
  } else {
    message.error(data || "系统繁忙,请稍后再试");
  }
}
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

  .btn {
    width: 90%;
  }
}
</style>
