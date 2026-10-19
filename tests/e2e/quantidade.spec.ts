import { QUANTIDADE_MAXIMA } from '../support/dados';
import { expect, test } from './fixtures';

test.describe('UI: limite de 5 unidades por produto', () => {
  test('CT18 [CA10] vitrine bloqueia a 6ª unidade do mesmo produto', async ({ loja }) => {
    await loja.adicionar('P005', QUANTIDADE_MAXIMA);

    await expect(loja.botaoAdicionar('P005')).toBeDisabled();
    await expect(loja.card('P005')).toContainText('Limite de 5 unidades atingido.');
    await expect(loja.contadorCarrinho()).toHaveAccessibleName('Carrinho 5 itens no carrinho');
    // Outro produto continua liberado.
    await expect(loja.botaoAdicionar('P001')).toBeEnabled();
  });

  test('CT19 [CA10] carrinho não deixa aumentar acima de 5', async ({ loja, carrinho }) => {
    await loja.adicionar('P005', QUANTIDADE_MAXIMA - 1);
    await loja.irParaCarrinho();

    await expect(carrinho.botaoAumentar('P005')).toBeEnabled();
    await carrinho.aumentar('P005');

    await expect(carrinho.quantidade('P005')).toHaveText('5');
    await expect(carrinho.botaoAumentar('P005')).toBeDisabled();
    await expect(carrinho.resumo.subtotal).toHaveText('R$ 500,00');
  });
});
