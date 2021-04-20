/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios';
import { useStore } from '../store/index';

const Store = useStore();

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
