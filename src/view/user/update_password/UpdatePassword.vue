<template>
  <div class="register-container">
    <h1>会议室预定系统</h1>
    <Form
      :model="updatePasswordInfo"
      @finish="updateBtn"
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
          v-model:value="updatePasswordInfo.username"
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
          v-model:value="updatePasswordInfo.password"
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
          v-model:value="updatePasswordInfo.confirmPassword"
        />
      </FormItem>

      <FormItem
        label="邮箱"
        name="email"
        :rules="{
          required: true,
          message: '请输入正确的邮箱格式',
          type: 'email',
        }"
      >
        <Input
          placeholder="请输入qq邮箱"
          :maxlength="20"
          v-model:value="updatePasswordInfo.email"
        />
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
            v-model:value="updatePasswordInfo.captcha"
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

      <FormItem :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <Button class="update" type="primary" html-type="submit">
          确认修改
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
import { updatePasswordCaptcha } from "@/service/user/email/captcha";
import { updatePassword } from "@/service/user/update_password/update_password";
import { useRouter } from "vue-router";

export interface UpdatePassword {
  password: string;
  confirmPassword?: string;
  email: string;
  captcha: string;
  username: string;
}

const updatePasswordInfo = ref<UpdatePassword>({
  password: "",
  confirmPassword: "",
  email: "",
  captcha: "",
  username: "",
});

let isLoading = ref(false);
let isSend = ref(false);

const router = useRouter();
async function updateBtn(values: UpdatePassword) {
  if (
    updatePasswordInfo.value.confirmPassword !==
    updatePasswordInfo.value.password
  ) {
    return message.error("两次密码不一致");
  } else {
    const res = await updatePassword(values);
    console.log(res);

    const { data } = res.data;
    if (res.status === 200 || res.status === 201) {
      message.success(data);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } else {
      message.error(data || "系统繁忙,请稍后再试");
    }
  }
}

async function sendCaptcha() {
  if (!updatePasswordInfo.value.email) {
    return message.warn("请填写邮箱地址!");
  } else {
    isLoading.value = true;
    const res = await updatePasswordCaptcha(updatePasswordInfo.value.email);
    const { data } = res.data;
    if (res.status === 200 || res.status === 201) {
      message.success(data + ",30s后可再次发送");
      isLoading.value = false;
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
  margin: 200px auto 0 auto;

  .update {
    width: 85%;
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
