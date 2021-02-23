import { boot } from 'quasar/wrappers';
import { defineAsyncComponent } from 'vue';

// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  const DismissibleBanner = defineAsyncComponent(() =>
    import('../components/DismissibleBanner.vue')
  );

  app.use(DismissibleBanner);
});
