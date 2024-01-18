<template>
  <div class="room-container">
    <div class="search">
      <Form
        :model="searchBooking"
        @finish="searchBtn"
        layout="inline"
        ref="formRef"
      >
        <FormItem label="会议室名称" name="meetingRoomName">
          <Input
            :maxlength="20"
            v-model:value="searchBooking.meetingRoomName"
          />
        </FormItem>

        <FormItem label="开始日期" name="rangeStartDate">
          <DatePicker v-model="searchBooking.rangeStartDate" />
        </FormItem>

        <FormItem label="开始时间" name="rangeStartTime">
          <TimePicker v-model="searchBooking.rangeStartTime" />
        </FormItem>

        <FormItem label="结束日期" name="rangeEndDate">
          <DatePicker v-model="searchBooking.rangeEndDate" />
        </FormItem>

        <FormItem label="结束时间" name="rangeEndTime">
          <TimePicker v-model="searchBooking.rangeEndTime" />
        </FormItem>

        <FormItem label="会议主题" name="theme">
          <Input :maxlength="20" v-model:value="searchBooking.theme" />
        </FormItem>

        <FormItem>
          <Button
            class="btn1"
            type="default"
            @click="handelReset"
            :icon="h(RedoOutlined)"
          >
            重置
          </Button>
        </FormItem>

        <FormItem>
          <Button
            class="btn1"
            type="primary"
            html-type="submit"
            :icon="h(SearchOutlined)"
          >
            搜索
          </Button>
        </FormItem>
      </Form>
    </div>
    <div class="table">
      <Table
        :columns="columns"
        :data-source="searchResult"
        :pagination="{
          current: pageNo,
          pageSize: pageSize,
          total: totalCount,
          onChange: handleChange,
        }"
        :bordered="true"
        :locale="{
          emptyText: '暂无数据',
        }"
      >
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import {
  Form,
  FormItem,
  Input,
  Button,
  type TableColumnsType,
  type FormInstance,
  Table,
  message,
  DatePicker,
  TimePicker,
  Popconfirm,
} from "ant-design-vue";
import {
  QuestionCircleFilled,
  RedoOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import type { MeetingRoomSearchResult } from "./RoomList.vue";
import { bookingList, unbind } from "@/service/user/list/book_list";
import dayjs from "dayjs";

export type SearchBooking = {
  username: string;
  meetingRoomName: string;
  theme: string;
  meetingRoomPosition: string;
  rangeStartDate: Date;
  rangeStartTime: Date;
  rangeEndDate: Date;
  rangeEndTime: Date;
};

const searchBooking = ref({} as SearchBooking);
// searchBooking.value.username = JSON.parse(localStorage.getItem("user_info")!);

type BookingSearchResult = {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  theme: string;
  createTime: string;
  updateTime: string;
  room: MeetingRoomSearchResult;
};

let searchResult = ref<BookingSearchResult[]>([]);

// table栏信息
const columns: TableColumnsType<BookingSearchResult> = [
  {
    title: "会议室名称",
    dataIndex: "room",
    customRender: (value) => value.record.room.name,
    align: "center",
  },
  {
    title: "会议主题",
    dataIndex: "theme",
    // customRender: (value) => value.record.room.name,
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    align: "center",
    customRender: (value) => {
      return dayjs(new Date(value.record.startTime)).format(
        "YYYY-MM-DD hh:mm:ss"
      );
    },
  },

  {
    title: "结束时间",
    dataIndex: "endTime",
    align: "center",
    customRender: (value) => {
      return dayjs(new Date(value.record.endTime)).format(
        "YYYY-MM-DD hh:mm:ss"
      );
    },
  },
  {
    title: "预定时间",
    dataIndex: "createTime",
    customRender: (value) => {
      return dayjs(new Date(value.record.createTime)).format(
        "YYYY-MM-DD hh:mm:ss"
      );
    },
    align: "center",
  },

  {
    title: "审批状态",
    dataIndex: "status",
    onFilter: (value, record) => record.status.startsWith(value as string),
    filters: [
      {
        text: "审批通过",
        value: "审批通过",
      },
      {
        text: "审批驳回",
        value: "审批驳回",
      },
      {
        text: "申请中",
        value: "申请中",
      },
      {
        text: "已解除",
        value: "已解除",
      },
    ],
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "note",
    align: "center",
  },
  {
    title: "操作",
    align: "center",
    customRender: (value) => {
      if (value.record.status === "申请中") {
        return h(
          Popconfirm,
          {
            okText: "确定",
            cancelText: "取消",
            title: "解除预定",
            description: "确认解除该次预定?",
            onConfirm: () => handleUnbind(value.record.id),
            icon: h(QuestionCircleFilled),
          },
          [h("a", { innerHTML: "解除预定" })]
        );
      }
    },
  },
];

const handleUnbind = async (id: number) => {
  const res = await unbind(id);

  if (res.status === 201 || res.status === 200) {
    message.success("状态更新成功");
    searchBtn(searchBooking.value);
  } else {
    message.error(res.data.data);
  }
};

let pageNo = 1;
let pageSize = 9;
let totalCount = ref(15);

const setPage = (newPageNo: number, newPageSize: number) => {
  pageNo = newPageNo;
  pageSize = newPageSize;
};

function handleChange(pageNo: number, pageSize: number) {
  setPage(pageNo, pageSize);
  searchBtn(searchBooking.value);
}

// 搜索会议室
async function searchBtn(values: SearchBooking) {
  const res = await bookingList(values, pageNo, pageSize);

  const { data } = res.data;
  if (res.status === 200 || res.status === 201) {
    searchResult.value = [...data.bookings];

    totalCount.value = data.totalCount;
  } else {
    message.error(data || "系统繁忙,请稍后再试");
  }
}

onMounted(() => {
  searchBtn(searchBooking.value);
});

// 表单重置
const formRef = ref<FormInstance>();
function handelReset() {
  formRef.value?.resetFields();
  searchBtn(searchBooking.value);
}
</script>

<style scoped lang="less">
.room-container {
  display: flex;
  flex-direction: column;
  padding: 20px;

  .search {
    margin: 0 auto;
    margin-bottom: 30px;
  }
}
</style>
