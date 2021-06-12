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
    <template #before>
      <q-icon name="attach_file" />
    </template>

    <template #after>
      <q-icon
        v-if="previewCropped"
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
    <q-card class="my-card">
      <img
        ref="sourceRef"
        :src="objectUrl"
        alt="Source image preview"
        class="image-source cropper-preview"
      />

      <q-card-section class="text-subitle2">
        <q-card-actions align="center">
          <q-btn
            flat
            color="primary"
            icon="refresh"
            label="Reset"
            @click.prevent="resetCropper"
          />
          <q-btn
            flat
            color="primary"
            icon="rotate_left"
            label="Rotate Left"
            @click.prevent="rotateLeft"
          />
          <q-btn
            flat
            color="primary"
            icon="rotate_right"
            label="Rotate Right"
            @click.prevent="rotateRight"
          />
          <q-btn
            flat
            color="primary"
            icon="zoom_in"
            label="Zoom In"
            @click.prevent="zoomIn"
          />
          <q-btn
            flat
            color="primary"
            icon="zoom_out"
            label="Zoom Out"
            @click.prevent="zoomOut"
          />
        </q-card-actions>
      </q-card-section>

      <q-card-section class="text-subitle2">
        <q-card-actions align="right">
          <q-btn
            flat
            color="primary"
            icon="save"
            label="Finish"
            @click.prevent="finishCrop"
          />
          <q-btn flat color="warning" icon="cancel" label="Cancel" />
          <q-btn
            color="grey"
            flat
            dense
            :icon="cardExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="cardExpanded = !cardExpanded"
          />
        </q-card-actions>
      </q-card-section>

      <q-slide-transition>
        <div v-show="cardExpanded">
          <q-separator />
          <q-card-section class="text-subitle2">
            <img
              v-if="previewCropped"
              ref="previewRef"
              :src="previewCropped"
              alt="Cropped image preview"
              class="image-preview cropper-preview"
            />
          </q-card-section>
        </div>
      </q-slide-transition>
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

export default defineComponent({
  components: {},
  props: {
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
    inputFor: {
      type: String,
      default: 'profile_picture',
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
  emits: ['finish-cropper'],
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
          aspectRatio: 1,
          crop: debouncedUpdatePreview,
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
            `${props.inputFor}_${DateTime.now().toMillis()}`,
            {
              lastModified: DateTime.now().toMillis(),
              type: blob.type,
            }
          );

          void nextTick(() => {
            ctx.emit('finish-cropper', {
              file: file,
            });
          });
        }
      }, 'image/png');

      void nextTick(() => {
        launchDialogRef.value?.hide();
      });
    };

    const resetCropper = function () {
      cropper.value = null;
      previewCropped.value = null;
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
        message: 'File was rejected. Reasaons: ' + reasons.join('; '),
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
        for: props.inputFor,
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

<style>
.cropper-preview {
  display: block;
  max-width: 100%;
}

.image-preview {
  max-height: 80%;
}

.image-source {
  max-height: 50%;
}
</style>
