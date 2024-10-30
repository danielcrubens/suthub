import { z } from 'zod';
import { validators } from '~/utils/validators';

export const formSchema = z.object({
  birthDate: z.string().refine(
    (date) => validators.validateAge(date),
    { message: 'Idade deve ser entre 18 e 65 anos' }
  ),
  fullName: z.string().min(1).refine(
    (name) => name.trim().split(' ').length >= 2,
    { message: 'Digite seu nome completo' }
  ),
  cpf: z.string().refine(
    (cpf) => validators.validateCPF(cpf),
    { message: 'CPF inválido' }
  ),
  petType: z.enum(['cão', 'gato']),
  petBreed: z.string().min(1, 'Selecione uma raça'),
  customBreed: z.string().optional(),
  monthlyIncome: z.number().min(1000, 'Renda mínima de R$ 1.000,00'),
  cep: z.string().length(9, 'CEP inválido'),
  street: z.string().min(1, 'Rua é obrigatória'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 letras').toUpperCase()
});