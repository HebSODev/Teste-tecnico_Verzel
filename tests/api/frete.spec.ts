import { expect, test } from '@playwright/test';
import { calcularCarrinho } from '../support/api';
import { resumoEsperado, type Item } from '../support/calculo';
import { BUGS, CUPONS, FRETE_FIXO } from '../support/dados';

test.describe('API: frete grátis', () => {
  test('CT11 [CA06] subtotal acima de R$ 200,00 tem frete grátis', async ({ request }) => {
    const itens: Item[] = [{ produtoId: 'P007', quantidade: 1 }];
    const body = await (await calcularCarrinho(request, itens)).json();
    expect(body).toMatchObject({ subtotal: 229.9, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 229.9 });
  });

  const exatamente200: Array<[string, Item[]]> = [
    ['2x Mochila', [{ produtoId: 'P005', quantidade: 2 }]],
    ['4x Garrafa', [{ produtoId: 'P008', quantidade: 4 }]],
  ];
  for (const [nome, itens] of exatamente200) {
    test(`CT12 [CA06] subtotal igual a R$ 200,00 (${nome}) tem frete grátis`, async ({ request }) => {
      test.info().annotations.push({ type: 'bug', description: BUGS.freteNoLimite });
      test.fail(true, BUGS.freteNoLimite);

      const body = await (await calcularCarrinho(request, itens)).json();
      expect(body.subtotal).toBe(200);
      expect(body).toMatchObject({ frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 200 });
    });
  }

  test('CT13 [CA07] subtotal de R$ 199,80 cobra R$ 19,90 e faltam R$ 0,20', async ({ request }) => {
    const itens: Item[] = [
      { produtoId: 'P001', quantidade: 1 },
      { produtoId: 'P002', quantidade: 1 },
    ];
    const body = await (await calcularCarrinho(request, itens)).json();
    expect(body).toMatchObject({
      subtotal: 199.8,
      frete: FRETE_FIXO,
      freteGratis: false,
      valorFaltanteFreteGratis: 0.2,
      total: 219.7,
    });
  });

  test('CT14 [CA07] valor faltante nunca é negativo', async ({ request }) => {
    const body = await (await calcularCarrinho(request, [{ produtoId: 'P007', quantidade: 5 }])).json();
    expect(body.valorFaltanteFreteGratis).toBe(0);
  });

  test('CT15 [CA08] frete grátis usa o subtotal antes do desconto', async ({ request }) => {
    const itens: Item[] = [{ produtoId: 'P007', quantidade: 1 }];
    const body = await (await calcularCarrinho(request, itens, CUPONS.valido)).json();

    // 229,90 - 22,99 = 206,91 pagos nos produtos, mas a regra olha os 229,90.
    expect(body).toMatchObject({ subtotal: 229.9, desconto: 22.99, frete: 0, freteGratis: true, total: 206.91 });
  });

  test('CT16 [CA08] subtotal de R$ 200,00 com cupom mantém o frete grátis', async ({ request }) => {
    test.info().annotations.push({ type: 'bug', description: BUGS.freteNoLimite });
    test.fail(true, BUGS.freteNoLimite);

    const itens: Item[] = [{ produtoId: 'P005', quantidade: 2 }];
    const body = await (await calcularCarrinho(request, itens, CUPONS.valido)).json();
    expect(body).toMatchObject(resumoEsperado(itens, 10));
    expect(body.total).toBe(180);
  });

  test('CT17 [CA09] desconto não incide sobre o frete', async ({ request }) => {
    const body = await (await calcularCarrinho(request, [{ produtoId: 'P005', quantidade: 1 }], CUPONS.valido)).json();
    // Se incidisse sobre o frete, o desconto seria 11,99 e o total 107,91.
    expect(body).toMatchObject({ subtotal: 100, desconto: 10, frete: FRETE_FIXO, total: 109.9 });
  });
});
