<template>
  <div>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-12">
      <div class="flex lg:h-screen justify-center items-center">
        <img class="w-full max-h-96 mx-auto hidden lg:block" :src="currentStepImage"
          :alt="`Step ${currentStep} illustration`" />
      </div>
      <div class="h-screen mt-20 justify-center ">
        <ProgressBar :current-step="currentStep" :step-titles="stepTitles" :step-icons="stepIcons" />

        <div class="bg-white shadow-xl rounded-lg p-6">
          <keep-alive>
            <StepOne v-if="currentStep === 1" ref="stepOneRef" :model-value="{
              birthDate: formData.birthDate,
              fullName: formData.fullName,
              cpf: formData.cpf
            }" @update:model-value="updateStepOne" />

            <StepTwo v-else-if="currentStep === 2" ref="stepTwoRef" :model-value="{
              petType: formData.petType,
              petBreed: formData.petBreed,
              customBreed: formData.customBreed
            }" @update:model-value="updateStepTwo" />

            <StepThree v-else ref="stepThreeRef" :model-value="{
              monthlyIncome: formData.monthlyIncome,
              cep: formData.cep,
              street: formData.street,
              neighborhood: formData.neighborhood,
              city: formData.city,
              state: formData.state
            }" @update:model-value="updateStepThree" />
          </keep-alive>

          <div class="mt-8 flex justify-between lg:gap-40 ">
            <Button variant="secondary" size="default" v-if="currentStep > 1" @click="handleBack">
              Voltar
            </Button>
            <div v-else />
            <Button variant="primary" size="default" @click="handleNext">
              {{ currentStep === 3 ? 'Finalizar' : 'Próximo' }}
              <ArrowRight />
            </Button>

          </div>
        </div>
        <Modal :show="showModal" :form-data="formData" @close="handleCloseModal" @confirm="handleConfirm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { PetFormData } from '@/types';
import { formSchema } from '@/schemas/form';
import StepOne from '@/components/forms/StepOne.vue';
import StepTwo from '@/components/forms/StepTwo.vue';
import StepThree from '@/components/forms/StepThree.vue';
import Modal from '@/components/forms/Modal.vue';
import ProgressBar from '@/components/forms/ProgressBar.vue';
import { ArrowRight } from 'lucide-vue-next';
import Button from '@/components/forms/ui/Buttons.vue';
import { User, Dog, Home } from 'lucide-vue-next';
import stepOneImage from '@/public/steps.svg'
import stepTwoImage from '@/public/pet.svg'
import stepThreeImage from '@/public/address.svg'


const stepImages = {
  1: stepOneImage,
  2: stepTwoImage,
  3: stepThreeImage,
};
// Propriedade calculada para a imagem da etapa atual
const currentStepImage = computed(() => {
  return stepImages[currentStep.value as keyof typeof stepImages];
});



const currentStep = ref(1);
const showModal = ref(false);
const router = useRouter();

const formData = reactive<PetFormData>({
  birthDate: '',
  fullName: '',
  cpf: '',
  petType: '',
  petBreed: '',
  customBreed: '',
  monthlyIncome: 0,
  cep: '',
  street: '',
  neighborhood: '',
  city: '',
  state: ''
});

// Referências para os componentes de formulário
const stepOneRef = ref();
const stepTwoRef = ref();
const stepThreeRef = ref();

const stepTitles = {
  1: 'Dados Pessoais',
  2: 'Informações do Pet',
  3: 'Endereço e Renda'
};

const stepIcons = {
  1: User,
  2: Dog,
  3: Home,
};

const validateCurrentStep = async () => {
  const stepRefs = {
    1: stepOneRef,
    2: stepTwoRef,
    3: stepThreeRef
  };

  const currentRef = stepRefs[currentStep.value as keyof typeof stepRefs];
  if (currentRef.value?.validateStep) {
    return currentRef.value.validateStep();
  }
  return false;
};

const handleNext = async () => {
  console.log('Current form data:', formData);

  const isValid = await validateCurrentStep();
  if (!isValid) {
    return;
  }

  if (currentStep.value < 3) {
    currentStep.value++;
  } else {
    try {
      // Validação final usando Zod
      formSchema.parse(formData);
      showModal.value = true;
    } catch (error) {
      console.error('Validation error:', error);
      alert('Por favor, verifique todos os campos do formulário.');
    }
  }
};

const handleBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleConfirm = () => {
  console.log('Form submitted:', formData);
  router.push('/recipes');
};

const handleCloseModal = () => {
  showModal.value = false;
};



// Handlers para atualização dos dados do formulário
const updateStepOne = (data: { birthDate: string; fullName: string; cpf: string }) => {
  formData.birthDate = data.birthDate;
  formData.fullName = data.fullName;
  formData.cpf = data.cpf;
};

const updateStepTwo = (data: { petType: 'cão' | 'gato'; petBreed: string; customBreed?: string }) => {
  formData.petType = data.petType;
  formData.petBreed = data.petBreed;
  formData.customBreed = data.customBreed;
};

const updateStepThree = (data: {
  monthlyIncome: number;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}) => {
  formData.monthlyIncome = data.monthlyIncome;
  formData.cep = data.cep;
  formData.street = data.street;
  formData.neighborhood = data.neighborhood;
  formData.city = data.city;
  formData.state = data.state;
};
</script>
