<template>
  <div class="container mx-auto my-8 px-4">
    <div class="flex justify-between items-center mb-4 px-5">
      <h1 class="text-3xl text-blue-600 font-bold">{{ title }}</h1>
      <div class="flex space-x-4">
        <NuxtLink to="/recipes">
          <Buttons :variant="currentRoute === '/recipes' ? 'secondary' : 'primary'">
            Receitas
          </Buttons>
        </NuxtLink>
        <NuxtLink to="/users">
          <Buttons :variant="currentRoute === '/users' ? 'secondary' : 'primary'">
            Usuários
          </Buttons>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Buttons from '~/components/forms/ui/Buttons.vue';


const props = defineProps({
  title: {
    type: String,
    required: true
  }
});

const route = useRoute();
const currentRoute = computed(() => route.path);
</script>