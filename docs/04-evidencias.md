# Índice de evidências — VZS-142

Todas as evidências ficam em [`docs/evidencias/`](evidencias/), capturadas em **19/10/2026** no ambiente https://verzel-store.qa-test-verzel-store.workers.dev (versão 2.3.0).

```
evidencias/
├── bugs/          # prints e request/response que comprovam cada bug
├── e2e/           # estado final da tela de cada teste de UI (gerado pela automação)
├── exploratorio/  # prints das sessões exploratórias
└── automacao/     # log da execução da suíte e da varredura de cálculo
```

## 1. Evidências dos bugs — `evidencias/bugs/`

### BUG-001: frete cobrado com subtotal igual a R$ 200,00

| Arquivo | Tipo | O que mostra |
|---|---|---|
| [BUG-001-ui-carrinho-subtotal-200.png](evidencias/bugs/BUG-001-ui-carrinho-subtotal-200.png) | Print | 2× Mochila: subtotal R$ 200,00, frete R$ 19,90, total R$ 219,90 e "Faltam R$ 0,00 para o frete grátis." |
| [BUG-001-ui-carrinho-subtotal-200-com-cupom.png](evidencias/bugs/BUG-001-ui-carrinho-subtotal-200-com-cupom.png) | Print | Mesmo carrinho com BEMVINDO10: desconto R$ 20,00, frete R$ 19,90, total R$ 199,90 (esperado R$ 180,00) |
| [BUG-001-ui-pedido-confirmado-com-frete.png](evidencias/bugs/BUG-001-ui-pedido-confirmado-com-frete.png) | Print | Pedido confirmado com o frete indevido |
| [BUG-001-api-subtotal-200.json](evidencias/bugs/BUG-001-api-subtotal-200.json) | Request/response | `calcular` 2× P005 → `frete: 19.9`, `freteGratis: false`, `valorFaltanteFreteGratis: 0` |
| [BUG-001-api-subtotal-200-com-cupom.json](evidencias/bugs/BUG-001-api-subtotal-200-com-cupom.json) | Request/response | `calcular` 2× P005 + cupom → `total: 199.9` |
| [BUG-001-api-pedido-subtotal-200.json](evidencias/bugs/BUG-001-api-pedido-subtotal-200.json) | Request/response | `pedidos` 4× P008 → 201 com `frete: 19.9` |
| [CT12 (UI, automação)](evidencias/e2e/CT12-CA06-subtotal-igual-a-R-200-00-tem-frete-gratis.png) | Print | Tela no momento em que o teste automatizado detecta o bug |

### BUG-002: API aceita mais de 5 unidades

| Arquivo | Tipo | O que mostra |
|---|---|---|
| [BUG-002-api-calcular-6-unidades.json](evidencias/bugs/BUG-002-api-calcular-6-unidades.json) | Request/response | `calcular` 6× P005 → 200 (esperado 422 `QUANTIDADE_MAXIMA_EXCEDIDA`) |
| [BUG-002-api-pedido-6-unidades.json](evidencias/bugs/BUG-002-api-pedido-6-unidades.json) | Request/response | `pedidos` 6× P005 → 201, pedido criado com subtotal R$ 600,00 |
| [CT18 (UI)](evidencias/e2e/CT18-CA10-vitrine-bloqueia-a-6-unidade-do-mesmo-produto.png) | Print | Para comparação: na interface o limite funciona |

### BUG-003: cupom só com espaços

| Arquivo | Tipo | O que mostra |
|---|---|---|
| [BUG-003-api-cupom-so-espacos.json](evidencias/bugs/BUG-003-api-cupom-so-espacos.json) | Request/response | `"cupom": "   "` → `{ codigo: "", aplicado: false, mensagem: "Cupom inválido." }` |
| [BUG-003-api-cupom-vazio-comparacao.json](evidencias/bugs/BUG-003-api-cupom-vazio-comparacao.json) | Request/response | Para comparação: `"cupom": ""` → `cupom: null` |

## 2. Evidências por cenário de UI — `evidencias/e2e/`

Geradas por `npm run evidencias`: a automação salva a tela no fim de cada teste de UI.

