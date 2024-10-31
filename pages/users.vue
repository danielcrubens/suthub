<template>
  <div class="container mx-auto px-4 py-8">
    <Header title="Usuários"/>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 py-6">
      <Input v-model="searchQuery" placeholder="Buscar por nome..." class="w-full" />

      <Select v-model="yearFilter">
        <option value="">Todos os anos</option>
        <option v-for="year in availableYears" :key="year" :value="year">
          {{ year }}
        </option>
      </Select>

      <Select v-model="genderFilter">
        <option value="">Todos os gêneros</option>
        <option value="male">Masculino</option>
        <option value="female">Feminino</option>
      </Select>

      <Buttons variant="filter" @click="clearFilters">
        Limpar Filtros
      </Buttons>
    </div>
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    <div v-else-if="error" class="text-red-500 bg-red-50 p-4 rounded-lg">
      {{ error }}
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        <thead class="ltr:text-left rtl:text-right">
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Data de Nascimento</th>
            <th>Gênero</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(user, index) in filteredUsers" :key="user.id"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
            <td>
              <img :src="user.image" :alt="`Foto de ${user.firstName}`"
                class="mx-auto w-16 h-16 rounded-full object-cover border-2 border-gray-200">
            </td>
            <td>
              {{ user.firstName }} {{ user.lastName }}
            </td>
            <td>
              {{ formatDate(user.birthDate) }}
            </td>
            <td>
              {{ user.gender === 'male' ? 'Masculino' : 'Feminino' }}
            </td>
            <td>
              <Buttons @click="openMaps(user.address.coordinates)" variant="secondary" class="mx-auto">
                Ver no Maps
                <MapPinCheckInside :size="17" />

              </Buttons>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="px-4 py-28 text-center text-lg">
              <p class="text-gray-500">Nenhum usuário encontrado com os filtros selecionados.</p>
              <img class="mx-auto h-80 w-full" src="@/assets/images/searching.svg" alt="">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
 <style scoped lang="css">
td {
  @apply whitespace-nowrap text-center px-4 py-2 text-gray-700;
}
th {
  @apply whitespace-nowrap px-4 py-2 font-medium text-blue-600;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useUser'
import Input from '@/components/forms/ui/Input.vue'
import Buttons from '@/components/forms/ui/Buttons.vue'
import Select from '@/components/forms/ui/Select.vue'
import { MapPinCheckInside } from 'lucide-vue-next';


const { users, loading, error, fetchUsers } = useApi()
const searchQuery = ref('')
const yearFilter = ref<string>('')
const genderFilter = ref<string>('')

// Computed para obter anos únicos das datas de nascimento
const availableYears = computed(() => {
  const years = users.value.map(user =>
    new Date(user.birthDate).getFullYear()
  )
  // Remove duplicatas e ordena em ordem decrescente
  return [...new Set(years)].sort((a, b) => b - a)
})

// Computed para filtrar os usuários
const filteredUsers = computed(() => {
  let filtered = users.value

  // Filtro por nome
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
    )
  }

  // Filtro por ano de nascimento
  if (yearFilter.value) {
    const selectedYear = parseInt(yearFilter.value)
    filtered = filtered.filter(user =>
      new Date(user.birthDate).getFullYear() === selectedYear
    )
  }

  // Filtro por gênero
  if (genderFilter.value) {
    filtered = filtered.filter(user =>
      user.gender === genderFilter.value
    )
  }

  return filtered
})

// Função para formatar a data
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Função para abrir o Maps
const openMaps = (coordinates: { lat: number, lng: number }) => {
  const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

// Função para limpar os filtros
const clearFilters = () => {
  searchQuery.value = ''
  yearFilter.value = ''
  genderFilter.value = ''
}

onMounted(() => {
  fetchUsers()
})
</script>