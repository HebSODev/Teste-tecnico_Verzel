import type { Locator, Page } from '@playwright/test';
import type { Cliente } from '../support/api';
import { ResumoPedido } from './ResumoPedido';

export class CheckoutPage {
  readonly nome: Locator;
  readonly email: Locator;
  readonly cep: Locator;
  readonly confirmar: Locator;
  readonly resumo: ResumoPedido;

  constructor(private readonly page: Page) {
    this.nome = page.getByRole('textbox', { name: 'Nome completo' });
    this.email = page.getByRole('textbox', { name: 'E-mail' });
    this.cep = page.getByRole('textbox', { name: 'CEP' });
    this.confirmar = page.getByRole('button', { name: 'Confirmar pedido' });
    this.resumo = new ResumoPedido(page);
  }

  async preencher(cliente: Cliente) {
    await this.nome.fill(cliente.nome ?? '');
    await this.email.fill(cliente.email ?? '');
    await this.cep.fill(cliente.cep ?? '');
  }

  erro(texto: string | RegExp): Locator {
    return this.page.getByRole('main').getByText(texto);
  }
}

export class PedidoConfirmadoPage {
  readonly titulo: Locator;
  readonly resumo: ResumoPedido;

  constructor(page: Page) {
    this.titulo = page.getByRole('heading', { level: 1, name: /^Pedido VZ-\d{6}$/ });
    this.resumo = new ResumoPedido(page, 'Itens do pedido');
  }
}
