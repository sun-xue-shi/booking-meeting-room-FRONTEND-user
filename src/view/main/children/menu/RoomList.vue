<template>
  <div class="room-container">
    <div class="search">
      <Form
        :model="searchMeetingRoom"
        @finish="searchBtn"
        layout="inline"
        ref="formRef"
      >
        <FormItem label="会议室名称" name="name">
          <Input :maxlength="20" v-model:value="searchMeetingRoom.name" />
        </FormItem>

        <FormItem label="容纳人数" name="capacity">
          <Input :maxlength="20" v-model:value="searchMeetingRoom.capacity" />
        </FormItem>

        <FormItem label="设备" name="equipment">
          <Input :maxlength="20" v-model:value="searchMeetingRoom.equipment" />
        </FormItem>

        <FormItem label="位置" name="location">
          <Input :maxlength="20" v-model:value="searchMeetingRoom.location" />
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
    <book-modal
      :is-book-open="isShow"
      :handel-close="onClose"
      :current-room="currentRoom"
      :current-room-id="currentRoomId"
    ></book-modal>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import {
  Form,
  FormItem,
  Input,
  Button,
  type TableColumnsType,
  type FormInstance,
  Table,
  message,
  Badge,
} from "ant-design-vue";
import { RedoOutlined, SearchOutlined } from "@ant-design/icons-vue";
import { meetingSearch } from "@/service/user/list/room_list";
import { formatUTC } from "@/utils/format";
import BookModal from "@/view/main/BookModal.vue";

type SearchMeetingRoom = {
  location: string;
  name: string;
  equipment: string;
  capacity: number | undefined;
};

const onClose = () => {
  isShow.value = false;
};

const isShow = ref(false);
const searchMeetingRoom = ref({} as SearchMeetingRoom);

export type MeetingRoomSearchResult = {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
  createTime: string;
  updateTime: string;
};

let searchResult = ref([] as MeetingRoomSearchResult[]);
const currentRoom = ref("");
const currentRoomId = ref();
const isFrozen = ref(false);
// table栏信息
const columns: TableColumnsType<MeetingRoomSearchResult> = [
  {
    title: "名称",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "容纳人数",
    dataIndex: "capacity",
    align: "center",
  },
  {
    title: "位置",
    dataIndex: "location",
    align: "center",
  },
  {
    title: "设备",
    dataIndex: "equipment",
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "description",
    align: "center",
  },
  {
    title: "添加时间",
    dataIndex: "createTime",
    customRender: (value) => formatUTC(value.record.createTime),
    align: "center",
  },
  {
    title: "上次更新时间",
    dataIndex: "updateTime",
    customRender: (value) => formatUTC(value.record.updateTime),
    align: "center",
  },

  {
    title: "操作",
    align: "center",
    customRender: (value) => {
      return isFrozen.value
        ? "您已被冻结"
        : h("a", {
            innerHTML: "预定",
            onClick: () => {
              isShow.value = true;
              currentRoom.value = value.record.name;
              currentRoomId.value = value.record.id;
            },
          });
    },
  },
];

let pageNo = 1;
let pageSize = 9;
let totalCount = ref(15);

const setPage = (newPageNo: number, newPageSize: number) => {
  pageNo = newPageNo;
  pageSize = newPageSize;
};

function handleChange(pageNo: number, pageSize: number) {
  setPage(pageNo, pageSize);
  searchBtn(searchMeetingRoom.value);
}

// 搜索会议室
async function searchBtn(values: SearchMeetingRoom) {
  const res = await meetingSearch(
    values.name,
    values.location,
    values.equipment,
    values.capacity,
    pageNo,
    pageSize
  );

  const { data } = res.data;

  if (res.status === 200 || res.status === 201) {
    searchResult.value = data.meetingRooms;
    isFrozen.value = data.user.is_frozen;
    totalCount.value = data.totalCount;
  } else {
    message.error(data || "系统繁忙,请稍后再试");
  }
}
searchBtn(searchMeetingRoom.value);

// 表单重置
const formRef = ref<FormInstance>();
function handelReset() {
  formRef.value?.resetFields();
  searchBtn(searchMeetingRoom.value);
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
@/service/user/list/room_list
