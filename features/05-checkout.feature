# language: pt
@checkout
Funcionalidade: Finalizar o pedido
  Regras que já existiam (regressão) e a integração com o cupom e o frete

  @CT26 @automatizado-e2e
  Cenário: Pedido confirmado com cupom mantém os valores do carrinho
    Dado que tenho 1 "Jaqueta Corta-Vento" no carrinho com o cupom "BEMVINDO10"
    Quando finalizo a compra com nome "Maria Silva", e-mail "maria@exemplo.com" e CEP "01310-100"
    Então vejo o título "Pedido VZ-" seguido de 6 dígitos
    E o resumo mostra desconto "- R$ 22,99", frete "Grátis" e total "R$ 206,91"
    E o contador do carrinho volta a 0

  @CT27 @automatizado-api
  Esquema do Cenário: CEP aceito com ou sem hífen
    Quando crio pela API um pedido válido com o CEP "<cep>"
    Então a resposta é 201
    E o CEP retornado é "01310100"
    E o número do pedido segue o formato "VZ-000000"

    Exemplos:
      | cep       |
      | 01310-100 |
      | 01310100  |

  @CT28 @automatizado-api @automatizado-e2e
  Esquema do Cenário: Dados do cliente inválidos
    Quando tento confirmar um pedido com nome "<nome>", e-mail "<email>" e CEP "<cep>"
    Então vejo o erro "<mensagem>" no campo "<campo>"
    E a API responde 422 com o código "DADOS_INVALIDOS"

    Exemplos:
      | nome        | email             | cep        | campo         | mensagem                        |
      | Maria       | maria@exemplo.com | 01310-100  | cliente.nome  | Informe nome e sobrenome.       |
      | Maria Silva | maria@            | 01310-100  | cliente.email | Informe um e-mail válido.       |
      | Maria Silva | maria exemplo.com | 01310-100  | cliente.email | Informe um e-mail válido.       |
      | Maria Silva | maria@exemplo.com | 0131010    | cliente.cep   | Informe um CEP com 8 dígitos.   |
      | Maria Silva | maria@exemplo.com | 013101000  | cliente.cep   | Informe um CEP com 8 dígitos.   |
      | Maria Silva | maria@exemplo.com | 0131A100   | cliente.cep   | Informe um CEP com 8 dígitos.   |

  @CT29 @automatizado-e2e
  Cenário: Confirmar com todos os campos vazios
    Dado que tenho 1 "Mochila Urbana 20L" no carrinho
    Quando clico em "Confirmar pedido" sem preencher os dados
    Então vejo "Informe o nome completo.", "Informe o e-mail." e "Informe o CEP."
    E continuo na página de checkout

  @CT30 @CA03 @CA04 @automatizado-api
  Esquema do Cenário: Pedido com cupom inválido ou expirado é recusado
    Quando crio pela API um pedido válido com o cupom "<cupom>"
    Então a resposta é 422 com o código "<codigo>" no campo "cupom"

    Exemplos:
      | cupom     | codigo         |
      | NAOEXISTE | CUPOM_INVALIDO |
      | VERAO2026 | CUPOM_EXPIRADO |
