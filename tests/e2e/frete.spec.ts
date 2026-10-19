import { BUGS, CUPONS } from '../support/dados';
import { expect, test } from './fixtures';

test.describe('UI: frete grátis', () => {
  test('CT11 [CA06] subtotal acima de R$ 200,00 tem frete grátis', async ({ loja, carrinho }) => {
    await loja.adicionar('P007');
    await loja.irParaCarrinho();

    await expect(carrinho.resumo.subtotal).toHaveText('R$ 229,90');
    await expect(carrinho.resumo.frete).toHaveText('Grátis');
    await expect(carrinho.resumo.total).toHaveText('R$ 229,90');
    await expect(carrinho.resumo.faltanteFreteGratis).toBeHidden();
  });

  test('CT12 [CA06] subtotal igual a R$ 200,00 tem frete grátis', async ({ loja, carrinho }) => {
    test.info().annotations.push({ type: 'bug', description: BUGS.freteNoLimite });
    test.fail(true, BUGS.freteNoLimite);

    await loja.adicionar('P005', 2);
    await loja.irParaCarrinho();

    await expect(carrinho.resumo.subtotal).toHaveText('R$ 200,00');
    await expect(carrinho.resumo.frete).toHaveText('Grátis');
    await expect(carrinho.resumo.total).toHaveText('R$ 200,00');
  });

  test('CT13 [CA07] abaixo de R$ 200,00 cobra frete e informa o faltante', async ({ loja, carrinho }) => {
    await loja.adicionar('P001');
    await loja.adicionar('P002');
    await loja.irParaCarrinho();

    await expect(carrinho.resumo.subtotal).toHaveText('R$ 199,80');
    await expect(carrinho.resumo.frete).toHaveText('R$ 19,90');
    await expect(carrinho.resumo.total).toHaveText('R$ 219,70');
    await expect(carrinho.resumo.faltanteFreteGratis).toHaveText('Faltam R$ 0,20 para o frete grátis.');
  });

  test('CT15 [CA08] frete grátis considera o subtotal antes do desconto', async ({ loja, carrinho }) => {
    await loja.adicionar('P007');
    await loja.irParaCarrinho();
    await carrinho.aplicarCupom(CUPONS.valido);

    await expect(carrinho.resumo.desconto).toHaveText('- R$ 22,99');
    await expect(carrinho.resumo.frete).toHaveText('Grátis');
    await expect(carrinho.resumo.total).toHaveText('R$ 206,91');
  });

  test('CT17 [CA09] desconto não incide sobre o frete', async ({ loja, carrinho }) => {
    await loja.adicionar('P005');
    await loja.irParaCarrinho();
    await carrinho.aplicarCupom(CUPONS.valido);

    await expect(carrinho.resumo.desconto).toHaveText('- R$ 10,00');
    await expect(carrinho.resumo.frete).toHaveText('R$ 19,90');
    await expect(carrinho.resumo.total).toHaveText('R$ 109,90');
  });

  test('CT25 interface exibe os valores calculados pela API', async ({ loja, carrinho }) => {
    await loja.adicionar('P002');
    await loja.adicionar('P004', 2);
    await loja.irParaCarrinho();
    await carrinho.aplicarCupom(CUPONS.valido);

    await expect(carrinho.resumo.subtotal).toHaveText('R$ 239,70');
    await expect(carrinho.resumo.desconto).toHaveText('- R$ 23,97');
    await expect(carrinho.resumo.frete).toHaveText('Grátis');
    await expect(carrinho.resumo.total).toHaveText('R$ 215,73');
  });
});
