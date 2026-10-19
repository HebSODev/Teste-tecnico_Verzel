# language: pt
@frete
Funcionalidade: Frete grátis a partir de R$ 200,00
  Como cliente da Verzel Store
  Quero ganhar frete grátis em compras maiores
  Para pagar menos nas minhas compras

  Contexto:
    Dado que estou na Verzel Store com o carrinho vazio

  @CT11 @CA06 @automatizado-api @automatizado-e2e
  Cenário: Subtotal acima de R$ 200,00 tem frete grátis
    Dado que adicionei 1 "Jaqueta Corta-Vento" ao carrinho
    Então o subtotal é "R$ 229,90"
    E o frete é "Grátis"
    E o total é "R$ 229,90"
    E não vejo mensagem de valor faltante para o frete grátis

  @CT12 @CA06 @fronteira @bug @BUG-001 @automatizado-api @automatizado-e2e
  Esquema do Cenário: Subtotal exatamente igual a R$ 200,00 tem frete grátis
    Dado que adicionei <quantidade> "<produto>" ao carrinho
    Então o subtotal é "R$ 200,00"
    E o frete é "Grátis"
    E o total é "R$ 200,00"

    Exemplos:
      | produto               | quantidade |
      | Mochila Urbana 20L    | 2          |
      | Garrafa Térmica 750ml | 4          |

  @CT13 @CA07 @fronteira @automatizado-api @automatizado-e2e
  Cenário: Subtotal logo abaixo de R$ 200,00 cobra frete e informa o faltante
    Dado que adicionei 1 "Camiseta Essencial" ao carrinho
    E adicionei 1 "Calça Jeans Slim" ao carrinho
    Então o subtotal é "R$ 199,80"
    E o frete é "R$ 19,90"
    E o total é "R$ 219,70"
    E vejo a mensagem "Faltam R$ 0,20 para o frete grátis."

  @CT14 @CA07 @automatizado-api
  Cenário: Valor faltante nunca é negativo
    Quando calculo pela API um carrinho com 5 "P007"
    Então "valorFaltanteFreteGratis" é 0

  @CT15 @CA08 @automatizado-api @automatizado-e2e
  Cenário: Frete grátis considera o subtotal antes do desconto
    Dado que adicionei 1 "Jaqueta Corta-Vento" ao carrinho
    Quando aplico o cupom "BEMVINDO10"
    Então o subtotal é "R$ 229,90"
    E o desconto é "- R$ 22,99"
    E o frete continua "Grátis", mesmo com o valor pago abaixo de R$ 200,00
    E o total é "R$ 206,91"

  @CT16 @CA08 @fronteira @bug @BUG-001 @automatizado-api
  Cenário: Subtotal de R$ 200,00 com cupom mantém o frete grátis
    Quando calculo pela API um carrinho com 2 "P005" e o cupom "BEMVINDO10"
    Então o subtotal é 200 e o desconto é 20
    E o frete é 0
    E o total é 180

  @CT17 @CA09 @automatizado-api @automatizado-e2e
  Cenário: Desconto do cupom não incide sobre o frete
    Dado que adicionei 1 "Mochila Urbana 20L" ao carrinho
    Quando aplico o cupom "BEMVINDO10"
    Então o desconto é "- R$ 10,00", ou seja, 10% só dos produtos
    E o frete é "R$ 19,90"
    E o total é "R$ 109,90"
