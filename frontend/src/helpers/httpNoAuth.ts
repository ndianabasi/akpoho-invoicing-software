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
  const getHttpNoAuthOptions = Store.getters['getHttpNoAuthOptions'];

  const axiosInstance = axios.create({
    baseURL: getHttpNoAuthOptions.baseURL as string,
    timeout: getHttpNoAuthOptions.timeout as number,
  });
  return axiosInstance;
};

export default instance;
