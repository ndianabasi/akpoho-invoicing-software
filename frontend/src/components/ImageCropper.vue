<template>
  <q-file
    ref="filePicker"
    v-model="inputImage"
    :max-files="1"
    :multiple="false"
    v-bind="qFileAttributes"
    @update:model-value="startCropper"
    @rejected="showRejectionDialog"
  >
    <template v-if="useBeforeSlot" #before>
      <slot name="before"><q-icon name="attach_file" /></slot>
    </template>

    <template #after>
      <q-icon
        v-if="previewCropped"
        round
        name="visibility"
        @click="previewDialog = !previewDialog"
      />
    </template>

    <template #hint> Field hint </template>

    <template #append>
      <q-btn
        round
        dense
        flat
        icon="add"
        @click.prevent="$refs.filePicker.pickFiles()"
      />
    </template>
  </q-file>

  <q-dialog
    v-bind="qDialogAttributes"
    ref="launchDialogRef"
    v-model="launchCropperDialog"
  >
    <q-card
      class="cropper-wrapper"
      :style="{
        width: $q.screen.lt.md ? '90vw' : '900px',
        maxWidth: $q.screen.lt.md ? '95vw' : '90vw',
        maxHeight: '85vh',
      }"
    >
      <div class="row">
        <div class="col col-xs-12 col-sm-12 col-md-8 col-lg-8">
          <q-card-section class="image-source q-pa-none">
            <img
              ref="sourceRef"
              :src="objectUrl"
              alt="Source image preview"
              class="cropper-preview"
            />
          </q-card-section>

          <q-card-section class="q-pb-none q-px-none">
            <q-card-actions align="center">
              <q-btn
                flat
                color="primary"
                icon="refresh"
                label="Reset"
                size="sm"
                @click.prevent="resetCropper"
              />
              <q-btn
                flat
                color="primary"
                icon="rotate_left"
                label="Rotate Left"
                size="sm"
                @click.prevent="rotateLeft"
              />
              <q-btn
                flat
                color="primary"
                icon="rotate_right"
                label="Rotate Right"
                size="sm"
                @click.prevent="rotateRight"
              />
              <q-btn
                flat
                color="primary"
                icon="zoom_in"
                label="Zoom In"
                size="sm"
                @click.prevent="zoomIn"
              />
              <q-btn
                flat
                color="primary"
                icon="zoom_out"
                label="Zoom Out"
                size="sm"
                @click.prevent="zoomOut"
              />
              <q-btn
                flat
                color="primary"
                icon="swap_horiz"
                label="Flip Horizontal"
                size="sm"
                @click.prevent="flipX"
              />
              <q-btn
                flat
                color="primary"
                icon="swap_vert"
                label="Flip Vertical"
                size="sm"
                @click.prevent="flipY"
              />
              <q-btn
                flat
                color="primary"
                icon="crop_free"
                label="Free Crop"
                size="sm"
                @click.prevent="cropFree"
              />
              <q-btn
                flat
                color="primary"
                icon="crop_square"
                label="Square Crop"
                size="sm"
                @click.prevent="cropSquare"
              />
            </q-card-actions>
          </q-card-section>

          <q-card-section class="q-mt-sm q-pt-none">
            <q-card-actions align="center">
              <q-btn
                flat
                color="primary"
                icon="save"
                label="Finish"
                @click.prevent="finishCrop"
              />
              <q-btn
                v-close-popup
                flat
                color="warning"
                icon="cancel"
                label="Cancel"
              />
              <q-btn
                color="grey"
                :label="cardExpanded ? 'Hide Preview' : 'Show Preview'"
                flat
                dense
                :icon-right="cardExpanded ? 'chevron_left' : 'chevron_right'"
                @click="cardExpanded = !cardExpanded"
              />
            </q-card-actions>
          </q-card-section>
        </div>
        <div
          v-if="cardExpanded"
          class="col col-xs-12 col-sm-12 col-md-4 col-lg-4"
        >
          <q-card-section class="text-subitle2 row items-center justify-center">
            <img
              v-if="previewCropped"
              ref="previewRef"
              :src="previewCropped"
              alt="Cropped image preview"
              class="image-preview cropper-preview"
            />
          </q-card-section>
        </div>
      </div>
    </q-card>
  </q-dialog>

  <q-dialog
    v-bind="qPreviewDialogAttributes"
    ref="previewDialogRef"
    v-model="previewDialog"
  >
    <q-card class="my-card">
      <img :src="previewCropped" alt="Cropped image preview" />
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent, computed, ref, Ref, nextTick } from 'vue';
import { QDialog, useQuasar } from 'quasar';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { debounce } from 'lodash';
import { DateTime } from 'luxon';
import fileSize from 'filesize';
import { snakeCase } from 'lodash';

