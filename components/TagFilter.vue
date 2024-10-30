<template>
  <div class="relative mb-6  px-5 " ref="dropdownRef">
    <div class="flex items-center gap-2">
      <Button variant="primary" @click="toggleDropdown">
        Filtrar Tags
        <span v-if="selectedTags.length > 0" class="ml-2 bg-white text-blue-500 px-2 rounded-full">
          {{ selectedTags.length }}
        </span>
        <Filter :size="17" />

      </Button>
      <Button variant="filter" v-if="selectedTags.length > 0" @click="clearTags">
        Limpar filtros
      </Button>
    </div>


    <div v-if="isTagsDropdownOpen" class="absolute z-10 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200">
      <div class="p-2 max-h-60 overflow-y-auto">
        <div v-for="tag in availableTags" :key="tag" @click="toggleTag(tag)"
          class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer">
          <input type="checkbox" :checked="selectedTags.includes(tag)"
            class="form-checkbox h-4 w-4 text-blue-500 rounded" @click.stop>
          <span class="ml-2">{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onMounted, onUnmounted } from 'vue';
import Button from '@/components/forms/ui/Buttons.vue';
import { Filter } from 'lucide-vue-next';



const props = defineProps({
  availableTags: {
    type: Array,
    required: true
  },
  selectedTags: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:selectedTags', 'clear']);

const isTagsDropdownOpen = ref(false);
const dropdownRef = ref(null);

// Toggle tag seleção
const toggleTag = (tag) => {
  const newSelectedTags = [...props.selectedTags];
  const index = newSelectedTags.indexOf(tag);

  if (index === -1) {
    newSelectedTags.push(tag);
  } else {
    newSelectedTags.splice(index, 1);
  }

  emit('update:selectedTags', newSelectedTags);
};

// Toggle dropdown
const toggleDropdown = () => {
  isTagsDropdownOpen.value = !isTagsDropdownOpen.value;
};

// Limpa as tags selecionadas
const clearTags = () => {
  emit('clear');
};

// Fecha o dropdown quando clicar fora
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isTagsDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
