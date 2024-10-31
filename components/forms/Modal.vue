<template>
  <div class="modal">
    <DialogRoot :open="show" @close="handleClose">
      <DialogOverlay class="fixed  inset-0 z-[99] bg-black bg-opacity-50 backdrop-blur-sm" />

      <DialogContent
        class="bg-white rounded-lg p-6  w-11/12 lg:w-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]  ">
        <DialogTitle class="text-2xl text-blue-600 font-bold mb-4 flex items-center gap-3">
          Confirmar Dados
          <UserCheck color="#0d114f" />
        </DialogTitle>

        <DialogDescription class="space-y-4">
          <div class="grid lg:grid-cols-2 gap-4">
            <div>
              <h3>Dados Pessoais</h3>
              <p><span>Nome:</span> {{ formData.fullName }}</p>
              <p><span>CPF:</span> {{ formData.cpf }}</p>
              <p><span>Data de Nascimento:</span> {{ formData.birthDate }}</p>
              <p><span>Renda Mensal:</span> {{ formattedIncome }}</p>
            </div>
            <div>
              <h3>Dados do Pet</h3>
              <p><span>Tipo:</span> {{ formData.petType }}</p>
              <p><span>Raça:</span> {{ displayBreed }}</p>
            </div>
          </div>

          <div>
            <h3>Endereço</h3>
            <p>{{ formData.street }}</p>
            <p>{{ formData.neighborhood }}</p>
            <p>{{ formData.city }} - {{ formData.state }}</p>
            <p>CEP: {{ formData.cep }}</p>
          </div>
        </DialogDescription>

        <div class="mt-6 flex justify-end space-x-6">
          <Button variant="secondary" @click="handleClose">
            Voltar
          </Button>
          <Button variant="primary" @click="handleConfirm">
            Confirmar e Continuar
            <Check />
          </Button>
        </div>
      </DialogContent>

    </DialogRoot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PetFormData } from '~/types';
import { masks } from "@/utils/masks";
import { UserCheck } from 'lucide-vue-next';
import { Check } from 'lucide-vue-next';
import {
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogOverlay,
  DialogDescription
} from 'radix-vue';
import Button from '@/components/forms/ui/Buttons.vue';

const props = defineProps<{
  show: boolean;
  formData: PetFormData;
}>();

const emit = defineEmits(['close', 'confirm']);

const formattedIncome = computed(() => {
  return masks.currency(props.formData.monthlyIncome);
});

const displayBreed = computed(() => {
  return props.formData.petBreed === 'outro'
    ? props.formData.customBreed
    : props.formData.petBreed;
});

const handleConfirm = () => {
  emit('confirm');
};

const handleClose = () => {
  emit('close');
};
</script>
