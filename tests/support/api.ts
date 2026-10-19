import type { APIRequestContext } from '@playwright/test';
import type { Item } from './calculo';

export type Cliente = { nome?: string; email?: string; cep?: string };

export const calcularCarrinho = (request: APIRequestContext, itens: unknown, cupom?: string) =>
  request.post('/api/carrinho/calcular', { data: cupom === undefined ? { itens } : { itens, cupom } });

export const criarPedido = (
  request: APIRequestContext,
  body: { cliente?: Cliente; itens: Item[] | unknown; cupom?: string },
) => request.post('/api/pedidos', { data: body });
