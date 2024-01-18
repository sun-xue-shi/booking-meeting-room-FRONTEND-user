<template>
  <div class="modal">
    <Modal
      title="预定会议室"
      :open="props.isBookOpen"
      @cancel="props.handelClose()"
      @ok="handleOk(createBooking)"
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
        <FormItem label="会议室名称">
          {{ props.currentRoom }}
        </FormItem>

        <FormItem
          label="开始日期"
          name="rangeStartDate"
          :rules="[{ required: true, message: '请选择开始日期' }]"
        >
          <DatePicker v-model:value="createBooking.rangeStartDate" />
        </FormItem>

        <FormItem
          label="开始时间"
          name="startTime"
          :rules="[{ required: true, message: '请选择开始时间' }]"
        >
          <TimePicker v-model:value="createBooking.rangeStartTime" />
        </FormItem>

        <FormItem
          label="结束日期"
          name="endDate"
          :rules="[{ required: true, message: '请选择结束日期' }]"
        >
          <DatePicker v-model:value="createBooking.rangeEndDate" />
        </FormItem>

        <FormItem
          label="结束时间"
          name="endTime"
          :rules="[{ required: true, message: '请选择结束时间' }]"
        >
          <TimePicker v-model:value="createBooking.rangeEndTime" />
        </FormItem>

        <FormItem label="会议主题" name="theme">
          <Textarea
            :maxlength="30"
            v-model:value="createBooking.theme"
            placeholder="请输入会议主题"
          />
        </FormItem>

        <FormItem label="备注" name="note">
          <Textarea
            :maxlength="200"
            v-model:value="createBooking.note"
            placeholder="请输入备注"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { bookingAdd } from "@/service/user/list/book_list";
import {
  Modal,
  Form,
  FormItem,
  Textarea,
  DatePicker,
  TimePicker,
  message,
} from "ant-design-vue";
import { ref } from "vue";

const props = defineProps<{
  isBookOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  handelClose: Function;
  currentRoom: string;
  currentRoomId: number;
}>();

export type Booking = {
  meetingRoomId: number;
  userId: number;
  rangeStartDate: string;
  rangeStartTime: string;
  rangeEndDate: string;
  rangeEndTime: string;
  note: string;
  theme: string;
};

const createBooking = ref({} as Booking);

// 确定后创建会议室
async function handleOk(values: Booking) {
  values.meetingRoomId = props.currentRoomId;

  const res = await bookingAdd(values);

  const { data } = res.data;
  if (res.status === 200 || res.status === 201) {
    message.success("创建成功");
    createBooking.value = {} as Booking;
    props.handelClose();
  } else {
    message.error(data || "系统繁忙，请稍后再试");
  }
}
</script>

<style scoped lang="less"></style>
