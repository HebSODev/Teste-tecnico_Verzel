import path from 'node:path';
import { test as base } from '@playwright/test';
import { CarrinhoPage } from '../pages/CarrinhoPage';
import { CheckoutPage, PedidoConfirmadoPage } from '../pages/CheckoutPage';
import { LojaPage } from '../pages/LojaPage';

type Paginas = {
  loja: LojaPage;
  carrinho: CarrinhoPage;
  checkout: CheckoutPage;
  confirmacao: PedidoConfirmadoPage;
};

// Com EVIDENCIAS=1, salva o estado final da tela de cada teste em docs/evidencias/e2e/.
const PASTA_EVIDENCIAS = path.join(__dirname, '..', '..', 'docs', 'evidencias', 'e2e');

// Cada teste roda num contexto novo, então o carrinho (guardado na aba) sempre começa vazio.
export const test = base.extend<Paginas & { evidencia: void }>({
  evidencia: [
    async ({ page }, use, testInfo) => {
      await use();
      if (!process.env.EVIDENCIAS) return;
      const nome = testInfo.title
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^\w\-]+/g, '-').replace(/-+/g, '-').replace(/-$/, '');
      await page.screenshot({ path: path.join(PASTA_EVIDENCIAS, `${nome}.png`), fullPage: true });
    },
    { auto: true },
  ],
  loja: async ({ page }, use) => {
    const loja = new LojaPage(page);
    await loja.abrir();
    await use(loja);
  },
  carrinho: async ({ page }, use) => use(new CarrinhoPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
  confirmacao: async ({ page }, use) => use(new PedidoConfirmadoPage(page)),
});

export { expect } from '@playwright/test';
