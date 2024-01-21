<script setup lang="ts">
import { Form, FormItem, Input, InputPassword, message } from "ant-design-vue";
import { passLogin } from "@/service/user/login/login";
import { ref } from "vue";
import { useRouter } from "vue-router";

type PasswordLogin = {
  username: string;
  password: string;
};

const passwordLogin = ref<PasswordLogin>({
  username: "",
  password: "",
});

const router = useRouter();
// 登录逻辑
async function passLoginBtn() {
  console.log(passwordLogin.value);

  if (!passwordLogin.value) return;
  const res = await passLogin(
    passwordLogin.value.username,
    passwordLogin.value.password
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

defineExpose({
  passLoginBtn,
});
</script>

<template>
  <div class="">
    <Form
      :model="passwordLogin"
      @finish="passLoginBtn"
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
          v-model:value="passwordLogin.username"
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
          v-model:value="passwordLogin.password"
        />
      </FormItem>
    </Form>
  </div>
</template>

<style scoped lang="less"></style>
