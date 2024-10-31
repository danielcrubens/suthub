# 📝 Documentação

## Visão Geral
Aplicação web que seja capaz de operar e obter
dados de uma API pública ( https://dummyjson.com/ ) para apresentação em tela,
além de solicitar um cadastro offline para fins de validação de dados.


 

## :rocket:  Tecnologias utilizadas
Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Nuxt](https://nuxt.com/) (Interface)
- [TypeScript](https://www.typescriptlang.org/) (Tipagem estática)
- [Radix Vue](https://www.radix-vue.com/) (Headless UI)
- [Zod](https://zod.dev/) (Validação)


## :page_facing_up: Componentes Principais

### 1 - Composables useApi
#### O que ele faz?
 Função para pegar receitas de uma API  

Principais funções:
- Conecta-se a uma API externa 
- Busca dados de receitas de forma assíncrona
- Retorna os dados baixados
- Trata possíveis erros durante a busca

Fluxo básico:

- Quando chamado, tenta buscar dados de receitas
- Se conseguir, retorna os dados
Se der erro, mostra o erro no console e interrompe a operação

### 2 - Composables useCep
#### O que ele faz?
 Função para buscar dados de endereço usando um CEP como referência

Principais funções:

- Recebe um CEP como entrada
- Limpa o CEP, removendo caracteres não numéricos
- Busca informações de endereço na API ViaCEP
- Valida se o CEP existe
- Retorna os dados do endereço

Fluxo básico:

- Recebe o CEP como parâmetro
- Limpa o CEP (remover caracteres não numéricos)
- Faz uma requisição para a API ViaCEP
- Verifica se a resposta contém erro
- Retorna os dados do endereço ou lança um erro

### 3 - Composables useUser
#### O que ele faz?
Gerencia a busca de usuários, com estados de carregamento, erro e lista de usuários

Principais funções:
- Busca a lista de usuários na API
- Carregamento de dados
- Ordena os usuários por  ordem alfabetica
- Gerenciamento de estados
- Manipula possíveis erros

Fluxo básico:
- Carregamento dados usuários
- Busca lista de usuário de uma API externa
- Ordena usuários por nome completo
- Trata possíveis erros durante a requisição

### 1 - Components StepOne
#### O que ele faz?
Coleta informações pessoais básicas do usuário

Principais funções:
- Capturar nome completo
- Registrar CPF
- Registrar data de nascimento

Fluxo básico:
- Usuário preenche os campos
- Faz validações em tempo real:

### 2 - Components StepTwo
#### O que ele faz?
Coleta informações sobre o pet do usuário

Principais Funções:
- Seleciona tipo de pet (cão/gato)
- Escolhe raça do pet

Fluxo Básico:
- Usuário seleciona tipo de pet
- Lista de raças muda conforme tipo
- Valida se tipo e raça foram preenchidos
- Mostra erros de validação em vermelho

### 3 - Components StepThree
#### O que ele faz?
Coleta informações financeiras e endereço do usuário

Principais Funções:
- Coleta renda mensal
- Buscar endereço por CEP
- Preencher dados de endereço automaticamente

Fluxo Básico:

- Usuário digita renda
- Formata valor monetário automaticamente
- Digita CEP
- Busca automática de endereço 
- Preenche campos de endereço
- Validação dos campos


## 💾 Instalação

Instale todas as dependências do projeto

```
npm install
```

Rode a aplicação

```
npm run dev
```


