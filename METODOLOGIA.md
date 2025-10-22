# 🩸 Hemocentro Totem A/B Test - Metodologia e Participação

## 📋 Sobre o Projeto

Este é um projeto de **pesquisa em UX/UI** para otimizar a experiência de doação de sangue no Hemocentro. O objetivo é comparar duas interfaces diferentes para entrada de CPF no totem de autoatendimento, medindo qual oferece melhor usabilidade e eficiência.

### 🎯 Objetivo Principal
Demonstrar através de dados quantitativos qual interface oferece:
- **Menor tempo de interação**
- **Menos erros de digitação**
- **Melhor experiência do usuário**

---

## 🔬 Metodologia Científica

### 📊 Como Funciona o Teste A/B

1. **Divisão Aleatória**: Os usuários são automaticamente direcionados para uma das duas versões:
   - **Versão A**: Interface atual (botões coloridos e desalinhados)
   - **Versão B**: Nova interface proposta (padrão de mercado, reduz carga mental)

2. **Coleta de Dados Anônimos**:
   - ⏱️ **Tempo de interação**: Medido automaticamente
   - 🔢 **Número de erros**: Contagem de correções/apagamentos
   - 🎯 **Taxa de conclusão**: Sucesso na tarefa
   - 📱 **Comportamento**: Análise de cliques e navegação

3. **Ferramentas de Análise**:
   - **Microsoft Clarity**: Gravações de sessão (com mascaramento de dados sensíveis)
   - **Google Sheets + Apps Script**: Consolidação e análise de dados
   - **Angular**: Framework desenvolvido com auxílio de IA

### 🔒 Privacidade e Segurança

- ✅ **Dados Sensíveis Protegidos**: CPF é mascarado em todas as gravações
- ✅ **Não Armazenamento**: CPF não é salvo ou persistido
- ✅ **Anonimização**: Apenas métricas agregadas são coletadas
- ✅ **HTTPS**: Comunicação segura via GitHub Pages
- ✅ **LGPD Compliant**: Coleta mínima e transparente

---

## 🎨 As Duas Interfaces

### Versão A - Interface Atual
- **Estilo**: Botões coloridos e desalinhados
- **Layout**: Teclado numérico com cores vibrantes
- **Feedback**: Visual imediato da digitação
- **Características**: Interface com múltiplas cores, botões de tamanhos diferentes

### Versão B - Nova Interface Proposta
- **Estilo**: Padrão de mercado, design limpo
- **Layout**: Teclado numérico organizado em grid 3x3
- **Feedback**: Visualização progressiva com placeholders
- **Características**: Interface minimalista, reduz carga mental do usuário

---

## 🎨 Estrutura Detalhada das Interfaces

### Versão A - Interface Atual (Reinventando a Roda)
**Problema**: Interface customizada que não segue padrões estabelecidos

