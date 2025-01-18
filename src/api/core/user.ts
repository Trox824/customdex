import { ReadListResponse } from "../../app/_components/types";
import { axiosInstance } from "./axios";

export const getReadList = async (query: { page?: number } = {}) => {
  const { data } = await axiosInstance<ReadListResponse>({
    url: "/api/user/read-list",
    params: { ...query },
  });
  return data;
};
