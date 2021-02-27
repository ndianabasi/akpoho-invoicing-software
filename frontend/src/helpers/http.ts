/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios';
import { key } from '../store/index';
import { useStore } from 'vuex';

const Store = useStore(key);

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

const instance = () => {
  const getHttpOptions = Store.getters['getHttpOptions'];

  const axiosInstance = axios.create({
    baseURL: getHttpOptions.baseURL as string,
    timeout: getHttpOptions.timeout as number,
    headers: getHttpOptions.headers as string,
  });
  return axiosInstance;
};

export default instance;
