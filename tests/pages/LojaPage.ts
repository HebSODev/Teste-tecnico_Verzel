import type { Locator, Page } from '@playwright/test';
import { PRODUTOS, type ProdutoId } from '../support/dados';

export class LojaPage {
  constructor(private readonly page: Page) {}

  async abrir() {
    await this.page.goto('/');
  }

  card(produtoId: ProdutoId): Locator {
    return this.page.getByRole('article', { name: PRODUTOS[produtoId].nome });
  }

  botaoAdicionar(produtoId: ProdutoId): Locator {
    return this.card(produtoId).getByRole('button', { name: 'Adicionar ao carrinho' });
  }

  /** Clica em "Adicionar ao carrinho" e espera o recálculo do carrinho na API. */
  async adicionar(produtoId: ProdutoId, vezes = 1) {
    for (let i = 0; i < vezes; i++) {
      await Promise.all([
        this.page.waitForResponse((r) => r.url().includes('/api/carrinho/calcular')),
        this.botaoAdicionar(produtoId).click(),
      ]);
    }
  }

  contadorCarrinho(): Locator {
    return this.page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name: /Carrinho/ });
  }

  async irParaCarrinho() {
    await this.contadorCarrinho().click();
    await this.page.waitForURL('**/carrinho');
  }
}
