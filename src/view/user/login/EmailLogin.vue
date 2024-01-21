<script setup lang="ts">
import { Form, FormItem, Input, message, Button } from "ant-design-vue";
import { emailLogin } from "@/service/user/login/login";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginCaptcha } from "@/service/user/email/captcha";

let isLoading = ref(false);
let isSend = ref(false);

type EmailLogin = {
  username: string;
  email: string;

  captcha: string;
};

const emailLoginInfo = ref<EmailLogin>({
  username: "",
  email: "",
  captcha: "",
});

const router = useRouter();
// 登录逻辑
async function emailLoginBtn() {
  if (!emailLoginInfo.value.email) return;
  const res = await emailLogin(
    emailLoginInfo.value.username,
    emailLoginInfo.value.email,
    emailLoginInfo.value.captcha
  );

  const { data } = res.data;

  if (res.status === 201 || res.status === 200) {
    message.success("登录成功");
    // 保存信息
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("user_info", JSON.stringify(data.userInfo));
    setTimeout(() => {
      router.push("/menu/room_list");
    });
  } else {
    message.error(data || "系统繁忙,请稍后再试");
  }
}

async function sendCaptcha() {
  if (!emailLoginInfo.value.email) {
    return message.warn("请填写邮箱地址!");
  } else {
    isLoading.value = true;
    const res = await loginCaptcha(emailLoginInfo.value.email);

    const { data } = res.data;
    if (res.status === 200 || res.status === 201) {
      isLoading.value = false;
      message.success(data + ",30s后可以再次发送");
      isSend.value = true;
      setTimeout(() => {
        isSend.value = false;
      }, 1000 * 30);
    } else {
      message.error(data || "系统繁忙,请稍后再试");
    }
  }
}

defineExpose({
  emailLoginBtn,
});
</script>

<template>
  <div class="">
    <Form
      :model="emailLoginInfo"
      @finish="emailLoginBtn"
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
          v-model:value="emailLoginInfo.username"
        />
      </FormItem>

      <FormItem
        label="邮箱"
        name="email"
        :rules="{
          required: true,
          message: '请输入邮箱',
        }"
      >
        <Input placeholder="请输入邮箱" v-model:value="emailLoginInfo.email" />
      </FormItem>

      <FormItem
        label="验证码"
        name="captcha"
        :rules="{ required: true, length: 6, message: '6位验证码' }"
      >
        <div class="captcha">
          <Input
            placeholder="请输入验证码"
            :maxlength="6"
            v-model:value="emailLoginInfo.captcha"
          />
        </div>
        <Button
          type="primary"
          @click="sendCaptcha"
          class="btn"
          :disabled="isSend"
          :loading="isLoading"
        >
          发送
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<style scoped lang="less">
.captcha {
  margin-right: 110px;
}
.btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 35%;
}
</style>
