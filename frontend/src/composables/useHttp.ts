/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios, { AxiosInstance } from 'axios';
import { useStore } from '../store/index';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const store = useStore();

console.log(store.getters.getHttpOptions.headers);

const api: AxiosInstance = axios.create({
  baseURL: store.getters.getBaseURL as string,
  timeout: store.getters.getHttpOptions.timeout as number,
  headers: store.getters.getHttpOptions.headers as string,
});

export default api;
