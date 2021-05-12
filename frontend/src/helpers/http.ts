/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios';
import { useStore } from 'vuex';
import { AxiosInstance } from 'axios';

//const Store = useStore();

/* interface AsyncError {
  message?: string;
  response?: {
    status?: number;
    data?: {
      error?: {
        message?: string;
        name?: string;
      };
    };
    statusText: string;
  };
} */
let axiosInstance: AxiosInstance;
const store = useStore();
if (store) {
  const getHttpOptions = store.getters['getHttpOptions'];

  axiosInstance = axios.create({
    baseURL: getHttpOptions.baseURL as string,
    timeout: getHttpOptions.timeout as number,
    headers: getHttpOptions.headers as string,
  });
} else {
  axiosInstance = axios;
}

export default axiosInstance;
