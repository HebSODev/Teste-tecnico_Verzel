// Massa de teste da seção "Dados para teste" da documentação (VZS-142).

export const PRODUTOS = {
  P001: { nome: 'Camiseta Essencial', preco: 59.9 },
  P002: { nome: 'Calça Jeans Slim', preco: 139.9 },
  P003: { nome: 'Tênis Casual Urbano', preco: 189.9 },
  P004: { nome: 'Boné Aba Curva', preco: 49.9 },
  P005: { nome: 'Mochila Urbana 20L', preco: 100 },
  P006: { nome: 'Kit 3 Pares de Meias', preco: 29.9 },
  P007: { nome: 'Jaqueta Corta-Vento', preco: 229.9 },
  P008: { nome: 'Garrafa Térmica 750ml', preco: 50 },
} as const;

export type ProdutoId = keyof typeof PRODUTOS;

export const CUPONS = {
  valido: 'BEMVINDO10',
  expirado: 'VERAO2026',
  inexistente: 'NAOEXISTE',
} as const;

export const MENSAGENS = {
  cupomAplicado: 'Cupom aplicado: 10% de desconto nos produtos.',
  cupomInvalido: 'Cupom inválido.',
  cupomExpirado: 'Cupom expirado.',
} as const;

export const FRETE_FIXO = 19.9;
export const LIMITE_FRETE_GRATIS = 200;
export const QUANTIDADE_MAXIMA = 5;

export const CLIENTE_VALIDO = {
  nome: 'Maria Silva',
  email: 'maria@exemplo.com',
  cep: '01310-100',
};

// Mapeamento entre o ID do bug e o relatório em docs/03-bugs.md.
export const BUGS = {
  freteNoLimite: 'BUG-001: frete cobrado com subtotal igual a R$ 200,00 (CA06)',
  quantidadeMaximaApi: 'BUG-002: API aceita mais de 5 unidades por produto (CA10)',
  cupomSoEspacos: 'BUG-003: cupom só com espaços retorna "Cupom inválido." em vez de ser ignorado (CA02)',
} as const;
