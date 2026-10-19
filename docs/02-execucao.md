# Execução dos testes — VZS-142

| Item | Valor |
|---|---|
| Ambiente | https://verzel-store.qa-test-verzel-store.workers.dev · versão 2.3.0 |
| Data | 19/10/2026 |
| Navegadores | Chromium (Playwright 1.64), desktop 1280×900 e iPhone 13 (390×844) emulado |
| Base | [`features/`](../features/) (CT01–CT35) e [`00-analise-requisitos.md`](00-analise-requisitos.md) |
| Evidências | [`04-evidencias.md`](04-evidencias.md) |

## Resumo

| Métrica | Valor |
|---|---|
| Cenários executados | 35 de 35 |
| ✅ Passou | 31 |
| ❌ Falhou | 4 (CT10, CT12, CT16, CT21) |
| ⛔ Bloqueado | 0 |
| Bugs abertos | 3 ([BUG-001](03-bugs.md#bug-001), [BUG-002](03-bugs.md#bug-002), [BUG-003](03-bugs.md#bug-003)) |
| Sessões exploratórias | 7 (ver [seção 2](#2-testes-exploratórios)) |
| Observações (não são bugs) | 3 |

| Critério de aceite | Situação |
|---|---|
| CA01 desconto de 10% | ✅ |
| CA02 caixa e espaços | ⚠️ atendido na UI; inconsistência na API com cupom só de espaços (BUG-003) |
| CA03 cupom inexistente | ✅ |
| CA04 cupom expirado | ✅ |
| CA05 um cupom por vez | ✅ |
| CA06 frete grátis a partir de R$ 200,00, inclusive | ❌ falha na fronteira (BUG-001) |
| CA07 frete fixo e valor faltante | ⚠️ correto abaixo de 200; incoerente em 200,00 ("Faltam R$ 0,00" com frete cobrado, BUG-001) |
| CA08 frete pelo subtotal antes do desconto | ✅ acima de 200 · ❌ em 200,00 (BUG-001) |
| CA09 desconto não incide no frete | ✅ |
| CA10 máximo de 5 unidades (UI e API) | ⚠️ UI ✅ · API ❌ (BUG-002) |
| CA11 arredondamento em 2 casas | ✅ |

**Recomendação:** **não aprovar** a entrega para produção enquanto BUG-001 e BUG-002 estiverem abertos. O BUG-001 cobra frete de clientes que têm direito ao frete grátis, exatamente no valor anunciado na vitrine. O BUG-002 deixa a regra do CA10 sem proteção no back-end.

## 1. Resultado por cenário

**Legenda de execução:** **API**: Playwright `tests/api` · **UI**: Playwright `tests/e2e` · **Manual**: executado no navegador, passo a passo.

### Cupom de desconto — [`01-cupom.feature`](../features/01-cupom.feature)

| CT | Cenário | CA | Execução | Resultado | Bug | Evidência |
|---|---|---|---|---|---|---|
| CT01 | BEMVINDO10 concede 10% sobre o subtotal | CA01 | API · UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT01-CA01-aplicar-BEMVINDO10-concede-10-sobre-o-subtotal.png) |
| CT02 | Código ignora caixa e espaços nas pontas | CA02 | API · UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT02-CA02-cupom-digitado-em-minusculas-e-com-espacos-e-aceito.png) |
| CT03 | Espaço no meio do código não é ignorado | CA02 | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |
| CT04 | Cupom inexistente: "Cupom inválido." | CA03 | API · UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT04-CA03-cupom-inexistente-mostra-Cupom-invalido.png) |
| CT05 | Cupom expirado: "Cupom expirado." | CA04 | API · UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT05-CA04-cupom-expirado-mostra-Cupom-expirado.png) |
| CT06 | Campo vazio pede um cupom | — | UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT06-aplicar-com-o-campo-vazio-pede-um-cupom.png) |
| CT07 | Apenas um cupom por vez | CA05 | UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT07-CT08-CA05-um-cupom-por-vez-para-trocar-remove-o-atual.png) |
| CT08 | Trocar o cupom removendo o atual | CA05 | UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT07-CT08-CA05-um-cupom-por-vez-para-trocar-remove-o-atual.png) |
| CT09 | Desconto é recalculado quando a quantidade muda | CA01 | UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT09-CA01-desconto-e-recalculado-quando-a-quantidade-muda.png) |
| CT10 | Cupom só com espaços é tratado como não informado | CA02 | API · Manual | ❌ Falhou | [BUG-003](03-bugs.md#bug-003) | [json](evidencias/bugs/BUG-003-api-cupom-so-espacos.json) |

### Frete — [`02-frete.feature`](../features/02-frete.feature)

| CT | Cenário | CA | Execução | Resultado | Bug | Evidência |
|---|---|---|---|---|---|---|
| CT11 | Subtotal acima de R$ 200,00 tem frete grátis | CA06 | API · UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT11-CA06-subtotal-acima-de-R-200-00-tem-frete-gratis.png) |
| CT12 | Subtotal **igual** a R$ 200,00 tem frete grátis | CA06 | API · UI · Manual | ❌ Falhou | [BUG-001](03-bugs.md#bug-001) | [print](evidencias/e2e/CT12-CA06-subtotal-igual-a-R-200-00-tem-frete-gratis.png) · [json](evidencias/bugs/BUG-001-api-subtotal-200.json) |
| CT13 | R$ 199,80 cobra R$ 19,90 e faltam R$ 0,20 | CA07 | API · UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT13-CA07-abaixo-de-R-200-00-cobra-frete-e-informa-o-faltante.png) |
| CT14 | Valor faltante nunca é negativo | CA07 | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |
| CT15 | Frete grátis usa o subtotal antes do desconto | CA08 | API · UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT15-CA08-frete-gratis-considera-o-subtotal-antes-do-desconto.png) |
| CT16 | R$ 200,00 com cupom mantém o frete grátis | CA08 | API · Manual | ❌ Falhou | [BUG-001](03-bugs.md#bug-001) | [print](evidencias/bugs/BUG-001-ui-carrinho-subtotal-200-com-cupom.png) · [json](evidencias/bugs/BUG-001-api-subtotal-200-com-cupom.json) |
| CT17 | Desconto não incide sobre o frete | CA09 | API · UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT17-CA09-desconto-nao-incide-sobre-o-frete.png) |

