/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//import { computed, reactive } from 'vue';
import { store } from '../store';
import { Dialog, Notify } from 'quasar';
import {
  ResourceName,
  ResourceNamePlural,
  ResourceType,
} from 'src/store/types';

export default function ({
  resource,
  resourceName,
  payload,
}: {
  resource: ResourceType;
  resourceName: ResourceName | ResourceNamePlural;
  payload: unknown;
}) {
  return new Promise((resolve, reject) => {
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
    }).onOk(() => {
      const deleteProgressDialog = Dialog.create({
        title: 'In Progress',
        message: 'Software at work!',
        progress: true,
        ok: false,
        cancel: false,
        persistent: true,
      });

      let actionName: string;

      try {
        if (resource === 'user') {
          actionName = 'users/DELETE_USER';
        } else if (resource === 'company') {
          actionName = 'companies/DELETE_COMPANY';
        } else if (resource === 'customer') {
          actionName = 'customers/DELETE_CUSTOMER';
        } else if (resource === 'invoice' || resource === 'quotation') {
          actionName = 'invoices_quotations/DELETE_INVOICE_QUOTATION';
        } else {
          actionName = '';
          throw new Error('A valid resource is not specified');
        }

        void store
          .dispatch(actionName, payload)
          .then((message: string) => {
            // Avoid screen flicker for quick operations
            setTimeout(() => {
              Notify.create({
                type: 'positive',
                message,
                position: 'top',
                timeout: 5000,
              });
              deleteProgressDialog.hide();
              return resolve(`${resourceName} was successfully deleted`);
            }, 1500);
          })
          .catch((error) => {
            deleteProgressDialog.hide();
            return reject(error);
          });
      } catch (error) {
        console.error(error);
        deleteProgressDialog.hide();
        return reject(error);
      }
    });
  });
}
