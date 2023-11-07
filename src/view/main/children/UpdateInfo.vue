<template>
  <div class="update-container">
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
        <img
          :src="getURL(updateUserInfo.headPic)"
          alt="头像"
          width="100"
          height="100"
        />
        <UploadDragger
          name="file"
          action="http://localhost:3005/user/upload"
          @change="handleChange"
        >
          <InboxOutlined />
          点击 / 拖拽文件到此
        </UploadDragger>
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

      <FormItem label="邮箱" name="email">
        <Input :maxlength="20" v-model:value="updateUserInfo.email" disabled />
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
  message,
  UploadDragger,
  type UploadChangeParam,
} from "ant-design-vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { updateInfoCaptcha } from "@/service/user/email/captcha";
import {
  getUserInfo,
  updateInfo,
} from "@/service/user/update_info/update_info";
import { useRouter } from "vue-router";
import { getURL } from "@/utils/getUrl";

const router = useRouter();
export interface UpdateUserInfo {
  headPic: string;
  nickName: string;
  email: string;
  captcha: string;
}

const updateUserInfo = ref<UpdateUserInfo>({
  headPic: "",
  nickName: "",
  email: "",
  captcha: "",
});

let isSend = ref(false);
let isLoading = ref(false);

async function getLoginInfo() {
  const res = await getUserInfo();
  const { data } = res.data;
  updateUserInfo.value.email = data.email;
  updateUserInfo.value.headPic = data.headPic;
  updateUserInfo.value.nickName = data.nickName;
}
getLoginInfo();

async function updateBtn(values: UpdateUserInfo) {
  const res = await updateInfo(values);
  const { data } = res.data;
  if (res.status === 200 || res.status === 201) {
    message.success("修改成功");
    setTimeout(() => {
      router.push("/menu/room_list");
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

function handleChange(info: UploadChangeParam) {
  const { status } = info.file;
  if (status === "done") {
    console.log(info.file.response.data);
    updateUserInfo.value.headPic = info.file.response.data;
    message.success(info.file.name + "文件上传成功");
  } else if (status === "error") {
    message.error(info.file.name + "文件上传失败");
  }
}
</script>

<style scoped lang="less">
.update-container {
  width: 400px;
  text-align: center;
  margin: 100px auto 0 auto;

  .update {
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
