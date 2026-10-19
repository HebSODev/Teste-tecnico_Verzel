import { expect, test } from '@playwright/test';
import { calcularCarrinho } from '../support/api';
import { CUPONS, MENSAGENS, PRODUTOS } from '../support/dados';

test.describe('API: contrato', () => {
  test('CT31 GET /api/produtos lista os 8 produtos com os preços da documentação', async ({ request }) => {
    const res = await request.get('/api/produtos');
    expect(res.status()).toBe(200);
    const produtos: Array<{ id: string; nome: string; preco: number }> = await res.json();

    expect(produtos.map((p) => ({ id: p.id, nome: p.nome, preco: p.preco }))).toEqual(
      Object.entries(PRODUTOS).map(([id, p]) => ({ id, nome: p.nome, preco: p.preco })),
    );
    for (const p of produtos) expect(p).toEqual(expect.objectContaining({ descricao: expect.any(String), categoria: expect.any(String) }));
  });

  test('CT32 GET /api/produtos/{id} retorna o produto ou 404', async ({ request }) => {
    const ok = await request.get('/api/produtos/P003');
    expect(ok.status()).toBe(200);
    expect(await ok.json()).toMatchObject({ id: 'P003', nome: 'Tênis Casual Urbano', preco: 189.9 });

    const inexistente = await request.get('/api/produtos/P999');
    expect(inexistente.status()).toBe(404);
    expect((await inexistente.json()).erro.codigo).toBe('PRODUTO_NAO_ENCONTRADO');
  });

  for (const [cupom, mensagem] of [
    [CUPONS.inexistente, MENSAGENS.cupomInvalido],
    [CUPONS.expirado, MENSAGENS.cupomExpirado],
  ]) {
    test(`CT33 cálculo com cupom ${cupom} responde 200 sem desconto`, async ({ request }) => {
      const res = await calcularCarrinho(request, [{ produtoId: 'P001', quantidade: 1 }], cupom);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.desconto).toBe(0);
      expect(body.cupom).toMatchObject({ aplicado: false, mensagem });
    });
  }

  const CORPOS_INVALIDOS: Array<{ nome: string; corpo: string; status: number; codigo: string; campo?: string }> = [
    { nome: 'itens vazio', corpo: '{"itens":[]}', status: 422, codigo: 'ITENS_OBRIGATORIOS', campo: 'itens' },
    { nome: 'sem itens', corpo: '{}', status: 422, codigo: 'ITENS_OBRIGATORIOS', campo: 'itens' },
    { nome: 'item não é objeto', corpo: '{"itens":["P001"]}', status: 422, codigo: 'ITEM_INVALIDO', campo: 'itens[0]' },
    {
      nome: 'produto inexistente',
      corpo: '{"itens":[{"produtoId":"P999","quantidade":1}]}',
      status: 422,
      codigo: 'PRODUTO_NAO_ENCONTRADO',
      campo: 'itens[0].produtoId',
    },
    {
      nome: 'produto duplicado',
      corpo: '{"itens":[{"produtoId":"P001","quantidade":1},{"produtoId":"P001","quantidade":2}]}',
      status: 422,
      codigo: 'ITEM_DUPLICADO',
      campo: 'itens[1].produtoId',
    },
    { nome: 'texto que não é JSON', corpo: 'nao-e-json', status: 400, codigo: 'JSON_INVALIDO' },
    { nome: 'array no lugar de objeto', corpo: '[]', status: 400, codigo: 'JSON_INVALIDO' },
  ];
  for (const caso of CORPOS_INVALIDOS) {
    test(`CT34 calcular com ${caso.nome} retorna ${caso.codigo}`, async ({ request }) => {
      const res = await request.post('/api/carrinho/calcular', { data: caso.corpo });
      expect(res.status()).toBe(caso.status);
      const { erro } = await res.json();
      expect(erro.codigo).toBe(caso.codigo);
      expect(erro.mensagem).toEqual(expect.any(String));
      if (caso.campo) expect(erro.campo).toBe(caso.campo);
    });
  }

  test('CT35 rota inexistente (404) e método não permitido (405)', async ({ request }) => {
    const rota = await request.get('/api/rota-que-nao-existe');
    expect(rota.status()).toBe(404);
    expect((await rota.json()).erro.codigo).toBe('ROTA_NAO_ENCONTRADA');

    const metodo = await request.get('/api/carrinho/calcular');
    expect(metodo.status()).toBe(405);
    expect((await metodo.json()).erro.codigo).toBe('METODO_NAO_PERMITIDO');
  });
});
