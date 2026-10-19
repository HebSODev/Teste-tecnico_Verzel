# language: pt
@api @contrato
Funcionalidade: Contrato da API da Verzel Store
  Todo erro segue o formato { "erro": { "codigo", "mensagem", "campo" } }

  @CT31 @automatizado-api
  Cenário: Listar produtos
    Quando consulto GET /api/produtos
    Então a resposta é 200 com os 8 produtos e os preços da documentação

  @CT32 @automatizado-api
  Esquema do Cenário: Consultar produto por id
    Quando consulto GET /api/produtos/<id>
    Então a resposta é <status>

    Exemplos:
      | id   | status                          |
      | P003 | 200 com "Tênis Casual Urbano"   |
      | P999 | 404 com PRODUTO_NAO_ENCONTRADO  |

  @CT33 @CA03 @CA04 @automatizado-api
  Esquema do Cenário: Cálculo com cupom inválido não gera erro
    Quando calculo pela API um carrinho com 1 "P001" e o cupom "<cupom>"
    Então a resposta é 200
    E "cupom.aplicado" é false com a mensagem "<mensagem>"
    E o desconto é 0

    Exemplos:
      | cupom     | mensagem         |
      | NAOEXISTE | Cupom inválido.  |
      | VERAO2026 | Cupom expirado.  |

  @CT34 @automatizado-api
  Esquema do Cenário: Validações do corpo de /api/carrinho/calcular
    Quando envio para /api/carrinho/calcular o corpo <corpo>
    Então a resposta é <status> com o código "<codigo>"

    Exemplos:
      | corpo                                                       | status | codigo                 |
      | {"itens": []}                                               | 422    | ITENS_OBRIGATORIOS     |
      | {}                                                          | 422    | ITENS_OBRIGATORIOS     |
      | {"itens": ["P001"]}                                         | 422    | ITEM_INVALIDO          |
      | {"itens": [{"produtoId": "P999", "quantidade": 1}]}         | 422    | PRODUTO_NAO_ENCONTRADO |
      | P001 duas vezes na lista                                    | 422    | ITEM_DUPLICADO         |
      | texto que não é JSON                                        | 400    | JSON_INVALIDO          |
      | []                                                          | 400    | JSON_INVALIDO          |

  @CT35 @automatizado-api
  Cenário: Rota inexistente e método não permitido
    Quando consulto GET /api/rota-que-nao-existe
    Então a resposta é 404 com o código "ROTA_NAO_ENCONTRADA"
    Quando consulto GET /api/carrinho/calcular
    Então a resposta é 405 com o código "METODO_NAO_PERMITIDO"
