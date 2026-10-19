import { expect, test } from '@playwright/test';
import { calcularCarrinho } from '../support/api';
import { resumoEsperado } from '../support/calculo';
import { BUGS, CUPONS, MENSAGENS } from '../support/dados';

const MOCHILA = [{ produtoId: 'P005', quantidade: 1 }] as const;

test.describe('API: cupom de desconto', () => {
  test('CT01 [CA01] BEMVINDO10 aplica 10% sobre o subtotal', async ({ request }) => {
    const res = await calcularCarrinho(request, MOCHILA, CUPONS.valido);
    expect(res.status()).toBe(200);
    const body = await res.json();

    expect(body).toMatchObject(resumoEsperado([...MOCHILA], 10));
    expect(body.cupom).toEqual({ codigo: 'BEMVINDO10', aplicado: true, mensagem: MENSAGENS.cupomAplicado });
  });

  for (const codigo of ['bemvindo10', 'BemVindo10', '  BEMVINDO10  ', '\tbemvindo10 ']) {
    test(`CT02 [CA02] código ${JSON.stringify(codigo)} é normalizado`, async ({ request }) => {
      const body = await (await calcularCarrinho(request, MOCHILA, codigo)).json();
      expect(body.cupom).toMatchObject({ codigo: 'BEMVINDO10', aplicado: true });
      expect(body.desconto).toBe(10);
    });
  }

  test('CT03 [CA02] espaço no meio do código não é ignorado', async ({ request }) => {
    const body = await (await calcularCarrinho(request, MOCHILA, 'BEM VINDO10')).json();
    expect(body.cupom).toMatchObject({ aplicado: false, mensagem: MENSAGENS.cupomInvalido });
    expect(body.desconto).toBe(0);
  });

  test('CT04 [CA03] cupom inexistente: "Cupom inválido." e sem desconto', async ({ request }) => {
    const res = await calcularCarrinho(request, MOCHILA, CUPONS.inexistente);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject(resumoEsperado([...MOCHILA]));
    expect(body.cupom).toMatchObject({ aplicado: false, mensagem: MENSAGENS.cupomInvalido });
  });

  for (const codigo of ['VERAO2026', 'verao2026']) {
    test(`CT05 [CA04] cupom expirado ${codigo}: "Cupom expirado." e sem desconto`, async ({ request }) => {
      const res = await calcularCarrinho(request, MOCHILA, codigo);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toMatchObject(resumoEsperado([...MOCHILA]));
      expect(body.cupom).toMatchObject({ aplicado: false, mensagem: MENSAGENS.cupomExpirado });
    });
  }

  test('CT10 [CA02] cupom só com espaços é tratado como cupom vazio', async ({ request }) => {
    test.info().annotations.push({ type: 'bug', description: BUGS.cupomSoEspacos });
    test.fail(true, BUGS.cupomSoEspacos);

    const vazio = await (await calcularCarrinho(request, MOCHILA, '')).json();
    expect(vazio.cupom).toBeNull();

    const soEspacos = await (await calcularCarrinho(request, MOCHILA, '   ')).json();
    expect(soEspacos.cupom).toBeNull();
  });
});
