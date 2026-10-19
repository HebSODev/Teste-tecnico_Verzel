# language: pt
@quantidade
Funcionalidade: Limite de 5 unidades por produto
  A regra vale para a interface e para a API (CA10)

  @CT18 @CA10 @automatizado-e2e
  Cenário: Vitrine bloqueia a 6ª unidade do mesmo produto
    Dado que estou na Verzel Store com o carrinho vazio
    Quando clico 5 vezes em "Adicionar ao carrinho" na "Mochila Urbana 20L"
    Então o botão "Adicionar ao carrinho" desse produto fica desabilitado
    E vejo a mensagem "Limite de 5 unidades atingido."
    E o contador do carrinho mostra 5

  @CT19 @CA10 @automatizado-e2e
  Cenário: Carrinho bloqueia aumentar acima de 5 unidades
    Dado que tenho 4 "Mochila Urbana 20L" no carrinho
    Quando aumento a quantidade pelo botão "+"
    Então a quantidade é 5
    E o botão "+" fica desabilitado

  @CT20 @CA10 @automatizado-api
  Cenário: API aceita exatamente 5 unidades
    Quando calculo pela API um carrinho com 5 "P001"
    Então a resposta é 200 com subtotal 299.5

  @CT21 @CA10 @bug @BUG-002 @automatizado-api
  Esquema do Cenário: API recusa mais de 5 unidades
    Quando envio para "<endpoint>" um item "P005" com quantidade <quantidade>
    Então a resposta é 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"
    E o campo do erro é "itens[0].quantidade"

    Exemplos:
      | endpoint                | quantidade |
      | /api/carrinho/calcular  | 6          |
      | /api/carrinho/calcular  | 100        |
      | /api/pedidos            | 6          |

  @CT22 @automatizado-api
  Esquema do Cenário: Quantidade que não é inteiro maior ou igual a 1
    Quando calculo pela API um carrinho com o item "P001" e quantidade <quantidade>
    Então a resposta é 422 com o código "QUANTIDADE_INVALIDA"

    Exemplos:
      | quantidade |
      | 0          |
      | -1         |
      | 1.5        |
      | "2"        |
      | null       |
