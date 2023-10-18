<template>
  <div class="register-container">
    <h1>会议室预定系统</h1>
    <Form
      :model="registerUser"
      @finish="registerBtn"
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
          v-model:value="registerUser.username"
        />
      </FormItem>

      <FormItem
        label="昵称"
        name="nickName"
        :rules="{ required: true, message: '请输入你的昵称' }"
      >
        <Input
          placeholder="请输入昵称"
          :maxlength="20"
          v-model:value="registerUser.nickName"
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
          v-model:value="registerUser.password"
        />
      </FormItem>

      <FormItem
        label="确认密码"
        name="confirmPassword"
        :rules="{
          required: true,
          message: '请确认密码',
          max: 12,
          min: 6,
        }"
      >
        <InputPassword
          placeholder="请确认密码"
          :maxlength="12"
          v-model:value="registerUser.confirmPassword"
        />
      </FormItem>

      <FormItem
        label="邮箱"
        name="email"
        :rules="{ required: true, message: '请输入你的qq邮箱', type: 'email' }"
      >
        <Input
          placeholder="请输入qq邮箱"
          :maxlength="20"
          v-model:value="registerUser.email"
        />
      </FormItem>

      <FormItem
        label="验证码"
        name="captcha"
        :rules="{ required: true, length: 6 }"
      >
        <div class="captcha">
          <Input
            placeholder="请输入验证码"
            :maxlength="6"
            v-model:value="registerUser.captcha"
          />
        </div>
        <Button
          type="primary"
          @click="sendCaptcha"
          class="btn"
          :disabled="isSend"
        >
          发送验证码
        </Button>
      </FormItem>

      <FormItem :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <div class="link">
          <a href="/login">已有账号?去登录</a>
        </div>
      </FormItem>

      <FormItem :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <Button class="register" type="primary" html-type="submit">
          注册
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import {
  Button,
  FormItem,
  Form,
  Input,
  InputPassword,
  message,
} from "ant-design-vue";
import { ref } from "vue";
import { registerCaptcha } from "@/service/user/email/captcha";
import { register } from "@/service/user/register/register";
import { useRouter } from "vue-router";

export interface RegisterUser {
  username: string;
  nickName: string;
  password: string;
  confirmPassword?: string;
  email: string;
  captcha: string;
}

const registerUser = ref<RegisterUser>({
  password: "",
  username: "",
  nickName: "",
  confirmPassword: "",
  email: "",
  captcha: "",
});

let isSend = ref(false);

const router = useRouter();
async function registerBtn(values: RegisterUser) {
  if (registerUser.value.confirmPassword !== registerUser.value.password) {
    return message.error("两次密码不一致");
  } else {
    const res = await register(values);
    const { data } = res.data;
    if (res.status === 200 || res.status === 201) {
      message.success("注册成功,为您跳转登录");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      message.error(data || "系统繁忙,请稍后再试");
    }
  }
}

async function sendCaptcha() {
  if (!registerUser.value.email) {
    return message.warn("请填写邮箱地址!");
  } else {
    const res = await registerCaptcha(registerUser.value.email);
    const { data } = res.data;
    if (res.status === 200 || res.status === 201) {
      message.success("验证码发送成功,30s后可以再次发送");
      isSend.value = true;
      setTimeout(() => {
        isSend.value = false;
      }, 1000 * 30);
    } else {
      message.error(data || "系统繁忙,请稍后再试");
    }
  }
}
</script>

<style scoped lang="less">
.register-container {
  width: 400px;
  text-align: center;
  margin: 100px auto 0 auto;

  .register {
    width: 90%;
  }

  .link {
    display: flex;
    justify-content: flex-end;
    margin: 0 30px;
  }

  .captcha {
    margin-right: 110px;
  }
  .btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 35%;
  }
}
</style>
