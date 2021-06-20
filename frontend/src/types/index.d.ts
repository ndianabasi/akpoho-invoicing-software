import { emitter } from '../boot/EventBus';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $event: typeof emitter;
  }
}
