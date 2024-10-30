import type { User, ApiResponse } from '@/types'

export const useApi = () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const data = await $fetch<ApiResponse>('https://dummyjson.com/users', {
        headers: {
          'Accept': 'application/json'
        },
        // Tratamento de erros
        onResponse({ response }) {
          if (response._data.users) {
            users.value = response._data.users.sort((a: User, b: User) => 
              `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
            )
          }
        },
        onResponseError({ response }) {
          error.value = `Erro ${response.status}: ${response.statusText}`
        }
      })
    } catch (e) {
      error.value = 'Erro ao carregar usuários'
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers
  }
}
