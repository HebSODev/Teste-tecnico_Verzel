import { CUPONS, MENSAGENS } from '../support/dados';
import { expect, test } from './fixtures';

test.describe('UI: cupom de desconto', () => {
  test.beforeEach(async ({ loja }) => {
    await loja.adicionar('P005');
    await loja.irParaCarrinho();
  });

  test('CT01 [CA01] aplicar BEMVINDO10 concede 10% sobre o subtotal', async ({ carrinho }) => {
    await carrinho.aplicarCupom(CUPONS.valido);

    await expect(carrinho.cupomAplicado).toHaveText('Cupom BEMVINDO10 aplicado.');
    await expect(carrinho.resumo.rotuloDesconto).toHaveText('Desconto (BEMVINDO10)');
    await expect(carrinho.resumo.subtotal).toHaveText('R$ 100,00');
    await expect(carrinho.resumo.desconto).toHaveText('- R$ 10,00');
    await expect(carrinho.resumo.total).toHaveText('R$ 109,90');
  });

  test('CT02 [CA02] cupom digitado em minúsculas e com espaços é aceito', async ({ carrinho }) => {
    await carrinho.aplicarCupom('  bemvindo10 ');

    await expect(carrinho.cupomAplicado).toHaveText('Cupom BEMVINDO10 aplicado.');
    await expect(carrinho.resumo.desconto).toHaveText('- R$ 10,00');
  });

  test('CT04 [CA03] cupom inexistente mostra "Cupom inválido."', async ({ carrinho }) => {
    await carrinho.aplicarCupom(CUPONS.inexistente);

    await expect(carrinho.mensagemCupom).toHaveText(MENSAGENS.cupomInvalido);
    await expect(carrinho.resumo.desconto).toHaveText('R$ 0,00');
    await expect(carrinho.resumo.total).toHaveText('R$ 119,90');
  });

  test('CT05 [CA04] cupom expirado mostra "Cupom expirado."', async ({ carrinho }) => {
    await carrinho.aplicarCupom(CUPONS.expirado);

    await expect(carrinho.mensagemCupom).toHaveText(MENSAGENS.cupomExpirado);
    await expect(carrinho.resumo.desconto).toHaveText('R$ 0,00');
    await expect(carrinho.resumo.total).toHaveText('R$ 119,90');
  });

  test('CT06 aplicar com o campo vazio pede um cupom', async ({ carrinho }) => {
    await carrinho.botaoAplicarCupom.click();

    await expect(carrinho.mensagemCupom).toHaveText('Informe um cupom.');
    await expect(carrinho.resumo.desconto).toHaveText('R$ 0,00');
  });

  test('CT07/CT08 [CA05] um cupom por vez; para trocar, remove o atual', async ({ carrinho }) => {
    await carrinho.aplicarCupom(CUPONS.valido);

    // Com um cupom aplicado não há como digitar outro.
    await expect(carrinho.campoCupom).toBeHidden();
    await expect(carrinho.botaoAplicarCupom).toBeHidden();
    await expect(carrinho.botaoRemoverCupom).toBeVisible();

    await carrinho.removerCupom();
    await expect(carrinho.resumo.desconto).toHaveText('R$ 0,00');
    await expect(carrinho.campoCupom).toBeVisible();

    await carrinho.aplicarCupom(CUPONS.expirado);
    await expect(carrinho.mensagemCupom).toHaveText(MENSAGENS.cupomExpirado);
  });

  test('CT09 [CA01] desconto é recalculado quando a quantidade muda', async ({ carrinho }) => {
    await carrinho.aumentar('P005');
    await carrinho.aplicarCupom(CUPONS.valido);
    await expect(carrinho.resumo.desconto).toHaveText('- R$ 20,00');

    await carrinho.diminuir('P005');
    await expect(carrinho.cupomAplicado).toBeVisible();
    await expect(carrinho.resumo.desconto).toHaveText('- R$ 10,00');
  });
});
