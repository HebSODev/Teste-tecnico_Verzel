import type { Locator, Page } from '@playwright/test';
import { PRODUTOS, type ProdutoId } from '../support/dados';
import { ResumoPedido } from './ResumoPedido';

export class CarrinhoPage {
  readonly resumo: ResumoPedido;
  readonly campoCupom: Locator;
  readonly botaoAplicarCupom: Locator;
  readonly botaoRemoverCupom: Locator;
  readonly mensagemCupom: Locator;
  readonly cupomAplicado: Locator;
  readonly finalizarCompra: Locator;

  constructor(private readonly page: Page) {
    this.resumo = new ResumoPedido(page);
    this.campoCupom = page.getByRole('textbox', { name: 'Cupom de desconto' });
    this.botaoAplicarCupom = page.getByRole('button', { name: 'Aplicar cupom' });
    this.botaoRemoverCupom = page.getByRole('button', { name: 'Remover cupom' });
    this.mensagemCupom = page.getByRole('main').getByRole('alert');
    this.cupomAplicado = page.getByText(/Cupom\s+\S+\s+aplicado\./);
    this.finalizarCompra = page.getByRole('link', { name: 'Finalizar compra' });
  }

  async abrir() {
    await this.page.goto('/carrinho');
  }

  private aguardarRecalculo() {
    return this.page.waitForResponse((r) => r.url().includes('/api/carrinho/calcular'));
  }

  quantidade(produtoId: ProdutoId): Locator {
    return this.page.getByRole('status', { name: `Quantidade de ${PRODUTOS[produtoId].nome}` });
  }

  botaoAumentar(produtoId: ProdutoId): Locator {
    return this.page.getByRole('button', { name: `Aumentar quantidade de ${PRODUTOS[produtoId].nome}` });
  }

  botaoDiminuir(produtoId: ProdutoId): Locator {
    return this.page.getByRole('button', { name: `Diminuir quantidade de ${PRODUTOS[produtoId].nome}` });
  }

  async aumentar(produtoId: ProdutoId) {
    await Promise.all([this.aguardarRecalculo(), this.botaoAumentar(produtoId).click()]);
  }

  async diminuir(produtoId: ProdutoId) {
    await Promise.all([this.aguardarRecalculo(), this.botaoDiminuir(produtoId).click()]);
  }

  async aplicarCupom(codigo: string) {
    await this.campoCupom.fill(codigo);
    await Promise.all([this.aguardarRecalculo(), this.botaoAplicarCupom.click()]);
  }

  async removerCupom() {
    await Promise.all([this.aguardarRecalculo(), this.botaoRemoverCupom.click()]);
  }

  async irParaCheckout() {
    await this.finalizarCompra.click();
    await this.page.waitForURL('**/checkout');
  }
}
