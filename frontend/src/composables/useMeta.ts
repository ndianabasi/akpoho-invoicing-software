import { useMeta } from 'quasar';
import { ref } from 'vue';

const title = ref(''); // we define the "title" prop

// NOTICE the parameter here is a function
// Under the covers, it is converted to a Vue computed prop for reactivity
useMeta(() => {
  return {
    // whenever "title" from above changes, your meta will automatically update
    title: title.value,
  };
});

function setPageTitle(newTitle: string) {
  title.value = newTitle; // will automatically trigger a Meta update due to the binding
}

export { setPageTitle };
