<template>
  <div class="space-y-4">
    <div>
      <label>Nome Completo</label>
      <Input 
        variant="primary"
        type="text" 
        v-model="formData.fullName" 
        @input="handleInput('fullName')"
        placeholder="Daniel Rubens"
        :class="{ 'border-red-500': errors.fullName }" 
      />
      <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">{{ errors.fullName }}</p>
    </div>

    <div>
      <label>CPF</label>
   <Input 
        variant="primary"
        type="text" 
        v-model="formData.cpf" 
        @input="formatCPF"
        maxlength="14" 
        placeholder="000.000.000-00"
        :class="{ 'border-red-500': errors.cpf }" 
      />
      <p v-if="errors.cpf" class="mt-1 text-sm text-red-600">{{ errors.cpf }}</p>
    </div>

    <div>
      <label>Data de Nascimento</label>
      <Input 
      variant="primary" 
        type="date" 
        v-model="formData.birthDate"
        @input="handleInput('birthDate')"
        :class="{ 'border-red-500': errors.birthDate }" 
      />
      <p v-if="errors.birthDate" class="mt-1 text-sm text-red-600">{{ errors.birthDate }}</p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';
import { masks } from '@/utils/masks';
import { validators } from '@/utils/validators';
import Input from '@/components/forms/ui/Input.vue';

const props = defineProps<{
  modelValue: {
    birthDate: string;
    fullName: string;
    cpf: string;
  }
}>();

const emit = defineEmits(['update:modelValue']);

const formData = ref({ ...props.modelValue });
const errors = ref({ birthDate: '', fullName: '', cpf: '' });

watch(() => props.modelValue, (newValue) => {
  formData.value = { ...newValue };
}, { deep: true });

watch(formData, (newValue) => {
  emit('update:modelValue', { ...newValue });
}, { deep: true });

const handleInput = (field: keyof typeof errors.value) => {
  if (errors.value[field]) {
    errors.value[field] = '';
  }
};

defineExpose({
  validateStep: () => {
    let isValid = true;
    errors.value = { birthDate: '', fullName: '', cpf: '' };

    if (!formData.value.birthDate) {
      errors.value.birthDate = 'Data de nascimento é obrigatória';
      isValid = false;
    } else if (!validators.validateAge(formData.value.birthDate)) {
      errors.value.birthDate = 'Idade deve ser entre 18 e 65 anos';
      isValid = false;
    }

    if (!formData.value.fullName.trim()) {
      errors.value.fullName = 'Nome é obrigatório';
      isValid = false;
    } else if (formData.value.fullName.trim().split(' ').length < 2) {
      errors.value.fullName = 'Digite seu nome completo';
      isValid = false;
    }

    if (!formData.value.cpf.trim()) {
      errors.value.cpf = 'CPF é obrigatório';
      isValid = false;
    } else if (!validators.validateCPF(formData.value.cpf)) {
      errors.value.cpf = 'CPF inválido';
      isValid = false;
    }

    return isValid;
  }
});

const formatCPF = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = masks.cpf(input.value);
  formData.value.cpf = input.value;
  handleInput('cpf');
};
</script>
