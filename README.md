Justificativa Técnicas

1. Abordagem de Arquitetura Limpa e Divisão em Microsserviços
A decisão de estruturar o simulador de combates utilizando a Arquitetura Limpa (Clean Architecture) visa isolar completamente as regras essenciais do jogo (cálculos matemáticos, matriz de elementos, rolagem de dados) de detalhes voláteis de infraestrutura (renderização de cores no terminal, frameworks de teste ou persistência de dados).

O projeto simula o núcleo operacional de um ecossistema escalável de Microsserviços. A engine de simulação mecânica funciona de forma isolada dentro do contêiner battle-service. As responsabilidades são distribuídas em camadas bem definidas:

Domain (Domínio): Contém as entidades puras e as regras imutáveis do RPG (o sistema elementar e o ciclo de vida dos modificadores). É a camada de maior granularidade e não possui dependências externas.

Application (Aplicação): Orquestra os fluxos através de Casos de Uso (BattleUseCase), gerenciando a sequência de turnos e rodadas sem saber onde ou como os dados serão exibidos.

Infrastructure (Infraestrutura): Funciona como a borda do sistema, implementando adaptadores externos, configurações ambientais e os controladores de exibição de tela (UIController).

Essa separação garante que, caso o sistema evolua futuramente de uma interface de terminal para uma API Web baseada em HTTP ou consuma mensagens de filas assíncronas (como RabbitMQ), a lógica interna do combate permanecerá rigorosamente intocada.

2. Conteinerização com Docker e Docker Compose
O uso do Docker e do Docker Compose soluciona o problema clássico de inconsistência de ambientes de execução ("na minha máquina funciona"). A infraestrutura foi totalmente isolada dentro de uma imagem leve baseada em node:20-alpine.

A conteinerização garante que o gerenciamento de dependências, o interpretador de módulos ESM e a execução das variáveis experimentais necessárias para rodar o Jest aconteçam em um ambiente controlado e idêntico, independentemente de a aplicação rodar localmente no VS Code ou de forma totalmente distribuída na nuvem via GitHub Codespaces.

3. Aplicação Prática dos Design Patterns (Padrões de Projeto)
Para resolver problemas recorrentes de acoplamento e extensão no motor de RPG, foram aplicados quatro padrões de projeto consagrados:

Strategy (Estratégia): Implementado na classe DiceStrategy. Ele encapsula o algoritmo estocástico de rolagens de dados (D20 e dados de dano). Isolar essa lógica em uma estratégia intercambiável facilita a modificação futura do sistema físico de dados ou a injeção de sementes determinísticas para testes específicos sem afetar os Casos de Uso.

Decorator (Decorador): Aplicado na evolução de itens através do CharacterModifier e suas extensões (Armaduras, Armas e Rituais). Em jogos de RPG, personagens ganham e perdem modificadores dinamicamente. O padrão Decorator permite anexar e encadear novos comportamentos e atributos às fichas de forma cumulativa em tempo de execução, evitando a explosão de subclasses rígidas que causariam o colapso da manutenção do código.

Factory Method (Método Fábrica): Centralizado na classe EntityFactory. Ele encapsula a complexidade e a responsabilidade de instanciar personagens investigadores e monstros elementares. A fábrica também gerencia de forma limpa a probabilidade matemática do sistema, injetando as chances de Loot Drop (1/5 de chance para cada categoria de item) e a geração randômica simétrica de encontros paranormais (1/4 de chance para cada monstro ou chefe).

Observer (Observador): Viabilizado através do GameEventEmitter acoplado ao UIController. O motor de batalha publica eventos abstratos (FICHA, MSG, HIT_CRIT, HP_UPDATE) enquanto o controlador reage a eles aplicando as regras visuais de cores ANSI e espaçamento de tela. Isso remove totalmente o acoplamento entre a lógica de negócios e as instruções de saída de IO (como console.log).

4. Aderência aos Princípios SOLID
O design do código reflete o cumprimento estrito dos princípios de design orientado a objetos:

S - Single Responsibility Principle (Responsabilidade Única): Cada classe executa exclusivamente uma função dentro de seu escopo. O modificador calcula, o dado sorteia, a fábrica monta, o caso de uso dita o turno e o controlador exibe.

O - Open/Closed Principle (Aberto/Fechado): O sistema é aberto para extensão e fechado para modificação. A inclusão de novas armas elementares, armaduras que alteram o elemento nativo do personagem ou novos rituais táticos é feita criando novos Decorators isolados, sem alterar a classe base Character.

L - Liskov Substitution Principle (Substituição de Liskov): Todos os objetos decorados expõem a mesma assinatura de métodos públicos herdados e podem substituir a classe base Character a qualquer momento em qualquer Caso de Uso sem quebrar a estabilidade da aplicação.

I - Interface Segregation Principle (Segregação de Interface): O JavaScript não possui interfaces nativas, mas o princípio é respeitado na assinatura enxuta das classes. As entidades expõem apenas métodos estritamente operacionais de combate, mantendo métodos de exibição e controle totalmente segregados em adaptadores de infraestrutura.

D - Dependency Inversion Principle (Inversão de Dependência): O BattleUseCase não depende de uma implementação concreta de exibição no terminal. Ele depende da abstração genérica fornecida pelo emissor de eventos, invertendo o fluxo de controle em favor do desacoplamento.

5. Qualidade de Código com Clean Code, TDD e BDD
A estabilidade matemática das regras de combate foi assegurada por metodologias modernas de qualidade de software:

Evidências de Clean Code: O código prioriza a legibilidade máxima através de nomes de métodos altamente expressivos e intuitivos (como takeDamage, getEntityElement), funções de escopo pequeno, ausência de comentários redundantes e tratamento preventivo de condições de borda (por exemplo, uso do Math.max(0, ...) para blindar a vida das entidades e impedir a existência de valores inconsistentes de HP negativo).

TDD (Test-Driven Development): O desenvolvimento orientado a testes guiou a arquitetura do sistema. O ciclo de feedback rápido do TDD permitiu identificar e corrigir problemas complexos de concorrência e prototipagem do ciclo de vida de inicialização de getters e setters no JavaScript, resultando na refatoração madura das propriedades dinâmicas do domínio para métodos puros de consulta.

BDD (Behavior-Driven Development): Os cenários estruturados com a sintaxe Gherkin aproximaram a especificação tática do sistema à linguagem humana natural. Mapear os comportamentos esperados (como o cálculo da metade do dano arredondado para cima na Resistência Elemental ou a redução de dano estático em Imunidades por Afinidade) garantiu que o código final implementasse exatamente os critérios de aceitação exigidos pelas regras de design do jogo.


E apenas para finalizar, não subi a aplicação para algum servidor porque os gratuitos não funcionaram ou eu já havia utilizado para servidores de jogos com meus amigos :)
