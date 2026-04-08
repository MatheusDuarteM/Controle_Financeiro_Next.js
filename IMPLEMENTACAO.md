# Instruções de Implementação - Controle Financeiro

## Pré-requisitos

Antes de rodar a aplicação, siga estes passos:

## 1. Instalar Dependências

```bash
npm install better-auth
```

Se o Better Auth já estava instalado, apenas certifique-se de que tem a versão correta:

```bash
npm list better-auth
```

## 2. Gerar Chave de Segurança para BETTER_AUTH_SECRET

Execute um dos comandos abaixo para gerar uma chave segura:

**No Windows (CMD):**

```cmd
powershell -Command "[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))"
```

**No Windows (PowerShell):**

```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**No Linux/Mac:**

```bash
openssl rand -base64 32
```

Copie o resultado e adicione ao `.env`:

```env
BETTER_AUTH_SECRET=<sua-chave-aqui>
```

## 3. Executar Migração do Banco de Dados

Com o comando abaixo, o Prisma criará as tabelas necessárias:

```bash
npx prisma migrate dev --name init
```

Responda `y` quando pedir confirmação.

**Estrutura do Banco de Dados Criada:**

- `users` - Usuários do Better Auth
- `accounts` - Contas sociais (Google, GitHub)
- `sessions` - Sessões ativas
- `verification_tokens` - Tokens de verificação
- `transactions` - Transações financeiras com mes/ano
- `profiles` - (Legacy) Compatibilidade

## 4. Verificar Banco de Dados

Para visualizar o banco no Supabase:

1. Acesse [supabase.com](https://supabase.com)
2. Faça login com sua conta
3. Abra o projeto "Controle Financeiro"
4. Vá em "SQL Editor" para verificar as tabelas

## 5. Iniciar a Aplicação

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## 6. Testar a Aplicação

### Criar Conta

1. Vá à página de Cadastro (`/cadastro`)
2. Preencha Nome, Email e Senha
3. Clique em "Criar Conta"

### Fazer Login

1. Vá à página de Login (`/login`)
2. Insira Email e Senha
3. Clique em "Entrar"

### Adicionar Transação

1. Após login, você estará no Dashboard
2. Use o seletor de mês (botões no topo)
3. Clique no botão "Nova Transação"
4. Preencha Descrição, Valor e Tipo
5. Clique em "Adicionar"

### Navegar por Meses

1. Os botões no topo mostram meses com transações
2. Clique em qualquer mês para visualizar aquele período
3. Os gráficos atualizam automaticamente

## Variáveis de Ambiente Necessárias

Seu `.env` deve ter:

```env
# Banco de Dados (Supabase)
DATABASE_URL="postgresql://postgres:senha@host:5432/postgres"

# Better Auth
BETTER_AUTH_SECRET="sua-chave-segura-aqui"
BETTER_AUTH_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="sua-chave-publica"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Opcional: OAuth (Google, GitHub)
# GOOGLE_CLIENT_ID="..."
# GOOGLE_CLIENT_SECRET="..."
# GITHUB_CLIENT_ID="..."
# GITHUB_CLIENT_SECRET="..."

# Rede Corporativa
NODE_TLS_REJECT_UNAUTHORIZED="0"
```

## Solução de Problemas

### "Module not found: better-auth"

```bash
npm install better-auth --save
npm install
```

### "Erro ao conectar no banco"

1. Verifique o `DATABASE_URL` no `.env`
2. Teste a conexão com Supabase
3. Verifique se a porta 5432 não está bloqueada

### "BETTER_AUTH_SECRET não definido"

1. Abra o `.env`
2. Gere uma nova chave como mostrado acima
3. Adicione a variável

### Migrações falharam

```bash
# Reset do banco (CUIDADO: deleta tudo!)
npx prisma migrate reset

# Ou veja o status
npx prisma migrate status
```

## Recursos Úteis

- [Better Auth Docs](https://better-auth.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [Next.js 16](https://nextjs.org/)