| CT | Arquivo | O que mostra |
|---|---|---|
| CT01 | [CT01-CA01-aplicar-BEMVINDO10-concede-10-sobre-o-subtotal.png](evidencias/e2e/CT01-CA01-aplicar-BEMVINDO10-concede-10-sobre-o-subtotal.png) | Cupom aplicado, desconto de R$ 10,00 sobre R$ 100,00 |
| CT02 | [CT02-CA02-cupom-digitado-em-minusculas-e-com-espacos-e-aceito.png](evidencias/e2e/CT02-CA02-cupom-digitado-em-minusculas-e-com-espacos-e-aceito.png) | `"  bemvindo10 "` aplicado como BEMVINDO10 |
| CT04 | [CT04-CA03-cupom-inexistente-mostra-Cupom-invalido.png](evidencias/e2e/CT04-CA03-cupom-inexistente-mostra-Cupom-invalido.png) | "Cupom inválido.", sem desconto |
| CT05 | [CT05-CA04-cupom-expirado-mostra-Cupom-expirado.png](evidencias/e2e/CT05-CA04-cupom-expirado-mostra-Cupom-expirado.png) | "Cupom expirado.", sem desconto |
| CT06 | [CT06-aplicar-com-o-campo-vazio-pede-um-cupom.png](evidencias/e2e/CT06-aplicar-com-o-campo-vazio-pede-um-cupom.png) | "Informe um cupom." |
| CT07/CT08 | [CT07-CT08-CA05-um-cupom-por-vez-para-trocar-remove-o-atual.png](evidencias/e2e/CT07-CT08-CA05-um-cupom-por-vez-para-trocar-remove-o-atual.png) | Depois de remover BEMVINDO10, aplicação de VERAO2026 recusada |
| CT09 | [CT09-CA01-desconto-e-recalculado-quando-a-quantidade-muda.png](evidencias/e2e/CT09-CA01-desconto-e-recalculado-quando-a-quantidade-muda.png) | Desconto recalculado de R$ 20,00 para R$ 10,00 |
| CT11 | [CT11-CA06-subtotal-acima-de-R-200-00-tem-frete-gratis.png](evidencias/e2e/CT11-CA06-subtotal-acima-de-R-200-00-tem-frete-gratis.png) | R$ 229,90 com frete "Grátis" |
| CT12 | [CT12-CA06-subtotal-igual-a-R-200-00-tem-frete-gratis.png](evidencias/e2e/CT12-CA06-subtotal-igual-a-R-200-00-tem-frete-gratis.png) | ❌ R$ 200,00 com frete R$ 19,90 (BUG-001) |
| CT13 | [CT13-CA07-abaixo-de-R-200-00-cobra-frete-e-informa-o-faltante.png](evidencias/e2e/CT13-CA07-abaixo-de-R-200-00-cobra-frete-e-informa-o-faltante.png) | R$ 199,80, frete R$ 19,90, "Faltam R$ 0,20" |
| CT15 | [CT15-CA08-frete-gratis-considera-o-subtotal-antes-do-desconto.png](evidencias/e2e/CT15-CA08-frete-gratis-considera-o-subtotal-antes-do-desconto.png) | R$ 229,90 − R$ 22,99, frete grátis, total R$ 206,91 |
| CT17 | [CT17-CA09-desconto-nao-incide-sobre-o-frete.png](evidencias/e2e/CT17-CA09-desconto-nao-incide-sobre-o-frete.png) | Desconto R$ 10,00 (não R$ 11,99), total R$ 109,90 |
| CT18 | [CT18-CA10-vitrine-bloqueia-a-6-unidade-do-mesmo-produto.png](evidencias/e2e/CT18-CA10-vitrine-bloqueia-a-6-unidade-do-mesmo-produto.png) | Botão desabilitado e "Limite de 5 unidades atingido." |
| CT19 | [CT19-CA10-carrinho-nao-deixa-aumentar-acima-de-5.png](evidencias/e2e/CT19-CA10-carrinho-nao-deixa-aumentar-acima-de-5.png) | Quantidade 5 com "+" desabilitado |
| CT25 | [CT25-interface-exibe-os-valores-calculados-pela-API.png](evidencias/e2e/CT25-interface-exibe-os-valores-calculados-pela-API.png) | Exemplo da documentação: total R$ 215,73 |
| CT26 | [CT26-pedido-com-cupom-e-confirmado-com-os-valores-do-carrinho.png](evidencias/e2e/CT26-pedido-com-cupom-e-confirmado-com-os-valores-do-carrinho.png) | Pedido VZ-xxxxxx confirmado com o resumo do carrinho |
| CT28 | [nome](evidencias/e2e/CT28-nome-invalido-impede-a-confirmacao.png) · [e-mail](evidencias/e2e/CT28-e-mail-invalido-impede-a-confirmacao.png) · [CEP](evidencias/e2e/CT28-CEP-invalido-impede-a-confirmacao.png) | Mensagens de validação no checkout |
| CT29 | [CT29-confirmar-com-os-campos-vazios-mostra-os-erros-de-obrigatoriedade.png](evidencias/e2e/CT29-confirmar-com-os-campos-vazios-mostra-os-erros-de-obrigatoriedade.png) | Três mensagens de campo obrigatório |

