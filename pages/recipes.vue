<template>
  <div class="container mx-auto my-8 px-4">
    <h1 class="text-3xl text-blue-600  font-bold mb-4 px-5">Galeria de Receitas</h1>

    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-600">Carregando receitas...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <div class="text-red-500 mb-4">{{ error }}</div>
      <button @click="handleRetry"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
        Tentar novamente
      </button>
    </div>

    <template v-else>
      <TagFilter :available-tags="availableTags" v-model:selected-tags="selectedTags" @clear="handleClearTags" />

      <div v-if="filteredRecipes.length === 0" class="text-center flex mx-auto justify-center py-8">
        <div class="text-gray-500 text-lg">
          Nenhuma receita encontrada com as tags selecionadas.
          <img class="h-80 w-full"src="@/assets/images/searching.svg" alt="Imagem de pesquisa">
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 px-5">
        <DialogRoot v-for="recipe in filteredRecipes" :key="recipe.id">
          <DialogTrigger class="w-full text-left">
            <div
              class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 rounded-md border border-gray-300 shadow-md hover:shadow-lg transition-shadow p-3">
              <div>
                <img :src="recipe.image" alt="Imagem da receita" class="w-full h-40 object-cover rounded-lg" />
              </div>

              <div class="flex flex-col justify-between p-2">
                <h2 class="text-xl font-bold">{{ recipe.name }}</h2>
                <p>Tempo de preparo: {{ recipe.prepTimeMinutes }} min</p>
                <p>Tempo de cozimento: {{ recipe.cookTimeMinutes }} min</p>
                <p>Dificuldade: {{ recipe.difficulty }}</p>
                <div class="mt-1">
                  <span v-for="tag in recipe.tags" :key="tag"
                    class="tag">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay class="fixed  inset-0 z-[99] bg-black bg-opacity-50 backdrop-blur-sm" />
            <DialogContent
              class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[750px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-xl focus:outline-none z-[100] overflow-y-auto">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
                <div>
                  <img :src="recipe.image" alt="Imagem da receita" class="w-full h-48 object-cover rounded-lg" />
                </div>

                <div class="flex flex-col justify-between ">
                  <DialogTitle class="text-2xl font-bold ">
                    {{ recipe.name }}
                  </DialogTitle>
                  <div class="space-y-2">
                    <div class="flex gap-2 items-center">
                      <p>Porções:</p>
                      <div class="flex">
                        <Salad v-for="n in recipe.servings" :key="n" class="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                    <div class="mt-4">
                      <span v-for="tag in recipe.tags" :key="tag"
                        class="tag">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="lg:col-span-2">
                  <DialogDescription class="text-gray-700">
                    <h3 class="text-xl font-semibold mb-2">Ingredientes:</h3>
                    <ol class="list-decimal pl-5 mb-4">
                      <li v-for="(ingredient, index) in recipe.ingredients" :key="ingredient">
                        {{ index + 1 }}. {{ ingredient }}
                      </li>
                    </ol>

                    <h3 class="text-xl font-semibold mb-2">Instruções:</h3>
                    <ol class="list-decimal pl-5">
                      <li v-for="(step, index) in recipe.instructions" :key="index" class="mb-2">
                        {{ index + 1 }}. {{ step }}
                      </li>
                    </ol>
                  </DialogDescription>

                </div>
              </div>

              <DialogClose
                class="absolute top-4 right-4 p-2"
                aria-label="Fechar">
                <X color="red" class="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      </div>
    </template>
  </div>
</template>

<style>
p, h2{
  @apply text-blue-600;
}
.tag{
  @apply inline-block bg-gray-200 rounded-md px-3 py-1 text-blue-600 text-sm font-medium mr-2;
}
</style>

<script setup>
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'
import { onMounted } from 'vue'
import TagFilter from '@/components/TagFilter.vue'
import { Salad, X } from 'lucide-vue-next';

import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'radix-vue'

const { fetchRecipes } = useApi()

const recipes = ref([])
const selectedTags = ref([])
const isLoading = ref(false)
const error = ref(null)

// Obtém todas as tags únicas das receitas
const availableTags = computed(() => {
  return [...new Set(recipes.value.flatMap((recipe) => recipe.tags))].sort()
})

// Carrega as receitas da API
const loadRecipes = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await fetchRecipes()
    recipes.value = data.recipes
  } catch (err) {
    error.value = 'Erro ao carregar as receitas. Por favor, tente novamente mais tarde.'
    console.error('Erro ao carregar as receitas:', err)
  } finally {
    isLoading.value = false
  }
}

// Filtra as receitas
const filteredRecipes = computed(() => {
  if (selectedTags.value.length === 0) {
    return recipes.value
  }
  return recipes.value.filter((recipe) =>
    selectedTags.value.every((tag) => recipe.tags.includes(tag))
  )
})

// Handler para limpar tags
const handleClearTags = () => {
  selectedTags.value = []
}

// Tenta carregar as receitas novamente
const handleRetry = () => {
  loadRecipes()
}

onMounted(() => {
  loadRecipes()
})
</script>