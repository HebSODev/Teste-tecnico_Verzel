# Uso de IA

Registro para o campo "Onde e como você usou IA" do formulário de envio.

**Ferramenta:** Claude Code (Anthropic), usado como par de trabalho no terminal.

| Etapa | Como a IA ajudou | O que foi feito/validado por mim |
|---|---|---|
| Análise de requisitos | Leitura do PDF e da documentação; levantamento de critérios, regras e ambiguidades | Revisão das interpretações das ambiguidades |
| Exploração da API | Montagem das requisições de exploração (curl) e de um script que compara as respostas com a fórmula da documentação | Conferência dos resultados divergentes |
| Cenários Gherkin | Rascunho dos `.feature` a partir dos CAs | Revisão de cobertura e linguagem |
| Automação Playwright | Estrutura do projeto, page objects e specs de API e UI | Execução local, verificação de estabilidade (`--repeat-each=2`) |
| Bugs e evidências | Rascunho dos relatórios e captura automatizada de prints e JSONs | Reprodução manual de cada bug na loja |
| Execução e exploratório | Roteiros das sessões exploratórias (charters) automatizados com Playwright, a tabela de resultado por cenário e o índice de evidências | Conferência manual dos cenários de UI no navegador |


