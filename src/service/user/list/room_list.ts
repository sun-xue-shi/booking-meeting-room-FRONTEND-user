import { axiosInstance } from "@/service";

export async function meetingSearch(
  name: string,
  location: string,
  equipment: string,
  capacity: number | undefined,
  pageNo: number,
  pageSize: number
) {
  return await axiosInstance.get("/meeting-room/list", {
    params: {
      name,
      location,
      equipment,
      capacity,
      pageNo,
      pageSize,
    },
  });
}
