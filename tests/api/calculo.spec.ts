import { expect, test } from '@playwright/test';
import { calcularCarrinho } from '../support/api';
import { resumoEsperado, temNoMaximoDuasCasas, type Item } from '../support/calculo';
import { CUPONS, PRODUTOS, type ProdutoId } from '../support/dados';

const itens = (...pares: Array<[ProdutoId, number]>): Item[] =>
  pares.map(([produtoId, quantidade]) => ({ produtoId, quantidade }));

const CASOS: Array<{ nome: string; itens: Item[]; cupom?: string }> = [
  { nome: 'exemplo da documentação', itens: itens(['P002', 1], ['P004', 2]), cupom: CUPONS.valido },
  { nome: '3x Camiseta sem cupom', itens: itens(['P001', 3]) },
  { nome: '3x Camiseta com cupom', itens: itens(['P001', 3]), cupom: CUPONS.valido },
  { nome: 'Calça + 3x Meias com cupom', itens: itens(['P002', 1], ['P006', 3]), cupom: CUPONS.valido },
  { nome: 'Tênis + Meias sem cupom', itens: itens(['P003', 1], ['P006', 1]) },
  { nome: 'três produtos com cupom', itens: itens(['P001', 2], ['P006', 1], ['P004', 1]), cupom: CUPONS.valido },
  {
    nome: 'todos os produtos com cupom',
    itens: (Object.keys(PRODUTOS) as ProdutoId[]).map((produtoId) => ({ produtoId, quantidade: 1 })),
    cupom: CUPONS.valido,
  },
];

test.describe('API: regras de cálculo', () => {
  for (const caso of CASOS) {
    test(`CT23 [CA11] fórmula do resumo: ${caso.nome}`, async ({ request }) => {
      const res = await calcularCarrinho(request, caso.itens, caso.cupom);
      expect(res.status()).toBe(200);
      const body = await res.json();

      expect(body).toMatchObject(resumoEsperado(caso.itens, caso.cupom ? 10 : 0));
      for (const item of body.itens) {
        expect(item.total).toBe(Math.round(item.precoUnitario * item.quantidade * 100) / 100);
      }
    });
  }

  test('CT24 [CA11] nenhum valor tem mais de 2 casas decimais', async ({ request }) => {
    const body = await (await calcularCarrinho(request, itens(['P001', 3]), CUPONS.valido)).json();
    const valores = [
      body.subtotal,
      body.desconto,
      body.frete,
      body.valorFaltanteFreteGratis,
      body.total,
      ...body.itens.flatMap((i: { precoUnitario: number; total: number }) => [i.precoUnitario, i.total]),
    ];
    for (const valor of valores) expect(temNoMaximoDuasCasas(valor), `valor ${valor}`).toBe(true);
    expect(body.subtotal).toBe(179.7);
  });
});
