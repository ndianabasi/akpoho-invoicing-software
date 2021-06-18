import { Banner } from './getters';

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export interface BannerStateInterface {
  banners: Array<Banner>;
}

function state(): BannerStateInterface {
  return {
    banners: [],
  };
}

export default state;
