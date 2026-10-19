import type { Locator, Page } from '@playwright/test';

/** Bloco "Resumo do pedido" (lista de definição dt/dd), igual no carrinho e no checkout. */
export class ResumoPedido {
  readonly regiao: Locator;

  constructor(page: Page, nomeRegiao = 'Resumo do pedido') {
    this.regiao = page.getByRole('region', { name: nomeRegiao });
  }

  private valor(termo: RegExp): Locator {
    return this.regiao.locator('dt', { hasText: termo }).locator('xpath=following-sibling::dd[1]');
  }

  get subtotal() { return this.valor(/^Subtotal$/); }
  get desconto() { return this.valor(/^Desconto/); }
  get rotuloDesconto() { return this.regiao.locator('dt', { hasText: /^Desconto/ }); }
  get frete() { return this.valor(/^Frete$/); }
  get total() { return this.valor(/^Total$/); }
  get faltanteFreteGratis() { return this.regiao.getByText(/para o frete grátis/); }
}
