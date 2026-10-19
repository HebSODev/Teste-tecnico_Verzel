import {
  FRETE_FIXO,
  LIMITE_FRETE_GRATIS,
  PRODUTOS,
  type ProdutoId,
} from './dados';

export type Item = { produtoId: ProdutoId; quantidade: number };

export type Resumo = {
  subtotal: number;
  desconto: number;
  frete: number;
  freteGratis: boolean;
  valorFaltanteFreteGratis: number;
  total: number;
};

export const arredondar = (valor: number) =>
  Math.round((valor + Number.EPSILON) * 100) / 100;

/**
 * Oráculo: calcula o resumo esperado direto das "Regras de cálculo" da documentação,
 * para comparar com o que a API e a interface devolvem.
 */
export function resumoEsperado(itens: Item[], percentualDesconto = 0): Resumo {
  const subtotal = arredondar(
    itens.reduce((soma, i) => soma + PRODUTOS[i.produtoId].preco * i.quantidade, 0),
  );
  const desconto = arredondar((subtotal * percentualDesconto) / 100);
  const freteGratis = subtotal >= LIMITE_FRETE_GRATIS;
  const frete = freteGratis ? 0 : FRETE_FIXO;
  return {
    subtotal,
    desconto,
    frete,
    freteGratis,
    valorFaltanteFreteGratis: arredondar(Math.max(0, LIMITE_FRETE_GRATIS - subtotal)),
    total: arredondar(subtotal - desconto + frete),
  };
}

const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** 199.8 -> "R$ 199,80", com espaço normal para casar com o texto da tela. */
export const brl = (valor: number) => formatador.format(valor).replace(/\s/g, ' ');

/** CA11: o número serializado não pode ter 3+ casas (ex.: 179.70000000000002). */
export const temNoMaximoDuasCasas = (valor: number) =>
  Number.isFinite(valor) && !/\.\d{3,}/.test(String(valor));
