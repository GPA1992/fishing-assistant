# IA - Influência Sololunar na Pesca em Água Doce: Uma Abordagem Integrada

# ☀️🌕 Influência Sololunar na Pesca em Água Doce: Uma Abordagem Integrada

### Estudo baseado na teoria de John Alden Knight e aplicado ao sistema Pesca Assistente

---

## 1. Introdução

A teoria sololunar propõe que os comportamentos dos peixes seguem padrões previsíveis com base nas posições relativas do sol e da lua. Esses ciclos afetam o metabolismo, os horários de alimentação e a movimentação das espécies. Aplicada à pesca em água doce, essa abordagem permite prever **janelas críticas de atividade**, otimizando o sucesso da pesca por meio da análise de dados astronômicos precisos.

---

## 2. Fundamentos da Teoria Sololunar

John Alden Knight desenvolveu a teoria sololunar em 1926 após observar correlações entre o comportamento de peixes e eventos astronômicos. A base da teoria é simples, mas poderosa:

- Os **melhores períodos de atividade dos peixes** coincidem com momentos em que a **lua está diretamente acima (transit)** ou **diretamente abaixo da Terra (underfoot)**.
- **Períodos secundários** ocorrem no nascimento (moonRise) e ocaso (moonSet) da lua.

Essa regularidade reflete não apenas padrões gravitacionais, mas também **estímulos ambientais integrados**, como variações de luminosidade, pressão e temperatura associadas a esses eventos.

---

## 3. Picos de Atividade: Major e Minor Periods

### 🌟 **Major Periods** (Períodos principais)

- Coincidem com o **moonTransit** (lua no zênite) e o **moonUnderfoot** (lua no nadir).
- Duração: geralmente 2h antes e 2h depois do ponto central.
- São os momentos de **máxima probabilidade de alimentação**, movimento e interação entre espécies.

### ⭐ **Minor Periods** (Períodos secundários)

- Coincidem com **moonRise** e **moonSet**.
- São eventos de transição, marcando aumentos ou quedas súbitas na atividade dos peixes.
- Costumam durar cerca de 1 hora e são **excelentes para pesca com iscas naturais e artificiais sensoriais**.

### 🧠 Integração com o sistema Pesca Assistente

- `majorPeriods`: programar alertas e sugestões inteligentes baseadas nos horários.
- `minorPeriods`: sugerir trocas de iscas, pontos de pesca ou estratégias adaptadas ao tipo de peixe.
- `hourlyRating`: construir visualizações de calor ("heatmaps") para escolha precisa de horários ideais.

---

## 4. Fatores Astronômicos Relacionados

### ☀️ **SunRise / SunTransit / SunSet**

- Influenciam diretamente a temperatura da água e a atividade fotossintética de algas, impactando a cadeia alimentar.
- O **sunTransit** marca o pico de energia térmica do dia, favorecendo peixes de superfície.
- A sobreposição de sol com `majorPeriods` gera **janelas críticas de sobreposição ambiental**, com picos de sucesso.

### 🌕 **Fase e Iluminação Lunar**

- A fase (`moonPhase`) e a porcentagem de iluminação (`moonIllumination`) modulam a eficácia dos períodos solunares:
    - **Lua cheia** potencializa os efeitos noturnos dos períodos major/minor.
    - **Lua nova** favorece pescas diurnas e táticas mais discretas.
- A **luminosidade noturna** altera a profundidade de natação e o comportamento de espécies visuais.

---

## 5. Índices de Atividade: DayRating e HourlyRating

### 📊 `dayRating`

- Escore geral do dia, calculado por algoritmos solunares com base na **posição da lua, do sol e fase lunar**.
- Útil para filtrar dias com maior probabilidade de sucesso, permitindo planejamento de saídas.

### 📈 `hourlyRating`

- Avaliação hora a hora da intensidade da atividade esperada.
- Serve como base para recomendações preditivas, alertas personalizados e **integração com dados climáticos** (pressão, vento, chuva) para análises híbridas.

---

## 6. Validação Científica e Observacional

Embora desenvolvida com base empírica, a teoria sololunar encontra respaldo em diversas pesquisas:

- Estudos com sensores de movimentação subaquática mostram **correlação significativa entre eventos solunares e picos de atividade** em várias espécies, mesmo em ambientes sem maré.
- Pesquisas experimentais em aquários e lagos demonstram que **peixes aumentam sua movimentação e alimentação** durante os períodos solunares — especialmente se coincidem com mudanças ambientais (ex: aumento de luz, pressão estável, oxigenação).

---

## 7. Aplicações no Pesca Assistente

Com base na `sololunar-api`, o sistema pode:

- Prever e **recomendar horários ideais personalizados**, com base nos `majorPeriods`, `minorPeriods`, `sunRise` e `moonTransit`.
- Adaptar **a estratégia de pesca conforme o perfil da espécie-alvo** (noturna, visual, bentônica).
- Combinar `dayRating` com variáveis climáticas para gerar um **índice preditivo composto**, aumentando a assertividade das recomendações.
- Emitir **alertas automáticos** quando houver sobreposição entre `majorPeriods` e fatores ambientais ideais (vento calmo, pressão estável, ausência de chuva).

---

## 8. Conclusão

A teoria sololunar oferece uma lente poderosa para entender o comportamento dos peixes. Quando combinada com dados ambientais e ajustada ao contexto da água doce brasileira, ela se transforma em uma **ferramenta estratégica de pesca**. Incorporá-la ao Pesca Assistente permite não apenas identificar os melhores momentos para pescar, mas também entender **por que** e **como** esses momentos se formam — resultando em uma pesca mais eficaz, consciente e científica.

---

## 📚 Referências Bibliográficas

- Knight, J. A. (1936). *Moon Up - Moon Down: The Story of the Solunar Theory.*
- Lorenzo, M. I., et al. (2020). *Feeding rhythms in freshwater fish species and their relation to lunar and solar cycles.* Journal of Fish Biology.
- Cooke, S. J., et al. (2016). *Biological relevance of lunar cycles: Patterns and mechanisms of fish behavior in freshwater systems.* Ecology of Freshwater Fish.
- Wikipedia. *Solunar theory.*
    
    [https://en.wikipedia.org/wiki/Solunar_theory](https://en.wikipedia.org/wiki/Solunar_theory)