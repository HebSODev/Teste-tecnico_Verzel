# Bugs encontrados — VZS-142 (cupom de desconto e frete grátis)

| ID | Título | Severidade | Prioridade | CA | Camada | Status |
|---|---|---|---|---|---|---|
| [BUG-001](#bug-001) | Frete cobrado quando o subtotal é exatamente R$ 200,00 | Alta | Alta | CA06, CA07, CA08 | API (reflete na UI) | Aberto |
| [BUG-002](#bug-002) | API aceita mais de 5 unidades do mesmo produto | Alta | Alta | CA10 | API | Aberto |
| [BUG-003](#bug-003) | API responde "Cupom inválido." para cupom só com espaços | Baixa | Baixa | CA02 | API | Aberto |

**Ambiente:** https://verzel-store.qa-test-verzel-store.workers.dev · versão 2.3.0 · Chrome (Playwright 1.64, Chromium) · 19/10/2026

**Severidade:** Alta = regra de negócio quebrada com impacto em valor cobrado ou em validação · Média = regra quebrada sem impacto financeiro direto · Baixa = inconsistência sem impacto para o cliente na interface.

---

## BUG-001

**Frete cobrado quando o subtotal é exatamente R$ 200,00**

| Campo | Valor |
|---|---|
| Severidade / Prioridade | Alta / Alta |
| Critérios violados | CA06 ("a partir de R$ 200,00, inclusive"), CA07, CA08 |
| Endpoints afetados | `POST /api/carrinho/calcular`, `POST /api/pedidos` (e, por consequência, carrinho, checkout e confirmação) |
| Cenários | CT12, CT16 |
| Testes automatizados | `tests/api/frete.spec.ts` (CT12, CT16) e `tests/e2e/frete.spec.ts` (CT12), marcados com `test.fail` |

**Pré-condição:** carrinho vazio.

**Passos para reproduzir (UI)**
1. Na vitrine, clicar 2 vezes em "Adicionar ao carrinho" na **Mochila Urbana 20L** (R$ 100,00).
2. Abrir o **Carrinho**.
3. (Opcional) Aplicar o cupom **BEMVINDO10**.

**Passos para reproduzir (API)**
```http
POST /api/carrinho/calcular
{ "itens": [ { "produtoId": "P005", "quantidade": 2 } ] }
```

**Resultado esperado**
- Subtotal R$ 200,00 → `frete: 0`, `freteGratis: true`, frete exibido como "Grátis".
- Sem cupom: total **R$ 200,00**. Com BEMVINDO10: desconto R$ 20,00 e total **R$ 180,00** (CA08: a regra usa o subtotal antes do desconto).
- Nenhuma mensagem de valor faltante para o frete grátis.

**Resultado obtido**
- `frete: 19.9`, `freteGratis: false`, `valorFaltanteFreteGratis: 0`.
- Sem cupom: total **R$ 219,90**. Com cupom: total **R$ 199,90**.
- A tela mostra **"Faltam R$ 0,00 para o frete grátis."** e, mesmo assim, cobra R$ 19,90.
- O pedido é confirmado (201) com o frete cobrado.

**Análise:** com subtotais de 200,01 em diante (ex.: 229,90) o frete sai grátis, e com 199,80 é cobrado corretamente. A falha está só na fronteira. Tudo indica que a comparação usa `subtotal > 200` em vez de `subtotal >= 200`. O cálculo do faltante (`max(0, 200 − subtotal)`) está correto, por isso a resposta fica incoerente: falta 0 e o frete é cobrado mesmo assim. Reproduz com qualquer combinação que some 200,00, por exemplo 4× Garrafa Térmica (P008).

**Evidências**
- `docs/evidencias/bugs/BUG-001-ui-carrinho-subtotal-200.png`
- `docs/evidencias/bugs/BUG-001-ui-carrinho-subtotal-200-com-cupom.png`
- `docs/evidencias/bugs/BUG-001-ui-pedido-confirmado-com-frete.png`
- `docs/evidencias/bugs/BUG-001-api-subtotal-200.json`
- `docs/evidencias/bugs/BUG-001-api-subtotal-200-com-cupom.json`
- `docs/evidencias/bugs/BUG-001-api-pedido-subtotal-200.json`

---

## BUG-002

**API aceita mais de 5 unidades do mesmo produto**

| Campo | Valor |
|---|---|
| Severidade / Prioridade | Alta / Alta |
| Critério violado | CA10 ("no máximo 5 unidades por pedido. A regra vale para a interface e para a API.") |
| Endpoints afetados | `POST /api/carrinho/calcular`, `POST /api/pedidos` |
| Cenário | CT21 |
| Teste automatizado | `tests/api/quantidade.spec.ts` (CT21), marcado com `test.fail` |

**Passos para reproduzir**
```http
POST /api/pedidos
{
  "cliente": { "nome": "Maria Silva", "email": "maria@exemplo.com", "cep": "01310-100" },
  "itens": [ { "produtoId": "P005", "quantidade": 6 } ]
}
```

**Resultado esperado:** `422` com
```json
{ "erro": { "codigo": "QUANTIDADE_MAXIMA_EXCEDIDA", "mensagem": "...", "campo": "itens[0].quantidade" } }
```

**Resultado obtido:** `201`, pedido criado com 6 unidades (subtotal R$ 600,00). O `/carrinho/calcular` também responde `200` com 6 e até 100 unidades. O código `QUANTIDADE_MAXIMA_EXCEDIDA`, que está na documentação, nunca é retornado.

**Análise:** na interface a regra funciona: o botão "Adicionar ao carrinho" e o "+" ficam desabilitados ao chegar a 5 (CT18 e CT19 passam). A validação existe só no front, então qualquer cliente da API, ou alguém que manipule a requisição no navegador, contorna o limite. As demais validações de quantidade (0, negativo, decimal, string, `null`) funcionam.

**Evidências**
- `docs/evidencias/bugs/BUG-002-api-calcular-6-unidades.json`
- `docs/evidencias/bugs/BUG-002-api-pedido-6-unidades.json`

---

## BUG-003

**API responde "Cupom inválido." para cupom só com espaços, em vez de tratá-lo como não informado**

| Campo | Valor |
|---|---|
| Severidade / Prioridade | Baixa / Baixa |
| Critério relacionado | CA02 ("espaços no início e no fim são ignorados") e ambiguidade A3 |
| Endpoint afetado | `POST /api/carrinho/calcular` |
| Cenário | CT10 |
| Teste automatizado | `tests/api/cupom.spec.ts` (CT10), marcado com `test.fail` |

**Passos para reproduzir**
```http
POST /api/carrinho/calcular
{ "itens": [ { "produtoId": "P005", "quantidade": 1 } ], "cupom": "   " }
```

**Resultado esperado:** igual ao envio de `"cupom": ""`, ou seja, `"cupom": null`, sem mensagem de erro. Depois de ignorar os espaços (CA02), o código fica vazio.

**Resultado obtido:** `"cupom": { "codigo": "", "aplicado": false, "mensagem": "Cupom inválido." }`. Com `"cupom": ""` a resposta é `"cupom": null`.

**Análise:** é uma inconsistência só da API. Na interface, o campo preenchido apenas com espaços mostra "Informe um cupom.", igual ao campo vazio, e nem chama a API. Por isso o impacto para o cliente é baixo. Registrado como bug de baixa severidade, e não só como observação, porque o mesmo valor depois do trim gera duas respostas diferentes.

**Evidências**
- `docs/evidencias/bugs/BUG-003-api-cupom-so-espacos.json`
- `docs/evidencias/bugs/BUG-003-api-cupom-vazio-comparacao.json`
