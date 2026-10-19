import { expect, test } from '@playwright/test';
import { calcularCarrinho, criarPedido } from '../support/api';
import { BUGS, CLIENTE_VALIDO } from '../support/dados';

test.describe('API: limite de quantidade por produto', () => {
  test('CT20 [CA10] aceita exatamente 5 unidades', async ({ request }) => {
    const res = await calcularCarrinho(request, [{ produtoId: 'P001', quantidade: 5 }]);
    expect(res.status()).toBe(200);
    expect((await res.json()).subtotal).toBe(299.5);
  });

  for (const quantidade of [6, 100]) {
    test(`CT21 [CA10] /carrinho/calcular recusa ${quantidade} unidades`, async ({ request }) => {
      test.info().annotations.push({ type: 'bug', description: BUGS.quantidadeMaximaApi });
      test.fail(true, BUGS.quantidadeMaximaApi);

      const res = await calcularCarrinho(request, [{ produtoId: 'P005', quantidade }]);
      expect(res.status()).toBe(422);
      expect((await res.json()).erro).toMatchObject({
        codigo: 'QUANTIDADE_MAXIMA_EXCEDIDA',
        campo: 'itens[0].quantidade',
      });
    });
  }

  test('CT21 [CA10] /pedidos recusa 6 unidades', async ({ request }) => {
    test.info().annotations.push({ type: 'bug', description: BUGS.quantidadeMaximaApi });
    test.fail(true, BUGS.quantidadeMaximaApi);

    const res = await criarPedido(request, {
      cliente: CLIENTE_VALIDO,
      itens: [{ produtoId: 'P005', quantidade: 6 }],
    });
    expect(res.status()).toBe(422);
    expect((await res.json()).erro.codigo).toBe('QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  for (const quantidade of [0, -1, 1.5, '2', null]) {
    test(`CT22 quantidade ${JSON.stringify(quantidade)} retorna QUANTIDADE_INVALIDA`, async ({ request }) => {
      const res = await calcularCarrinho(request, [{ produtoId: 'P001', quantidade }]);
      expect(res.status()).toBe(422);
      expect((await res.json()).erro).toMatchObject({
        codigo: 'QUANTIDADE_INVALIDA',
        mensagem: 'A quantidade deve ser um número inteiro maior ou igual a 1.',
        campo: 'itens[0].quantidade',
      });
    });
  }
});