### Quantidade — [`03-quantidade.feature`](../features/03-quantidade.feature)

| CT | Cenário | CA | Execução | Resultado | Bug | Evidência |
|---|---|---|---|---|---|---|
| CT18 | Vitrine bloqueia a 6ª unidade | CA10 | UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT18-CA10-vitrine-bloqueia-a-6-unidade-do-mesmo-produto.png) |
| CT19 | Carrinho bloqueia aumentar acima de 5 | CA10 | UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT19-CA10-carrinho-nao-deixa-aumentar-acima-de-5.png) |
| CT20 | API aceita exatamente 5 unidades | CA10 | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |
| CT21 | API recusa mais de 5 unidades (calcular e pedidos) | CA10 | API | ❌ Falhou | [BUG-002](03-bugs.md#bug-002) | [json](evidencias/bugs/BUG-002-api-pedido-6-unidades.json) |
| CT22 | Quantidade 0, negativa, decimal, string ou null | — | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |

### Cálculo — [`04-calculo.feature`](../features/04-calculo.feature)

| CT | Cenário | CA | Execução | Resultado | Bug | Evidência |
|---|---|---|---|---|---|---|
| CT23 | Resumo segue a fórmula da documentação | CA11 | API (7 carrinhos + varredura de 86) | ✅ Passou* | | [log](evidencias/automacao/execucao-playwright.txt) · [varredura](evidencias/automacao/varredura-calculo.txt) |
| CT24 | Nenhum valor com mais de 2 casas decimais | CA11 | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |
| CT25 | Interface exibe os valores calculados pela API | — | UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT25-interface-exibe-os-valores-calculados-pela-API.png) |

\* Os 7 carrinhos do CT23 passam. A varredura exploratória de 86 combinações só diverge nos subtotais de exatamente R$ 200,00, já cobertos pelo BUG-001.

### Checkout — [`05-checkout.feature`](../features/05-checkout.feature)

| CT | Cenário | CA | Execução | Resultado | Bug | Evidência |
|---|---|---|---|---|---|---|
| CT26 | Pedido com cupom mantém os valores do carrinho | — | UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT26-pedido-com-cupom-e-confirmado-com-os-valores-do-carrinho.png) |
| CT27 | CEP aceito com e sem hífen | — | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |
| CT28 | Nome, e-mail e CEP inválidos | — | API · UI · Manual | ✅ Passou | | [nome](evidencias/e2e/CT28-nome-invalido-impede-a-confirmacao.png) · [e-mail](evidencias/e2e/CT28-e-mail-invalido-impede-a-confirmacao.png) · [CEP](evidencias/e2e/CT28-CEP-invalido-impede-a-confirmacao.png) |
| CT29 | Confirmar com os campos vazios | — | UI · Manual | ✅ Passou | | [print](evidencias/e2e/CT29-confirmar-com-os-campos-vazios-mostra-os-erros-de-obrigatoriedade.png) |
| CT30 | Pedido com cupom inválido ou expirado retorna 422 | CA03, CA04 | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |

### Contrato da API — [`06-api-contrato.feature`](../features/06-api-contrato.feature)

| CT | Cenário | CA | Execução | Resultado | Bug | Evidência |
|---|---|---|---|---|---|---|
| CT31 | Listar os 8 produtos com os preços da documentação | — | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |
| CT32 | Consultar produto por id (200 e 404) | — | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |
| CT33 | Cálculo com cupom inválido responde 200 sem desconto | CA03, CA04 | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |
| CT34 | Validações do corpo (itens, duplicado, JSON inválido) | — | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |
| CT35 | Rota inexistente (404) e método não permitido (405) | — | API | ✅ Passou | | [log](evidencias/automacao/execucao-playwright.txt) |

