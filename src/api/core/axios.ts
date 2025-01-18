import { Constants } from "../../app/constants";
import axios from "axios";
export const axiosInstance = axios.create({
  baseURL: Constants.BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});