export default defineComponent({
  components: {},
  props: {
    modelValue: {
      type: File,
      default: () => null,
    },
    show: {
      type: Boolean,
      default: false,
    },
    inputFilled: {
      type: Boolean,
      default: true,
    },
    inputBottomSlots: {
      type: Boolean,
      default: true,
    },
    inputLabel: {
      type: String,
      default: 'Profile Picture',
    },
    inputCounter: {
      type: Boolean,
      default: true,
    },
    inputClearable: {
      type: Boolean,
      default: true,
    },
    inputUseChips: {
      type: Boolean,
      default: true,
    },
    useBeforeSlot: {
      type: Boolean,
      default: true,
    },
    inputAccept: {
      type: String,
      default: 'image/*',
    },
    inputMaxFileSize: {
      type: Number,
      default: 1048576,
    },
    inputClass: {
      type: [String, Array, Object],
      default: 'q-mb-sm',
      required: false,
    },
  },
  emits: ['finish-cropper', 'update:modelValue'],
  setup(props, ctx) {
    const launchDialogRef: Ref<QDialog | null> = ref(null);
    const previewDialogRef: Ref<QDialog | null> = ref(null);
    const inputImage: Ref<File | FileList | null> = ref(null);
    const cropper: Ref<Cropper | null> = ref(null);
    const objectUrl: Ref<string | null> = ref(null);
    const previewCropped: Ref<string | null> = ref(null);
    const maxCroppedWidth = ref(640);
    const maxCroppedHeight = ref(640);
    const launchCropperDialog = ref(false);
    const sourceRef: Ref<HTMLImageElement | null> = ref(null);
    const previewRef: Ref<HTMLImageElement | null> = ref(null);
    const $q = useQuasar();
    const flipXState = ref(1);
    const flipYState = ref(1);

    const maxFileSize = computed(() => {
      const size = fileSize(props.inputMaxFileSize, {
        output: 'string',
        round: 0,
        exponent: 1,
      });

      return size;
    });

    const updatePreview = function () {
      if (cropper.value) {
        const canvas = cropper.value.getCroppedCanvas({
          fillColor: '#fff',
          imageSmoothingQuality: 'medium',
        });

        previewCropped.value = canvas.toDataURL('image/png');
      }
    };

    const debouncedUpdatePreview = debounce(updatePreview, 100);

    const rotateLeft = function () {
      cropper.value?.rotate(-90);
    };

    const rotateRight = function () {
      cropper.value?.rotate(90);
    };

    const zoomIn = function () {
      cropper.value?.zoom(0.1);
    };

    const zoomOut = function () {
      cropper.value?.zoom(-0.1);
    };

    const flipX = function () {
      flipXState.value *= -1;
      cropper.value?.scaleX(flipXState.value);
    };

    const flipY = function () {
      flipYState.value *= -1;
      cropper.value?.scaleY(flipYState.value);
    };

    const cropFree = function () {
      cropper.value?.setAspectRatio(NaN);
    };

    const cropSquare = function () {
      cropper.value?.setAspectRatio(1);
    };

    const resetCropper = function () {
      cropper.value?.reset();
    };

    const setupCropper = function (file: File) {
      if (cropper.value) {
        cropper.value?.destroy();
      }

      if (objectUrl.value) {
        window.URL.revokeObjectURL(objectUrl.value);
      }

      if (!file) {
        cropper.value = null;
        objectUrl.value = null;
        previewCropped.value = null;
        return;
      }

      objectUrl.value = window.URL.createObjectURL(file);
      void nextTick(setupCropperInstance);
    };

    const setupCropperInstance = function () {
      if (sourceRef.value) {
        cropper.value = new Cropper(sourceRef.value, {
          autoCropArea: 1,
          crop: debouncedUpdatePreview,
          movable: false,
        });
      }
    };

    const startCropper = function (file: File) {
      console.log(file);
      if (!file) {
        previewCropped.value = null;
        return;
      }

      void nextTick(() => {
        launchCropperDialog.value = true;
        setupCropper(file);
      });
    };

    const finishCrop = function () {
      submitCroppedImage();
    };

    const submitCroppedImage = function () {
      // Exit if cropped canvas is invalid
      const canvas = cropper.value?.getCroppedCanvas({
        fillColor: '#fff',
        imageSmoothingQuality: 'medium',
        maxWidth: maxCroppedWidth.value,
        maxHeight: maxCroppedHeight.value,
      });
      if (!canvas) {
        return;
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File(
            [blob],
            `${snakeCase(props.inputLabel)}_${DateTime.now().toMillis()}`,
            {
              lastModified: DateTime.now().toMillis(),
              type: blob.type,
            }
          );

          void nextTick(() => {
            ctx.emit('finish-cropper', {
              file: file,
            });

            ctx.emit('update:modelValue', file);
          });
        }
      }, 'image/png');

      void nextTick(() => {
        launchDialogRef.value?.hide();
      });
    };

    const showRejectionDialog = function (
      event: Array<{ failedPropValidation: string; file: File }>
    ) {
      console.log(event);
      const reasons = event.map((reason) => {
        if (reason.failedPropValidation === 'max-file-size')
          return 'File exceeded the maximum file size of ' + maxFileSize.value;
      });

      $q.dialog({
        title: 'Warning',
        message: 'File was rejected. Reasons: ' + reasons.join('; '),
      });
    };

    return {
      launchCropperDialog,
      launchDialogRef,
      inputImage,
      qFileAttributes: ref({
        filled: props.inputFilled,
        stackLabel: previewCropped.value ? true : false,
        bottomSlots: props.inputBottomSlots,
        label: props.inputLabel,
        for: snakeCase(props.inputLabel),
        counter: props.inputCounter,
        clearable: props.inputClearable,
        useChips: props.inputUseChips,
        accept: props.inputAccept,
        maxFileSize: props.inputMaxFileSize,
        class: props.inputClass,
      }),
      qDialogAttributes: ref({}),
      startCropper,
      cropper,
      cardExpanded: ref(false),
      rotateLeft,
      rotateRight,
      zoomIn,
      zoomOut,
      flipX,
      flipY,
      cropFree,
      cropSquare,
      sourceRef,
      previewRef,
      finishCrop,
      resetCropper,
      showRejectionDialog,
      objectUrl,
      previewCropped,
      qPreviewDialogAttributes: ref({}),
      previewDialogRef,
      previewDialog: ref(false),
    };
  },
});
</script>

<style lang="scss">
.cropper-wrapper {
  width: 100%;
  .cropper-preview {
    display: block;
    max-width: 100%;
  }

  .image-preview {
    max-height: 80%;
  }

  .image-source {
    max-height: 60vh;
  }

  /* .image-source .cropper-preview,
  .cropper-container.cropper-bg {
    max-height: 50% !important;
  } */

  .cropper-container {
    max-height: 60% !important;
  }
}
</style>
