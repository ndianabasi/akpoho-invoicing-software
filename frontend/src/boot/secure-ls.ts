import { boot } from 'quasar/wrappers';
import SecureLS from 'secure-ls';

const ls = new SecureLS({ isCompression: false });

export default boot((/* { app } */) => {
  //
});

// Export the Emittery class and its instance
export { ls };
