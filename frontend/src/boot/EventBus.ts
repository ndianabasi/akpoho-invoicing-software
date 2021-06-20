import { boot } from 'quasar/wrappers';
import Emittery from 'emittery';

const emitter = new Emittery();

export default boot(({ app }) => {
  app.config.globalProperties.$event = emitter;
});

// Export the Emittery class and its instance
export { emitter, Emittery };