## 3. Evidências da automação e dos cenários de API — `evidencias/automacao/`

| Arquivo | O que mostra |
|---|---|
| [execucao-playwright.txt](evidencias/automacao/execucao-playwright.txt) | Saída completa da suíte (77 testes, 57 de API e 20 de UI), um teste por linha com o id do cenário. Os testes com `✘` são os que reproduzem bugs (`test.fail`). É a evidência dos cenários só de API (CT03, CT14, CT20–CT24, CT27, CT30–CT35). |
| [varredura-calculo.txt](evidencias/automacao/varredura-calculo.txt) | Varredura exploratória de 86 combinações. Só as 4 de subtotal R$ 200,00 divergem. |

Também ficam disponíveis, mas fora do repositório (no `.gitignore`), o relatório HTML (`npm run report`) e o trace e o vídeo de cada execução em `test-results/`.

## 4. Evidências exploratórias — `evidencias/exploratorio/`

| Arquivo | Sessão | O que mostra |
|---|---|---|
| [EXP-01-checkout-carrinho-vazio.png](evidencias/exploratorio/EXP-01-checkout-carrinho-vazio.png) | EXP-C | `/checkout` com carrinho vazio redireciona para o carrinho |
| [EXP-02-pedido-confirmado-acesso-direto.png](evidencias/exploratorio/EXP-02-pedido-confirmado-acesso-direto.png) | EXP-C | `/pedido-confirmado` sem pedido: "Nenhum pedido recente" |
| [EXP-03-rota-inexistente.png](evidencias/exploratorio/EXP-03-rota-inexistente.png) | EXP-C | Página 404 "Página não encontrada" |
| [EXP-04-esvaziar-carrinho-com-cupom.png](evidencias/exploratorio/EXP-04-esvaziar-carrinho-com-cupom.png) | EXP-D | Carrinho esvaziado com cupom aplicado |
| [EXP-05-novo-item-apos-esvaziar.png](evidencias/exploratorio/EXP-05-novo-item-apos-esvaziar.png) | EXP-D | Novo item depois de esvaziar: o cupom não volta |
| [EXP-06-pedido-nome-espacos-extras.png](evidencias/exploratorio/EXP-06-pedido-nome-espacos-extras.png) | EXP-E | Pedido com nome cheio de espaços (OBS-02) |
| [EXP-07-voltar-apos-pedido.png](evidencias/exploratorio/EXP-07-voltar-apos-pedido.png) | EXP-E | Voltar depois do pedido leva ao carrinho vazio |
| [EXP-08-mobile-vitrine.png](evidencias/exploratorio/EXP-08-mobile-vitrine.png) | EXP-G | Vitrine no iPhone 13 |
| [EXP-09-mobile-carrinho-cupom-expirado.png](evidencias/exploratorio/EXP-09-mobile-carrinho-cupom-expirado.png) | EXP-G | Carrinho mobile com "Cupom expirado." e "Faltam R$ 0,20" |
| [EXP-10-mobile-checkout.png](evidencias/exploratorio/EXP-10-mobile-checkout.png) | EXP-G | Checkout mobile |
| [EXP-11-mobile-cabecalho.png](evidencias/exploratorio/EXP-11-mobile-cabecalho.png) | EXP-G | Cabeçalho mobile sem "Produtos" e "Documentação" (OBS-01) |

> Nos prints de página inteira no mobile, o cabeçalho fixo aparece no meio da imagem. Isso é um efeito da captura de página inteira, não da loja.
