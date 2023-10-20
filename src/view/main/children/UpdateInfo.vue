<template>
  <div class="register-container">
    <h1>会议室预定系统</h1>
    <Form
      :model="updateUserInfo"
      @finish="updateBtn"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 17 }"
      :colon="false"
    >
      <FormItem
        label="头像"
        name="headPic"
        :rules="{ required: true, message: '请输入头像' }"
      >
        <Input v-model:value="updateUserInfo.headPic" />
      </FormItem>

      <FormItem
        label="昵称"
        name="nickName"
        :rules="{ required: true, message: '请输入你的昵称' }"
      >
        <Input
          placeholder="请输入昵称"
          :maxlength="20"
          v-model:value="updateUserInfo.nickName"
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
          v-model:value="updateUserInfo.email"
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
            v-model:value="updateUserInfo.captcha"
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
        <Button class="register" type="primary" html-type="submit">
          确认修改
        </Button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Button, FormItem, Form, Input, message } from "ant-design-vue";
import { ref } from "vue";
import { updateInfoCaptcha } from "@/service/user/email/captcha";
import { updateInfo } from "@/service/user/update_info/update_info";
import { useRouter } from "vue-router";

const userInfo = JSON.parse(localStorage.getItem("user_info") as string);
const router = useRouter();
export interface UpdateUserInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

const updateUserInfo = ref<UpdateUserInfo>({
  headPic: userInfo.headPic,
  nickName: userInfo.nickName,
  email: userInfo.email,
  captcha: "",
});
// updateUserInfo.email = userInfo?.email;
let isSend = ref(false);
let isLoading = ref(false);

async function updateBtn(values: UpdateUserInfo) {
  const res = await updateInfo(values);
  const { data } = res.data;
  if (res.status === 200 || res.status === 201) {
    message.success("修改成功");
    setTimeout(() => {
      router.push("/main");
    }, 1000);
  } else {
    message.error(data || "系统繁忙,请稍后再试");
  }
}

async function sendCaptcha() {
  if (!updateUserInfo.value.email) {
    return message.warn("请填写邮箱地址!");
  } else {
    isLoading.value = true;
    const res = await updateInfoCaptcha();
    console.log(res);
    const { data } = res.data;

    if (res.status === 200 || res.status === 201) {
      message.success(data + ",30s后可以再次发送");
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
  margin: 100px auto 0 auto;

  .register {
    width: 90%;
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
