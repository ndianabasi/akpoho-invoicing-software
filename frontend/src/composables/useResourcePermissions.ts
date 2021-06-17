/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { computed, reactive } from 'vue';
import { store } from '../store';
import { PropObject } from 'src/types/table';

export type ResourcePermissions = {
  canList: boolean;
  canCreate: boolean;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
};

export default function (
  resourceActionPermissions: PropObject
): ResourcePermissions | null {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const GET_USER_PERMISSION = store.getters['permissions/GET_USER_PERMISSION'];

  const resourcePermissions = resourceActionPermissions
    ? reactive({
        canList: resourceActionPermissions.list
          ? computed(() => GET_USER_PERMISSION(resourceActionPermissions.list))
          : false,
        canCreate: resourceActionPermissions.new
          ? computed(() => GET_USER_PERMISSION(resourceActionPermissions.new))
          : false,
        canView: resourceActionPermissions.view
          ? computed(() => GET_USER_PERMISSION(resourceActionPermissions.view))
          : false,
        canEdit: resourceActionPermissions.edit
          ? computed(() => GET_USER_PERMISSION(resourceActionPermissions.edit))
          : false,
        canDelete: resourceActionPermissions.delete
          ? computed(() =>
              GET_USER_PERMISSION(resourceActionPermissions.delete)
            )
          : false,
      })
    : null;

  return resourcePermissions;
}
