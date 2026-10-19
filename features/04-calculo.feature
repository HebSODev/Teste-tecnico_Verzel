# language: pt
@calculo
Funcionalidade: Regras de cálculo do carrinho
  total = subtotal - desconto + frete, com valores arredondados a 2 casas (CA11)

  @CT23 @CA11 @automatizado-api
  Esquema do Cenário: Resumo do carrinho segue a fórmula da documentação
    Quando calculo pela API o carrinho <itens> com o cupom "<cupom>"
    Então subtotal, desconto, frete, faltante e total batem com a fórmula da documentação

    Exemplos:
      | itens                          | cupom      |
      | P002 x1, P004 x2               | BEMVINDO10 |
      | P001 x3                        |            |
      | P001 x3                        | BEMVINDO10 |
      | P002 x1, P006 x3               | BEMVINDO10 |
      | P003 x1, P006 x1               |            |
      | P001 x2, P006 x1, P004 x1      | BEMVINDO10 |
      | todos os produtos x1           | BEMVINDO10 |

  @CT24 @CA11 @automatizado-api
  Cenário: Nenhum valor monetário tem mais de 2 casas decimais
    Quando calculo pela API um carrinho com 3 "P001" e o cupom "BEMVINDO10"
    Então todos os valores da resposta têm no máximo 2 casas decimais
    E o subtotal é 179.7, não 179.70000000000002

  @CT25 @automatizado-e2e
  Cenário: A interface exibe exatamente os valores calculados pela API
    Dado que adicionei 1 "Calça Jeans Slim" e 2 "Boné Aba Curva" ao carrinho
    E apliquei o cupom "BEMVINDO10"
    Então o resumo mostra subtotal "R$ 239,70", desconto "- R$ 23,97", frete "Grátis" e total "R$ 215,73"
