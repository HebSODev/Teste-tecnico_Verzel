import { expect, test } from '@playwright/test';
import { criarPedido } from '../support/api';
import { resumoEsperado, type Item } from '../support/calculo';
import { CLIENTE_VALIDO, CUPONS } from '../support/dados';

const MOCHILA: Item[] = [{ produtoId: 'P005', quantidade: 1 }];

test.describe('API: pedidos', () => {
  for (const cep of ['01310-100', '01310100']) {
    test(`CT27 pedido válido com CEP ${cep}`, async ({ request }) => {
      const res = await criarPedido(request, { cliente: { ...CLIENTE_VALIDO, cep }, itens: MOCHILA, cupom: CUPONS.valido });
      expect(res.status()).toBe(201);
      const body = await res.json();

      expect(body.numero).toMatch(/^VZ-\d{6}$/);
      expect(new Date(body.criadoEm).toString()).not.toBe('Invalid Date');
      expect(body.cliente).toEqual({ nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310100' });
      expect(body).toMatchObject(resumoEsperado(MOCHILA, 10));
      expect(body.cupom).toMatchObject({ codigo: 'BEMVINDO10', aplicado: true });
    });
  }

  const INVALIDOS = [
    { cliente: { nome: 'Maria' }, campo: 'cliente.nome', mensagem: 'Informe nome e sobrenome.' },
    { cliente: { email: 'maria@' }, campo: 'cliente.email', mensagem: 'Informe um e-mail válido.' },
    { cliente: { email: 'maria exemplo.com' }, campo: 'cliente.email', mensagem: 'Informe um e-mail válido.' },
    { cliente: { cep: '0131010' }, campo: 'cliente.cep', mensagem: 'Informe um CEP com 8 dígitos.' },
    { cliente: { cep: '013101000' }, campo: 'cliente.cep', mensagem: 'Informe um CEP com 8 dígitos.' },
    { cliente: { cep: '0131A100' }, campo: 'cliente.cep', mensagem: 'Informe um CEP com 8 dígitos.' },
  ];
  for (const caso of INVALIDOS) {
    test(`CT28 ${caso.campo} inválido: ${JSON.stringify(Object.values(caso.cliente)[0])}`, async ({ request }) => {
      const res = await criarPedido(request, { cliente: { ...CLIENTE_VALIDO, ...caso.cliente }, itens: MOCHILA });
      expect(res.status()).toBe(422);
      const { erro } = await res.json();
      expect(erro.codigo).toBe('DADOS_INVALIDOS');
      expect(erro.campos).toEqual([{ campo: caso.campo, mensagem: caso.mensagem }]);
    });
  }

  const CUPONS_RECUSADOS = [
    { cupom: CUPONS.inexistente, codigo: 'CUPOM_INVALIDO', mensagem: 'Cupom inválido.' },
    { cupom: CUPONS.expirado, codigo: 'CUPOM_EXPIRADO', mensagem: 'Cupom expirado.' },
  ];
  for (const caso of CUPONS_RECUSADOS) {
    test(`CT30 [CA03/CA04] pedido com cupom ${caso.cupom} retorna ${caso.codigo}`, async ({ request }) => {
      const res = await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: MOCHILA, cupom: caso.cupom });
      expect(res.status()).toBe(422);
      expect((await res.json()).erro).toEqual({ codigo: caso.codigo, mensagem: caso.mensagem, campo: 'cupom' });
    });
  }
});