#### Layout e Organização:
- **Teclado Numérico**: 6 colunas × 2 linhas (12 botões)
- **Botões Desalinhados**: Tamanhos e espaçamentos inconsistentes
- **Cores Múltiplas**: Azul (#3a1bff), amarelo (#ffb200), verde (#10c351), vermelho (#ef3b2c), roxo (#8f07bf)
- **Hierarquia Visual**: Confusa com múltiplas cores competindo por atenção

#### Elementos Visuais:
- **Botões Principais**: Azul vibrante para números (0-9)
- **Botão Correção**: Amarelo para "CORRIGIR" 
- **Botão Continuar**: Verde para "CONTINUAR"
- **Botão Apagar**: Vermelho para "APAGAR"
- **Botão QR Code**: Roxo para "LER QRCODE"

#### Problemas de UX:
- ❌ **Carga Cognitiva Alta**: Múltiplas cores confundem o usuário
- ❌ **Padrão Não Familiar**: Usuário precisa aprender nova interface
- ❌ **Inconsistência Visual**: Botões de tamanhos diferentes
- ❌ **Hierarquia Confusa**: Todas as cores têm mesmo peso visual

### Versão B - Nova Interface (Seguindo Padrões Estabelecidos)
**Solução**: Interface que aproveita conhecimento existente dos PIN pads

#### Layout e Organização:
- **Teclado Numérico**: Grid 3×3 (padrão universal dos PIN pads)
- **Botões Uniformes**: Mesmo tamanho e espaçamento consistente
- **Paleta Neutra**: Cinza claro (#f9fafb) com bordas sutis
- **Hierarquia Clara**: Verde apenas para ação principal (OK)

#### Elementos Visuais:
- **Botões Numéricos**: Cinza neutro com bordas sutis
- **Botão Backspace**: Ícone universal de apagar
- **Botão OK**: Verde (#10b981) apenas para confirmação
- **Estados Visuais**: Hover, active e disabled bem definidos

#### Benefícios de UX:
- ✅ **Carga Cognitiva Baixa**: Interface familiar e intuitiva
- ✅ **Padrão Universal**: Usuário já conhece o layout 3×3
- ✅ **Consistência Visual**: Todos os botões seguem mesmo padrão
- ✅ **Hierarquia Clara**: Verde apenas para ação principal
- ✅ **Acessibilidade**: Estados visuais bem definidos

#### Por que Seguir Padrões Funciona:
- **Familiaridade**: Usuários já sabem usar PIN pads
- **Eficiência**: Menos tempo de aprendizado
- **Redução de Erros**: Interface previsível
- **Acessibilidade**: Padrões universais são mais inclusivos

---

### Tecnologia Utilizada
Este projeto foi desenvolvido utilizando **Inteligência Artificial** como ferramenta de desenvolvimento, demonstrando como a IA pode acelerar e otimizar o processo de criação de interfaces de usuário.

### Benefícios da IA no Desenvolvimento
- ⚡ **Desenvolvimento Acelerado**: Redução significativa no tempo de codificação
- 🎯 **Código Otimizado**: Implementação de melhores práticas automaticamente
- 🔧 **Debugging Inteligente**: Identificação e correção de problemas
- 📚 **Documentação Automática**: Geração de documentação técnica

### Stack Tecnológica
- **Frontend**: Angular (desenvolvido com IA)
- **Analytics**: Microsoft Clarity
- **Dados**: Google Sheets + Apps Script
- **Deploy**: GitHub Pages + GitHub Actions
- **IA**: Assistente de desenvolvimento para código e documentação

---

### Métricas Principais
1. **Tempo Total de Interação** (segundos)
2. **Número de Correções** (backspace/apagar)
3. **Taxa de Abandono** (usuários que não completam)
4. **Tempo por Dígito** (eficiência de digitação)

### Análise Estatística
- **Teste T**: Comparação de médias entre grupos
- **Teste Qui-quadrado**: Análise de proporções
- **Intervalo de Confiança**: 95% para significância estatística
- **Tamanho da Amostra**: Mínimo de 100 usuários por versão

### Critérios de Sucesso
A **Versão B** será considerada superior se:
- ⏱️ Reduzir o tempo de interação em ≥15%
- 🔢 Diminuir erros de digitação em ≥20%
- ✅ Aumentar taxa de conclusão em ≥10%

---

## 🤝 Como Participar

### Para Usuários/Voluntários
1. **Acesse**: [https://bolivaralencastro.github.io/hemocentro-totem-ab-test/](https://bolivaralencastro.github.io/hemocentro-totem-ab-test/)
2. **Digite um CPF**: Use qualquer CPF válido (formato: 000.000.000-00)
3. **Complete o teste**: Digite os 11 dígitos e clique em continuar
4. **Tempo estimado**: 30-60 segundos

### Para Pesquisadores/Designers
- **Código Fonte**: Disponível no GitHub
- **Metodologia**: Documentada neste arquivo
- **Dados**: Serão publicados após coleta suficiente
- **Contato**: [bolivaralencastro.com.br](https://bolivaralencastro.com.br)

---

## 📊 Resultados Esperados

### Impacto Esperado
- **Redução de 20-30%** no tempo de atendimento
- **Diminuição de 15-25%** em erros de digitação
- **Melhoria na satisfação** do usuário
- **Dados concretos** para decisões de design

### Aplicação Prática
Os resultados serão utilizados para:
- 🏥 **Implementação** em totens reais do Hemocentro
- 📚 **Publicação** de artigo científico
- 🎓 **Contribuição** para pesquisa em UX/UI
- 💼 **Portfolio** de design de produto

---

## 🔬 Rigor Científico

### Controle de Variáveis
- **Ambiente**: Mesmo dispositivo/navegador
- **Instruções**: Idênticas para ambos os grupos
- **Medição**: Automática e objetiva
- **Randomização**: Algoritmo determinístico

### Limitações Reconhecidas
- **Amostra**: Usuários com acesso à internet
- **Contexto**: Simulação vs. ambiente real
- **Dispositivo**: Teste em desktop/mobile
- **Motivação**: Voluntários vs. usuários reais

---

## 📞 Contato e Colaboração

### Autor do Projeto
**Bolívar Alencastro** - Product Designer
- 🌐 Website: [bolivaralencastro.com.br](https://bolivaralencastro.com.br)
- 💼 LinkedIn: [linkedin.com/in/bolivaralencastro](https://linkedin.com/in/bolivaralencastro)
- 📧 Email: contato@bolivaralencastro.com.br

### Como Contribuir
- **Teste o projeto**: Use e compartilhe feedback
- **Divulgue**: Compartilhe com sua rede
- **Colabore**: Sugira melhorias ou análises
- **Publique**: Use os dados em suas pesquisas

---

## 📝 Licença e Uso

Este projeto é **open source** e os dados coletados serão **publicamente disponíveis** para:
- ✅ Pesquisas acadêmicas
- ✅ Estudos de UX/UI
- ✅ Desenvolvimento de produtos
- ✅ Educação em design

**Condição**: Citar a fonte e autor em publicações.

---

## 🚀 Próximos Passos

1. **Coleta de Dados**: 2-4 semanas
2. **Análise Estatística**: 1 semana
3. **Publicação de Resultados**: Blog + LinkedIn
4. **Apresentação**: Comunidade de UX/UI
5. **Implementação**: Proposta ao Hemocentro

---

*"Design não é apenas como algo parece e se sente. Design é como funciona."* - Steve Jobs

**Participe e ajude a melhorar a experiência de doação de sangue! 🩸**
