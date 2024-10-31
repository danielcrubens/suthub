<template>
  <div class="  grid lg:grid-cols-2 items-center  gap-4">
    <div>
      <label>Renda Mensal</label>
      <div class=" relative rounded-md shadow-sm">
      <Input placeholder="R$ 00,00"
        variant="primary"
          type="text"
          :value="incomeInputValue"
          @input="formatCurrency"
          :class="{ 'border-red-500': errors.monthlyIncome }"
        />
      </div>
      <p v-if="errors.monthlyIncome" class="mt-1 text-sm text-red-600">{{ errors.monthlyIncome }}</p>
    </div>

    <div>
      <label >CEP</label>
      <Input 
        variant="primary"
        type="text"
        v-model="formData.cep"
        @input="formatCEP"
        maxlength="9"
        placeholder="00000-000"
        :class="{ 'border-red-500': errors.cep }"
        :disabled="loading"
      />
      <p v-if="errors.cep" class="mt-1 text-sm text-red-600">{{ errors.cep }}</p>
    </div>

    <div>
      <label>Rua</label>
      <Input 
        variant="primary"
        type="text"
        v-model="formData.street"
        placeholder="Av. das Nações Unidas"
        :class="{ 'border-red-500': errors.street }"
        :disabled="loading"
      />
      <p v-if="errors.street" class="mt-1 text-sm text-red-600">{{ errors.street }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Bairro</label>
      <Input 
        variant="primary"
        type="text"
        v-model="formData.neighborhood"
        placeholder="Centro"
        :class="{ 'border-red-500': errors.neighborhood }"
        :disabled="loading"
      />
      <p v-if="errors.neighborhood" class="mt-1 text-sm text-red-600">{{ errors.neighborhood }}</p>
    </div>

    <div>
      <label >Cidade</label>
      <Input 
        variant="primary"
        type="text"
        v-model="formData.city"
        placeholder="São Paulo"
        :class="{ 'border-red-500': errors.city }"
        :disabled="loading"
      />
      <p v-if="errors.city" class="mt-1 text-sm text-red-600">{{ errors.city }}</p>
    </div>

    <div>
      <label>Estado</label>
      <Input 
        variant="primary"
        type="text"
        v-model="formData.state"
        maxlength="2"
        placeholder="SP"
        :class="{ 'border-red-500': errors.state }"
        :disabled="loading"
        @input="(e) => formData.state = (e.target as HTMLInputElement).value.toUpperCase()"
      />
      <p v-if="errors.state" class="mt-1 text-sm text-red-600">{{ errors.state }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { masks } from "@/utils/masks";
import { useCep } from '@/composables/useCep';
import Input from '@/components/forms/ui/Input.vue';


const props = defineProps<{
  modelValue: {
    monthlyIncome: number;
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  }
}>();

const emit = defineEmits(['update:modelValue']);

// Initialize formData with proper reactive reference
const formData = ref({
  monthlyIncome: props.modelValue.monthlyIncome,
  cep: props.modelValue.cep,
  street: props.modelValue.street,
  neighborhood: props.modelValue.neighborhood,
  city: props.modelValue.city,
  state: props.modelValue.state
});

const { fetchAddress } = useCep();

const errors = ref({
  monthlyIncome: '',
  cep: '',
  street: '',
  neighborhood: '',
  city: '',
  state: ''
});

const loading = ref(false);
const incomeInputValue = ref(props.modelValue.monthlyIncome ? masks.currency(props.modelValue.monthlyIncome) : '');

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  formData.value = { ...newValue };
  if (newValue.monthlyIncome) {
    incomeInputValue.value = masks.currency(newValue.monthlyIncome);
  }
}, { deep: true });

// Watch for local changes and emit updates
watch(formData, (newValue) => {
  emit('update:modelValue', newValue);
}, { deep: true });

// Clear CEP error when CEP changes
watch(() => formData.value.cep, () => {
  errors.value.cep = '';
});

const formatCEP = (event: Event) => {
  const input = event.target as HTMLInputElement;
  input.value = masks.cep(input.value);
  formData.value.cep = input.value;
  
  if (input.value.length === 9) {
    searchCEP();
  }
};

const formatCurrency = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/\D/g, '');
  const numberValue = Number(value) / 100;
  formData.value.monthlyIncome = numberValue;
  incomeInputValue.value = masks.currency(numberValue);
  
  // Clear income error when value changes
  errors.value.monthlyIncome = '';
};

const searchCEP = async () => {
  if (formData.value.cep.length !== 9) return;
  
  loading.value = true;
  errors.value.cep = ''; // Clear CEP error before search
  
  try {
    const address = await fetchAddress(formData.value.cep);
    
    if (!address) {
      errors.value.cep = 'CEP não encontrado';
      return;
    }
    
    formData.value.street = address.logradouro || '';
    formData.value.neighborhood = address.bairro || '';
    formData.value.city = address.localidade || '';
    formData.value.state = address.uf || '';
    
    // Clear related field errors when address is found
    errors.value.street = '';
    errors.value.neighborhood = '';
    errors.value.city = '';
    errors.value.state = '';
  } catch (error) {
    console.error('Error searching CEP:', error);
    errors.value.cep = 'CEP não encontrado';
    
    // Clear address fields on error
    formData.value.street = '';
    formData.value.neighborhood = '';
    formData.value.city = '';
    formData.value.state = '';
  } finally {
    loading.value = false;
  }
};

// Expose validateStep method to parent component
defineExpose({
  validateStep: () => {
    let isValid = true;
    errors.value = {
      monthlyIncome: '',
      cep: '',
      street: '',
      neighborhood: '',
      city: '',
      state: ''
    };

    // Validate monthly income
    if (!formData.value.monthlyIncome || formData.value.monthlyIncome < 1000) {
      errors.value.monthlyIncome = 'Renda mínima de R$ 1.000,00';
      isValid = false;
    }

    // Validate CEP
    if (!formData.value.cep || formData.value.cep.length !== 9) {
      errors.value.cep = 'CEP inválido';
      isValid = false;
    }

    // Validate address fields
    if (!formData.value.street?.trim()) {
      errors.value.street = 'Rua é obrigatória';
      isValid = false;
    }

    if (!formData.value.neighborhood?.trim()) {
      errors.value.neighborhood = 'Bairro é obrigatório';
      isValid = false;
    }

    if (!formData.value.city?.trim()) {
      errors.value.city = 'Cidade é obrigatória';
      isValid = false;
    }

    if (!formData.value.state?.trim() || formData.value.state.length !== 2) {
      errors.value.state = 'Estado deve ter 2 letras';
      isValid = false;
    }

    return isValid;
  }
});
</script>