import { CLIENTE_VALIDO, CUPONS } from '../support/dados';
import { expect, test } from './fixtures';

test.describe('UI: finalizar pedido', () => {
  test('CT26 pedido com cupom é confirmado com os valores do carrinho', async ({ page, loja, carrinho, checkout, confirmacao }) => {
    await loja.adicionar('P007');
    await loja.irParaCarrinho();
    await carrinho.aplicarCupom(CUPONS.valido);
    await carrinho.irParaCheckout();

    await expect(checkout.resumo.total).toHaveText('R$ 206,91');
    await checkout.preencher(CLIENTE_VALIDO);

    const [resposta] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/pedidos')),
      checkout.confirmar.click(),
    ]);
    expect(resposta.status()).toBe(201);
    expect(resposta.request().postDataJSON()).toMatchObject({ cupom: 'BEMVINDO10' });

    await expect(confirmacao.titulo).toBeVisible();
    await expect(page.getByText('Obrigado, Maria.')).toBeVisible();
    await expect(confirmacao.resumo.desconto).toHaveText('- R$ 22,99');
    await expect(confirmacao.resumo.frete).toHaveText('Grátis');
    await expect(confirmacao.resumo.total).toHaveText('R$ 206,91');
    await expect(loja.contadorCarrinho()).toHaveAccessibleName('Carrinho 0 itens no carrinho');
  });

  const INVALIDOS = [
    { campo: 'nome', dados: { nome: 'Maria' }, mensagem: 'Informe nome e sobrenome.' },
    { campo: 'e-mail', dados: { email: 'maria@' }, mensagem: 'Informe um e-mail válido.' },
    { campo: 'CEP', dados: { cep: '0131010' }, mensagem: 'Informe um CEP com 8 dígitos.' },
  ];
  for (const caso of INVALIDOS) {
    test(`CT28 ${caso.campo} inválido impede a confirmação`, async ({ page, loja, carrinho, checkout }) => {
      await loja.adicionar('P005');
      await loja.irParaCarrinho();
      await carrinho.irParaCheckout();

      await checkout.preencher({ ...CLIENTE_VALIDO, ...caso.dados });
      await checkout.confirmar.click();

      await expect(checkout.erro(caso.mensagem)).toBeVisible();
      await expect(page).toHaveURL(/\/checkout$/);
    });
  }

  test('CT29 confirmar com os campos vazios mostra os erros de obrigatoriedade', async ({ page, loja, carrinho, checkout }) => {
    await loja.adicionar('P005');
    await loja.irParaCarrinho();
    await carrinho.irParaCheckout();

    await checkout.confirmar.click();

    for (const mensagem of ['Informe o nome completo.', 'Informe o e-mail.', 'Informe o CEP.']) {
      await expect(checkout.erro(mensagem)).toBeVisible();
    }
    await expect(page).toHaveURL(/\/checkout$/);
  });
});
