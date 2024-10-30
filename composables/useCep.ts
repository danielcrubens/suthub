import type { Address } from '@/types'
import type { ViaCEPResponse } from '@/types'

export const useCep = () => {
  const fetchAddress = async (cep: string): Promise<Address> => {
    try {
      const cleanCep = cep.replace(/\D/g, '')
      const response = await $fetch<ViaCEPResponse>(`https://viacep.com.br/ws/${cleanCep}/json/`)

      console.log('CEP data:', response)

      if (response.erro) {
        throw new Error('CEP não encontrado')
      }

      return response
    } catch (error) {
      console.error('Error fetching CEP:', error)
      throw error
    }
  }

  return {
    fetchAddress,
  }
}
