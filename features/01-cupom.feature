# language: pt
@cupom
Funcionalidade: Cupom de desconto no carrinho
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto no carrinho
  Para pagar menos nas minhas compras

  Contexto:
    Dado que estou na Verzel Store com o carrinho vazio

  @CT01 @CA01 @automatizado-api @automatizado-e2e
  Cenário: Aplicar o cupom BEMVINDO10 concede 10% sobre o subtotal
    Dado que adicionei 1 "Mochila Urbana 20L" ao carrinho
    Quando aplico o cupom "BEMVINDO10"
    Então vejo a mensagem "Cupom BEMVINDO10 aplicado."
    E o subtotal é "R$ 100,00"
    E o desconto é "- R$ 10,00"
    E o total é "R$ 109,90"

  @CT02 @CA02 @automatizado-api @automatizado-e2e
  Esquema do Cenário: Código do cupom ignora caixa e espaços nas pontas
    Dado que adicionei 1 "Mochila Urbana 20L" ao carrinho
    Quando aplico o cupom "<codigo digitado>"
    Então o cupom "BEMVINDO10" é aplicado
    E o desconto é "- R$ 10,00"

    Exemplos:
      | codigo digitado  |
      | bemvindo10       |
      | BemVindo10       |
      |   BEMVINDO10     |
      |  bemvindo10      |

  @CT03 @CA02 @ambiguidade-A1 @automatizado-api
  Cenário: Espaço no meio do código não é ignorado
    Dado que adicionei 1 "Mochila Urbana 20L" ao carrinho
    Quando aplico o cupom "BEM VINDO10"
    Então vejo a mensagem "Cupom inválido."
    E nenhum desconto é aplicado

  @CT04 @CA03 @automatizado-api @automatizado-e2e
  Cenário: Cupom inexistente é recusado
    Dado que adicionei 1 "Mochila Urbana 20L" ao carrinho
    Quando aplico o cupom "NAOEXISTE"
    Então vejo a mensagem "Cupom inválido."
    E nenhum desconto é aplicado
    E o total é "R$ 119,90"

  @CT05 @CA04 @automatizado-api @automatizado-e2e
  Esquema do Cenário: Cupom expirado é recusado
    Dado que adicionei 1 "Mochila Urbana 20L" ao carrinho
    Quando aplico o cupom "<codigo>"
    Então vejo a mensagem "Cupom expirado."
    E nenhum desconto é aplicado

    Exemplos:
      | codigo    |
      | VERAO2026 |
      | verao2026 |

  @CT06 @ambiguidade-A3 @automatizado-e2e
  Cenário: Aplicar com o campo de cupom vazio
    Dado que adicionei 1 "Mochila Urbana 20L" ao carrinho
    Quando clico em "Aplicar cupom" sem informar um código
    Então vejo a mensagem "Informe um cupom."
    E nenhum desconto é aplicado

  @CT07 @CA05 @automatizado-e2e
  Cenário: Apenas um cupom por vez
    Dado que adicionei 1 "Mochila Urbana 20L" ao carrinho
    E apliquei o cupom "BEMVINDO10"
    Então o campo de cupom não fica mais disponível
    E vejo a opção "Remover cupom"

  @CT08 @CA05 @automatizado-e2e
  Cenário: Trocar o cupom removendo o atual
    Dado que adicionei 1 "Mochila Urbana 20L" ao carrinho
    E apliquei o cupom "BEMVINDO10"
    Quando removo o cupom
    Então o desconto volta a ser "R$ 0,00"
    E o campo de cupom fica disponível novamente
    Quando aplico o cupom "VERAO2026"
    Então vejo a mensagem "Cupom expirado."

  @CT09 @CA01 @ambiguidade-A7 @automatizado-e2e
  Cenário: Desconto é recalculado quando a quantidade muda
    Dado que adicionei 2 "Mochila Urbana 20L" ao carrinho
    E apliquei o cupom "BEMVINDO10"
    Quando diminuo a quantidade de "Mochila Urbana 20L" para 1
    Então o desconto é "- R$ 10,00"
    E o cupom continua aplicado

  @CT10 @CA02 @ambiguidade-A3 @bug @BUG-003 @automatizado-api
  Cenário: Cupom só com espaços é tratado como cupom não informado
    Quando calculo pela API um carrinho com 1 "P005" e o cupom "   "
    Então a resposta não deve trazer "Cupom inválido."
    E o campo "cupom" deve ser nulo, como acontece com o cupom ""
