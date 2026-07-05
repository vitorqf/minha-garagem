# Minha Garagem

Rastreador pessoal de despesas por veículo, multiusuário e com isolamento total de dados entre contas (multi-tenant).

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Estilo:** Tailwind CSS + componentes estilo shadcn/Radix
- **ORM/Banco:** Prisma + PostgreSQL (`@prisma/adapter-pg`)
- **Autenticação:** Auth.js (NextAuth) com Credentials + bcrypt
- **Mutations:** Server Actions
- **Testes:** Vitest + Testing Library (unit/componentes) e Playwright (e2e)

## Funcionalidades

- **Autenticação multiusuário:** `/login` e `/signup` com contas independentes e e-mail único por conta.
- **Veículos:** CRUD completo (`/vehicles`), com placa validada nos formatos brasileiros (antiga `AAA9999` e Mercosul `AAA9A99`), únicos por dono.
- **Despesas:** CRUD (`/expenses`) por veículo, categorias fixas (`combustível`, `peças`, `serviço`), valores em centavos, filtros por veículo/categoria/período.
- **Resumos:** painel (`/summaries`) com total por veículo, distribuição por categoria, tendência mensal (variação vs. mês anterior), custo por km e ranking dos principais fatores de custo.
- **Exportação CSV:** endpoints autenticados para exportar despesas (`/api/reports/expenses.csv`) e resumos (`/api/reports/summaries.csv`), com formatação `pt-BR` (delimitador `;`, BOM UTF-8, datas `DD/MM/YYYY`).
- **Isolamento entre contas:** todo acesso a veículo/despesa é escopado ao `ownerId` da sessão, reforçado a nível de banco (relação composta `vehicleId + ownerId`).
- **Hardening:** rate limiting de login em memória, validação de datas de calendário impossíveis, sanitização de células tipo fórmula no CSV.

## Como rodar

### Pré-requisitos

- Node.js 24+
- Corepack habilitado (para `pnpm`)
- PostgreSQL local ou remoto

### Setup

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
cp .env.example .env
```

Edite `.env` com a URL do Postgres e um segredo de auth:

```bash
DATABASE_URL="postgresql://postgres.<project-ref>:<senha>@<pooler-host>:6543/postgres?sslmode=require&pgbouncer=true&connection_limit=1"
AUTH_SECRET="troque-por-um-segredo-forte-com-32-chars"
AUTH_TRUST_HOST="true"
```

Gere o client do Prisma e aplique as migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate:dev
```

Rode o servidor de desenvolvimento:

```bash
pnpm dev
```

Acesse `http://localhost:3000/login` para criar conta/entrar. As telas `/vehicles`, `/expenses` e `/summaries` ficam disponíveis após o login.

### Scripts úteis

| Comando | Descrição |
| --- | --- |
| `pnpm lint` | ESLint |
| `pnpm test` / `pnpm test:coverage` | Testes unitários/componentes (Vitest) |
| `pnpm test:e2e` | Testes e2e (Playwright) |
| `pnpm build` | Build de produção |

## CI/CD

Pipeline de qualidade e segurança via GitHub Actions: lint/test/build em PRs e pushes para `main`, smoke e2e em `main`, dependency review, `pnpm audit`, SAST com Semgrep, secret scan com gitleaks e CodeQL semanal. Dependabot atualiza dependências npm e Actions semanalmente.

## Fora do escopo (v0)

- Lembretes e alertas
- Leitura de recibos via OCR
- Sincronização bancária
- Cobrança e integrações de terceiros
