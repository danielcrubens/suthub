<template>
  <div class="space-y-4">
    <div>
      <label>Espécie do Pet</label>
      <Select v-model="formData.petType" :class="{ 'border-red-500': errors.petType }">
        <option value="">Selecione</option>
        <option value="cão">Cão</option>
        <option value="gato">Gato</option>
      </Select>
      <p v-if="errors.petType" class="mt-1 text-sm text-red-600">{{ errors.petType }}</p>
    </div>

    <div v-if="formData.petType">
      <label>Raça do Pet</label>
      <Select v-model="formData.petBreed" :class="{ 'border-red-500': errors.petBreed }">
        <option value="">Selecione</option>
        <option v-for="breed in availableBreeds" :key="breed" :value="breed">
          {{ breed }}
        </option>
      </Select>
      <p v-if="errors.petBreed" class="mt-1 text-sm text-red-600">{{ errors.petBreed }}</p>
    </div>

    <div v-if="formData.petBreed === 'outro'">
      <label>Outra Raça</label>
      <input type="text" v-model="formData.customBreed" :class="{ 'border-red-500': errors.customBreed }"
        placeholder="Digite a raça do pet" />
      <p v-if="errors.customBreed" class="mt-1 text-sm text-red-600">{{ errors.customBreed }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Select from '@/components/forms/ui/Select.vue';


const props = defineProps<{
  modelValue: {
    petType: string;
    petBreed: string;
    customBreed?: string;
  }
}>();

const emit = defineEmits(['update:modelValue']);

// Initialize formData with a reactive reference
const formData = ref({
  petType: props.modelValue.petType,
  petBreed: props.modelValue.petBreed,
  customBreed: props.modelValue.customBreed || ''
});

const errors = ref({
  petType: '',
  petBreed: '',
  customBreed: ''
});

const dogBreeds = [
  'Labrador',
  'Golden Retriever',
  'Pastor Alemão',
  'Bulldog',
  'Poodle',
  'outro'
];

const catBreeds = [
  'Persa',
  'Siamês',
  'Maine Coon',
  'Ragdoll',
  'Bengal',
  'outro'
];

const availableBreeds = computed(() => {
  return formData.value.petType === 'cão' ? dogBreeds : catBreeds;
});

// Watch for prop changes and update local state
watch(() => props.modelValue, (newValue) => {
  formData.value = {
    petType: newValue.petType,
    petBreed: newValue.petBreed,
    customBreed: newValue.customBreed || ''
  };
}, { deep: true });

// Watch for local changes and emit updates
watch(formData, (newValue) => {
  emit('update:modelValue', {
    petType: newValue.petType,
    petBreed: newValue.petBreed,
    customBreed: newValue.customBreed
  });
}, { deep: true });

// Reset breed when pet type changes
watch(() => formData.value.petType, () => {
  formData.value.petBreed = '';
  formData.value.customBreed = '';
});

// Reset custom breed when breed changes
watch(() => formData.value.petBreed, (newValue) => {
  if (newValue !== 'outro') {
    formData.value.customBreed = '';
  }
});

// Validation cleanup watchers
watch(() => formData.value.petType, (newValue) => {
  if (newValue.trim()) errors.value.petType = '';
});

watch(() => formData.value.petBreed, (newValue) => {
  if (newValue.trim()) errors.value.petBreed = '';
});

watch(() => formData.value.customBreed, (newValue) => {
  if (newValue.trim()) errors.value.customBreed = '';
});

// Expose validateStep method to parent component
defineExpose({
  validateStep: () => {
    let isValid = true;
    errors.value = {
      petType: '',
      petBreed: '',
      customBreed: ''
    };

    if (!formData.value.petType.trim()) {
      errors.value.petType = 'Selecione o tipo do pet';
      isValid = false;
    }

    if (!formData.value.petBreed.trim()) {
      errors.value.petBreed = 'Selecione a raça do pet';
      isValid = false;
    }

    if (formData.value.petBreed === 'outro' && !formData.value.customBreed?.trim()) {
      errors.value.customBreed = 'Digite a raça do pet';
      isValid = false;
    }

    return isValid;
  }
});
</script>
