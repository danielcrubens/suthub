<template>
  <button :class="{
    'gap-3 flex justify-center items-center rounded-md': true,
    ...variantClass,
    ...sizeClass
  }" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator(value) {
      return ['primary', 'secondary'].includes(value);
    },
  },
  size: {
    type: String,
    default: 'default',
    validator(value) {
      return ['default', 'full'].includes(value);
    },
  },
});

const variantClass = computed(() => ({
  'bg-blue text-white  hover:brightness-90 font-medium': props.variant === 'primary',
  'border border-blue rounded-md text-blue font-medium hover:bg-gray-50': props.variant === 'secondary',
  'text-sm text-gray-500 hover:text-gray-700': props.variant === 'filter',

}));

const sizeClass = computed(() => ({
  'w-auto px-6 py-2': props.size === 'default',
}));
</script>