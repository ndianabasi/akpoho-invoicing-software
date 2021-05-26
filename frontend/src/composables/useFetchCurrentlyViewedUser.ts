/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ref, Ref, watchEffect } from 'vue';
import { CurrentlyViewedUser } from '../store/types';
import { store } from '../store';

const currentUser: Ref<CurrentlyViewedUser | null> = ref(null);

const stopFetchCurrentlyViewedUser = function (userId: string) {
  return watchEffect(() => {
    void store
      .dispatch('users/FETCH_CURRENTLY_VIEW_USER', {
        userId: userId,
      })
      .then(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        currentUser.value = JSON.parse(
          JSON.stringify(
            store.getters[
              'users/GET_CURRENTLY_VIEWED_USER'
            ] as CurrentlyViewedUser
          )
        );
      });
  });
};

export { stopFetchCurrentlyViewedUser, currentUser };
