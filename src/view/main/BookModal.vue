<template>
  <!-- @ok="handleOk(createBooking)" -->
  <div class="modal">
    <Modal
      title="预定会议室"
      :open="props.isBookOpen"
      @cancel="props.handelClose()"
      ok-text="预定"
      cancel-text="取消"
      style="top: 25%"
    >
      <Form
        :model="createBooking"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 15 }"
        layout="r"
      >
        <FormItem
          label="会议室名称"
          name="name"
          :rules="{
            required: true,
            message: '请输入会议室名称',
          }"
        >
          <Input
            :maxlength="20"
            v-model:value="createBooking.name"
            placeholder="会议室名称,如：‘二号报告厅’"
          />
        </FormItem>

        <FormItem
          label="开始时间"
          name="startTime"
          :rules="{
            required: true,
            message: '请输入开始时间',
          }"
        >
          <Input
            :maxlength="20"
            v-model:value="createBooking.startTime"
            placeholder="预定开始时间"
          />
        </FormItem>

        <FormItem
          label="结束时间"
          name="capacity"
          :rules="{
            required: true,
            message: '请输入结束时间',
          }"
        >
          <Input v-model:value="createBooking.endTime" placeholder="结束时间" />
        </FormItem>

        <FormItem label="备注" name="extraInfo">
          <Textarea
            :maxlength="200"
            v-model:value="createBooking.extraInfo"
            placeholder="请输入备注"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Modal, Form, FormItem, Input, Textarea } from "ant-design-vue";
import { ref } from "vue";

const props = defineProps<{
  isBookOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  handelClose: Function;
}>();

export type Booking = {
  name: string;
  startTime: string;
  endTime: string;
  extraInfo: string;
};

const createBooking = ref({} as Booking);

// 确定后创建会议室
// async function handleOk(values: Meeting) {
//   const res = await createRoom(values);

//   const { data } = res.data;
//   if (res.status === 200 || res.status === 201) {
//     message.success("创建成功");
//     props.handelClose();
//   } else {
//     message.error(data || "系统繁忙，请稍后再试");
//   }
// }
</script>

<style scoped lang="less"></style>
