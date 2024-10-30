<template>
  <div class="mt-8">
    <div class="relative">
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#cccccc]">
        <div
          class="transition-all duration-500 ease-out h-full bg-blue"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      <div class="flex justify-between">
        <div
          v-for="step in 3"
          :key="step"
          class="text-sm flex items-center"
          :class="{
            'text-blue-600 font-bold': step <= props.currentStep,
            'text-gray-500 font-medium': step > props.currentStep
          }"
        >
        <!-- Renderiza o ícone correspondente -->
          <component :is="stepIcons[step] as typeof stepIcons[1] "/>
          <span class="ml-2">{{ stepTitles[step as keyof typeof stepTitles] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { User, Dog, Home } from 'lucide-vue-next'; 

interface Props {
  currentStep: number;
  stepTitles: {
    1: string;
    2: string;
    3: string;
  };
  stepIcons: {
    1: typeof User;
    2: typeof Dog;
    3: typeof Home;
  }
}

const props = defineProps<Props>();

const progressPercentage = computed(() => {
  return ((props.currentStep - 1) / 2) * 100;
});

// Mapear ícones para cada passo
const stepIcons = {
  1: User, 
  2: Dog,  
  3: Home, 
};
</script>
