<template>
  <input :class="inputClasses" :value="modelValue" @input="updateValue($event.target.value)" v-bind="$attrs" />
  <slot />
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: String,
  variant: {
    type: String,
    default: 'primary',
  },
});

const emit = defineEmits(['update:modelValue']);

const inputClasses = computed(() => {
  return [
    'mt-1 block w-full rounded-md border border-[1px] p-2.5 shadow-sm focus:outline-none text-gray-500',
    props.variant === 'primary' ? 'focus:border-blue-500 focus:ring-1 focus:shadow-md focus:ring-blue-500 ' : '',
  ].join(' ');

});

const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>
