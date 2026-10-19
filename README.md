# Verzel Store — QA da entrega VZS-142

Teste técnico de QA Júnior na Verzel: validação da entrega **"Cupom de desconto e frete grátis"** (card VZS-142, versão 2.3.0) da [Verzel Store](https://verzel-store.qa-test-verzel-store.workers.dev/).

## Resumo

- **35 cenários** (CT01–CT35) levantados da documentação, em Gherkin.
- **77 testes automatizados** com Playwright: 57 de API e 20 de interface.
- **3 bugs** encontrados: 2 de severidade alta e 1 de baixa.

| Bug | Resumo | Severidade |
|---|---|---|
| [BUG-001](docs/03-bugs.md#bug-001) | Frete de R$ 19,90 cobrado com subtotal exatamente R$ 200,00 (CA06/CA08) | Alta |
| [BUG-002](docs/03-bugs.md#bug-002) | API aceita mais de 5 unidades por produto (CA10) | Alta |
| [BUG-003](docs/03-bugs.md#bug-003) | API responde "Cupom inválido." para cupom só com espaços (CA02) | Baixa |

## Onde encontrar cada entrega

| Entrega pedida | Onde está |
|---|---|
| Análise dos requisitos e ambiguidades | [`docs/00-analise-requisitos.md`](docs/00-analise-requisitos.md) |
| Cenários de teste (Gherkin) | [`features/`](features/) |
| Execução manual e exploratória, com resultado por cenário | [`docs/02-execucao.md`](docs/02-execucao.md) |
| Report dos bugs | [`docs/03-bugs.md`](docs/03-bugs.md) |
| Evidências da execução | [`docs/04-evidencias.md`](docs/04-evidencias.md) e [`docs/evidencias/`](docs/evidencias/) |
| Automação com Playwright | [`tests/`](tests/) |
| Uso de IA | [`docs/uso-de-ia.md`](docs/uso-de-ia.md) |
| Cópia da documentação usada como base | [`docs/referencia/documentacao-vzs-142.md`](docs/referencia/documentacao-vzs-142.md) |

### Cenários

| Arquivo | Escopo | Cenários |
|---|---|---|
| [`01-cupom.feature`](features/01-cupom.feature) | CA01–CA05 | CT01–CT10 |
| [`02-frete.feature`](features/02-frete.feature) | CA06–CA09 | CT11–CT17 |
| [`03-quantidade.feature`](features/03-quantidade.feature) | CA10 | CT18–CT22 |
| [`04-calculo.feature`](features/04-calculo.feature) | Fórmula e CA11 | CT23–CT25 |
| [`05-checkout.feature`](features/05-checkout.feature) | Regras pré-existentes (regressão) | CT26–CT30 |
| [`06-api-contrato.feature`](features/06-api-contrato.feature) | Contrato e códigos de erro | CT31–CT35 |

Tags usadas: `@CTxx` (id do cenário), `@CAxx` (critério de aceite), `@bug @BUG-00x`, `@ambiguidade-Ax`, `@fronteira`, `@automatizado-api` e `@automatizado-e2e`.

## Como rodar a automação

**Pré-requisitos:** Node.js 18 ou superior.

```bash
npm install
npx playwright install chromium

npm test              # tudo (API + UI)
npm run test:api      # só API
npm run test:e2e      # só UI (headless)
npm run test:headed   # UI com o navegador visível
npm run report        # abre o relatório HTML da última execução
npm run evidencias    # roda tudo e atualiza docs/evidencias/e2e (prints) e docs/evidencias/automacao (log)

node scripts/varredura-calculo.mjs   # varredura exploratória do cálculo (86 combinações)
```

Para apontar para outro ambiente, use `BASE_URL=https://... npm test`.

### Como ler o resultado

- Os títulos dos testes começam pelo id do cenário (`CT12 [CA06] ...`), o que permite ligar cada teste ao `.feature` e ao critério de aceite.
- Os testes que **reproduzem bugs** usam `test.fail()` com uma anotação `bug`. Eles **passam enquanto o bug existir** e aparecem com `✘` na saída `list`. Quando o bug for corrigido, o teste passa a falhar, avisando que é hora de remover o `test.fail()`. Assim a suíte fica verde sem esconder os defeitos.
- Os screenshots de cada teste, e o trace e o vídeo das falhas, ficam em `test-results/`. O relatório HTML fica em `playwright-report/`.

### Estrutura

```
tests/
├── api/            # testes de API (APIRequestContext)
├── e2e/            # testes de UI + fixtures
├── pages/          # page objects (Loja, Carrinho, Checkout, Resumo)
└── support/        # massa de teste, oráculo de cálculo e helpers da API
```

- **Oráculo de cálculo:** `tests/support/calculo.ts` implementa as "Regras de cálculo" da documentação. Os testes comparam a API com esse cálculo independente, em vez de com números copiados da resposta.
- **Seletores por papel acessível** (`getByRole`), sem depender de classes CSS.
- **Ambiente compartilhado:** o teste usa 2 workers e não faz carga nem testes de segurança, que estão fora do escopo.