/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { computed } from 'vue';
import { TitleInfo } from '../store/types';
import { store } from '../store';

export default function ({ title, avatar }: TitleInfo) {
  const baseURL = store.getters['getRootURL'] as string;
  const avatarURL = !avatar
    ? ''
    : avatar.startsWith('http')
    ? avatar
    : `${baseURL}/${avatar}`;

  return computed(() => ({
    title,
    avatar: avatarURL,
  }));
}