## 2. Testes exploratórios

Sessões curtas e focadas (charters), anotando o que foi observado. O que a documentação lista em "Sobre este ambiente" foi conferido, mas não é reportado como bug.

| # | Missão (charter) | O que foi feito | Achados | Evidência |
|---|---|---|---|---|
| EXP-A | Explorar o **cálculo** em massa para achar valores fora da fórmula | Varredura de 86 combinações (8 produtos × 1–5 unidades + 3 mistos, com e sem cupom) comparadas com a fórmula | Só o subtotal de exatamente 200,00 diverge → **BUG-001**. Nenhum erro de ponto flutuante (CA11 ok) | [varredura](evidencias/automacao/varredura-calculo.txt) · [script](../scripts/varredura-calculo.mjs) |
| EXP-B | Explorar a **API** com entradas fora do contrato | Quantidades 6 e 100, 0, -1, 1.5, "2", null; cupom vazio, só espaços, com espaço no meio; corpos inválidos | API aceita mais de 5 → **BUG-002**. Cupom só de espaços ≠ cupom vazio → **BUG-003**. Demais validações conforme a documentação | [bugs](evidencias/bugs/) |
| EXP-C | Explorar **navegação fora do fluxo** | Acesso direto a `/checkout` e `/pedido-confirmado` com carrinho vazio, rota inexistente | `/checkout` redireciona para o carrinho vazio; a confirmação mostra "Nenhum pedido recente"; existe página 404 amigável. Sem problemas | [EXP-01](evidencias/exploratorio/EXP-01-checkout-carrinho-vazio.png) · [EXP-02](evidencias/exploratorio/EXP-02-pedido-confirmado-acesso-direto.png) · [EXP-03](evidencias/exploratorio/EXP-03-rota-inexistente.png) |
| EXP-D | Explorar o **ciclo de vida do cupom** | Aplicar com Enter, esvaziar o carrinho com cupom, adicionar item depois de esvaziar, recarregar a página | Enter aplica o cupom; esvaziar também remove o cupom; o cupom se mantém após recarregar a mesma aba. Sem problemas | [EXP-04](evidencias/exploratorio/EXP-04-esvaziar-carrinho-com-cupom.png) · [EXP-05](evidencias/exploratorio/EXP-05-novo-item-apos-esvaziar.png) |
| EXP-E | Explorar o **pós-pedido** | Confirmar pedido com nome cheio de espaços e e-mail em maiúsculas; voltar; recarregar a confirmação | Pedido aceito; voltar leva ao carrinho vazio (sem pedido duplicado); recarregar mantém a confirmação. Ver **OBS-02** | [EXP-06](evidencias/exploratorio/EXP-06-pedido-nome-espacos-extras.png) · [EXP-07](evidencias/exploratorio/EXP-07-voltar-apos-pedido.png) |
| EXP-F | Conferir o **carrinho por aba** ("Sobre este ambiente") | Adicionar item, abrir nova aba, recarregar a aba original | Nova aba começa vazia e a mesma aba mantém o carrinho, como documentado. Não é bug | — |
| EXP-G | Explorar o **layout mobile** (iPhone 13) | Vitrine, carrinho com cupom expirado, checkout | Sem rolagem horizontal (scrollWidth 390 = viewport); mensagens e resumo legíveis. Ver **OBS-01** | [EXP-08](evidencias/exploratorio/EXP-08-mobile-vitrine.png) · [EXP-09](evidencias/exploratorio/EXP-09-mobile-carrinho-cupom-expirado.png) · [EXP-10](evidencias/exploratorio/EXP-10-mobile-checkout.png) · [EXP-11](evidencias/exploratorio/EXP-11-mobile-cabecalho.png) |

### Observações (não reportadas como bug)

| ID | Observação | Por que não é bug |
|---|---|---|
| OBS-01 | No mobile, os links "Produtos" e "Documentação" somem do cabeçalho e não há menu alternativo. | Fora do escopo do VZS-142. A vitrine continua acessível pelo logo e a documentação pelo aviso do topo. Fica como sugestão de UX. |
| OBS-02 | O nome `"  Maria   Silva  "` é salvo como `"Maria   Silva"`: corta os espaços das pontas, mas mantém os do meio. | A regra só exige nome e sobrenome. É uma sugestão de normalização. |
| OBS-03 | No carrinho, o botão "−" fica desabilitado com quantidade 1; para tirar o item é preciso usar "Remover". | Comportamento coerente, que evita quantidade 0 (inválida na API). |

## 3. Como reexecutar

```bash
npm test                          # suíte automatizada completa
npm run evidencias                # suíte + prints em docs/evidencias/e2e + log em docs/evidencias/automacao
node scripts/varredura-calculo.mjs  # varredura exploratória do cálculo
```
