export interface PetFormData {
  birthDate: string;
  fullName: string;
  cpf: string;
  petType: 'cão' | 'gato';
  petBreed: string;
  customBreed?: string;
  monthlyIncome: number;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Address {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}
export interface User {
  id: number
  firstName: string
  lastName: string
  birthDate: string
  gender: string
  image: string
  address: {
    coordinates: {
      lat: number
      lng: number
    }
  }
}

export interface ApiResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}