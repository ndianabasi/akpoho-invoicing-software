/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { FileMultiFormats, ResolvedProfilePictureUrls } from 'src/store/types';
import { store } from '../store';

export default class MultiFormatPicture {
  private rootUrl: string;
  constructor(private imageBase: FileMultiFormats) {
    this.imageBase = imageBase;
    this.rootUrl = store.getters['getRootURL'] as string;
  }

  public get imageUrls(): ResolvedProfilePictureUrls | null {
    if (!this.imageBase) return null;

    const profilePictureFormat: {
      thumbnail?: string | undefined;
      small?: string | undefined;
      original?: string | undefined;
    } = { thumbnail: undefined, small: undefined, original: undefined };

    if (this.imageBase) {
      profilePictureFormat.thumbnail =
        this.imageBase?.formats?.thumbnail?.url ?? undefined;
      profilePictureFormat.small =
        this.imageBase?.formats?.small?.url ?? undefined;
      profilePictureFormat.original = this.imageBase?.url ?? undefined;
    }

    return {
      thumbnail: profilePictureFormat?.thumbnail
        ? `${this.rootUrl}/${profilePictureFormat.thumbnail}`
        : undefined,
      small: profilePictureFormat.small
        ? `${this.rootUrl}/${profilePictureFormat.small}`
        : undefined,
      original: profilePictureFormat.original
        ? `${this.rootUrl}/${profilePictureFormat.original}`
        : undefined,
    };
  }

  public get avatarImageUrl() {
    const imageUrls = this.imageUrls;
    if (!imageUrls) return '';
    return imageUrls.thumbnail ?? imageUrls.small ?? imageUrls.original ?? '';
  }
}
