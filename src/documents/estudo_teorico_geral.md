# Nucleo

# Núcleo Teórico do Pesca Assistente

## 1. Introdução

A previsão de sucesso na pesca em água doce depende da compreensão integrada de fatores astronômicos (Lua e Sol), atmosféricos (temperatura, umidade, pressão e vento) e hidrometeorológicos (chuva). O comportamento alimentar, reprodutivo e locomotor dos peixes está profundamente ligado a esses estímulos ambientais. Ao sistematizar esses dados de forma estruturada e interpretável, o sistema *Pesca Assistente* pode gerar recomendações preditivas com base científica, adaptadas ao tempo, local e espécie-alvo.

---

## 2. Fatores da Lua

### 2.1. Fase e Iluminação Lunar (`moonPhase`, `moonIllumination`)

- A Lua percorre um ciclo de 29,5 dias com quatro fases principais (Nova, Crescente, Cheia, Minguante).
- Iluminação alta (>70%) favorece predadores visuais noturnos (ex: traíra, tucunaré, dourado).
- Iluminação baixa (<30%) favorece peixes oportunistas ou sensoriais (ex: bagres, mandis), sendo ideal o uso de iscas vibratórias, aromáticas ou sonoras.
- As fases também atuam como sincronizadores hormonais, regulando comportamentos reprodutivos, especialmente em períodos de piracema.

### 2.2. Nascimento e Ocaso da Lua (`moonRise`, `moonSet`)

- Determinam as janelas em que a Lua está presente no céu, influenciando a luminosidade e o comportamento noturno.
- Quando coincidem com o `sunrise` ou `sunset`, potencializam picos de atividade (sincronia ambiental).

---

## 3. Teoria Sololunar

### 3.1. Major e Minor Periods (`majorPeriods`, `minorPeriods`)

- **Major Periods**: ocorrem durante `moonTransit` (lua no zênite) e `moonUnderfoot` (lua no nadir). Representam os principais picos de alimentação.
- **Minor Periods**: ocorrem em `moonRise` e `moonSet`. Representam momentos de transição, ideais para iscas naturais e táticas sensoriais.

### 3.2. Validação e Aplicação

- Estudos indicam correlação estatística entre esses períodos e aumentos de movimentação alimentar.
- O cruzamento desses horários com variáveis climáticas melhora a precisão da previsão de sucesso pesqueiro.

### 3.3. Índices de Atividade (`dayRating`, `hourlyRating`)

- `dayRating`: escore diário geral baseado em sol, lua e fase.
- `hourlyRating`: granularidade horária do potencial de atividade, usado para construir heatmaps e alertas.

---

## 4. Clima e Suas Variáveis

### 4.1. Temperatura do Ar (`temperature_2m`)

- Faixa ideal: 22–28 °C para espécies tropicais.
- <20 °C: redução de atividade alimentar.
- 30 °C: estresse fisiológico e baixa oxigenação superficial.

### 4.2. Umidade Relativa (`relative_humidity_2m`)

- Alta umidade matinal (>80%) atrai insetos e favorece peixes insetívoros.
- Integrada com `sunRise`, indica manhãs produtivas.

### 4.3. Pressão Atmosférica (`surface_pressure`)

- Alta pressão estável (>1015 hPa): estimula alimentação.
- Quedas bruscas (>3 hPa): inibem atividade e sinalizam frente fria.

### 4.4. Velocidade do Vento (`wind_speed_10m`)

- 5–15 km/h: oxigenação e movimentação de nutrientes, ideal para ativar peixes de meia água.
- 25 km/h: excesso de turbulência, prejudica visibilidade e navegação.

---

## 5. Influência da Chuva

### 5.1. Tipos de Precipitação (`rain`, `showers`, `probability`, `total`, `time`)

| Tipo | Impacto | Estratégia |
| --- | --- | --- |
| `showers` | Aumenta turbidez e oxigenação | Pescar após o evento |
| `rain` | Reduz temperatura gradualmente | Iscas naturais e fundo |
| Pós-chuva intensa | Estímulo alimentar (chuva da fome) | Explorar margens e vegetação |
| Primeira chuva | Gatilho reprodutivo e alimentar | Alta produtividade esperada |

### 5.2. Aplicações Práticas

- Integrar `time` da chuva com `majorPeriods` para evitar sobreposição negativa.
- Sinalizar "chuva da fome" como eventos de oportunidade máxima.

---

## 6. Síntese Teórica

### 6.1. Cruzamento de Fatores

| Condição Combinada | Resultado Esperado |
| --- | --- |
| Alta pressão + moonTransit + temperatura ideal | Pico de alimentação |
| Queda de pressão + vento forte + chuva | Queda de produtividade |
| Pós-chuva + sunrise + umidade alta | Explosão alimentar de peixes onívoros |
| Lua cheia + minorPeriod + vento leve | Notável atividade de predadores visuais |

### 6.2. Relevância Relativa dos Fatores (peso conceitual)

| Variável | Peso Teórico | Dependência Contextual |
| --- | --- | --- |
| MajorPeriods | Muito Alto | Validade geral |
| Pressão atmosférica | Alto | Especialmente útil para predição negativa |
| Temperatura | Alto | Regula metabolismo |
| Iluminação lunar | Médio-Alto | Afeta estratégias e espécies noturnas |
| Vento | Médio | Importante para oxigenação e visibilidade |
| Chuva | Variável | Pode ser estímulo ou obstáculo |

---

## 7. Conclusão

A eficácia na pesca não depende de um único fator, mas do alinhamento dinâmico entre eventos astronômicos e condições climáticas. O sistema *Pesca Assistente* integra essas variáveis com granularidade horária e sensibilidade ecológica, permitindo gerar previsões que não apenas indicam o "quando" pescar, mas explicam o "porquê". Essa base teórica oferece o raciocínio que orienta decisões automatizadas, recomendações adaptativas e aprendizado contínuo a partir da coleta de dados reais.

---

## Referências Bibliográficas

- Pulver, J. R., et al. (2017). *Does the Lunar Cycle Affect Reef Fish Catch Rates?*
- NC Sea Grant (2024). *How does the moon phase affect fish?*
- Knight, J. A. (1936). *Moon Up - Moon Down: The Story of the Solunar Theory.*
- Silva, J. C. et al. (2019). *Environmental triggers of fish reproduction in Neotropical rivers.*
- NOAA (2023). *Rainfall patterns and aquatic ecosystems.*
- Open-Meteo API Documentation.
- Wikipedia. *Solunar theory.*
- Cooke, S. J., et al. (2016). *Environmental physiology of freshwater fishes.*
- Arantes, F. P. et al. (2022). *Hydrological dynamics and their influence on freshwater fish behavior.*