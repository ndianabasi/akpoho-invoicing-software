/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//import { computed, reactive } from 'vue';
import { store } from '../store';
import { Dialog } from 'quasar';
import Router from '../router';
import { RouteParamsRaw } from 'vue-router';

const router = Router();

enum RESOURCE {
  USER = 'user',
}

export default function ({
  resource,
  resourceName,
  payload,
}: {
  resource: RESOURCE;
  resourceName: string;
  payload: unknown;
}) {
  Dialog.create({
    title: 'Deletion Warning',
    message: `You are about to delete this ${resourceName}. Please type 'DELETE' to confirm your action.`,
    prompt: {
      model: '',
      isValid: (val: string) => val.trim().toLowerCase() === 'delete',
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const deleteProgressDialog = Dialog.create({
      title: 'In Progress',
      message: 'Software at work!',
      progress: true,
      ok: false,
      cancel: false,
      persistent: true,
    });

    let actionName: string;
    let postDeletionAction: {
      routeName: string;
      routeParams: RouteParamsRaw | undefined;
    } | null;

    if (resource === 'user') {
      actionName = 'users/DELETE_USER';
      postDeletionAction = { routeName: 'all_users', routeParams: undefined };
    } else {
      actionName = '';
      postDeletionAction = null;
      throw new Error('A valid resource is not specified');
    }

    await store
      .dispatch(actionName, payload)
      .then(() => {
        // Show success message before dialog is hidden programmatically
        deleteProgressDialog.update({
          title: 'Success',
          message: `${resourceName} was successfully deleted`,
          progress: false,
        });
        // Avoid screen flicker for quick operations
        setTimeout(() => {
          deleteProgressDialog.hide();
          void router.push({
            name: postDeletionAction?.routeName,
            params: postDeletionAction?.routeParams,
          });
        }, 1500);
      })
      .catch(() => {
        deleteProgressDialog.hide();
      });
  });
}
