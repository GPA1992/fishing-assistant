# IA - Influência da Chuva na Pesca em Água Doce: Uma Perspectiva Ambiental Integrada

### Estudo baseado em variáveis meteorológicas aplicadas à previsão de atividade pesqueira no sistema Pesca Assistente

---

## 1. Introdução

A chuva é um dos fatores climáticos mais complexos e influentes na atividade de peixes em ambientes de água doce. Seus efeitos se manifestam tanto de forma direta — alterando a visibilidade, temperatura e oxigenação da água — quanto de forma indireta — interferindo nos padrões de alimentação, migração e reprodução de diversas espécies. Integrar dados detalhados de precipitação ao sistema Pesca Assistente é essencial para prever quedas ou aumentos de produtividade na pesca.

---

## 2. Variáveis de Chuva no Pesca Assistente

O sistema trabalha com as seguintes variáveis meteorológicas:

time: string;
probability: number;
total: number;
rain: number;
showers: number;

### Significado:

- **`probability` (probabilidade de chuva)**: indica o risco de ocorrência de precipitação em determinado horário. Valores acima de 60% já exigem atenção por parte do pescador.
- **`total` (precipitação total)**: volume acumulado de chuva em milímetros (mm), usado para avaliar saturação do solo e alteração do nível dos corpos hídricos.
- **`rain` (chuva contínua)**: precipitação de baixa a média intensidade, mas sustentada no tempo.
- **`showers` (pancadas de chuva)**: eventos curtos e intensos, geralmente localizados, com grande impacto térmico e de oxigenação.
- **`time`**: horário previsto, útil para correlacionar chuva com janelas solunares e fases lunares.

---

## 3. Efeitos Diretos da Chuva sobre a Atividade dos Peixes

### 🌫️ Visibilidade e turbidez

- Chuvas intensas (especialmente `showers`) aumentam a **turbidez da água**, dificultando a caça por espécies predadoras visuais como tucunaré, traíra e dourado.
- A pesca com iscas visuais torna-se menos eficaz — iscas sonoras, vibratórias ou com aroma se tornam preferenciais.

### 💨 Oxigenação e mistura térmica

- Pancadas de chuva geram **oxigenação superficial** e resfriamento súbito, o que pode:
    - Estimular a movimentação de peixes de superfície e meia água.
    - Reduzir a atividade de espécies mais sensíveis a flutuações térmicas.

### 🌡️ Temperatura da água

- Chuvas prolongadas reduzem a temperatura da lâmina d'água, especialmente em poços e áreas rasas.
- Espécies tropicais, como tilápias e lambaris, tendem a reduzir sua atividade metabólica nessas condições.

---

## 4. Efeitos Indiretos e Padrões Comportamentais

### 🍽️ Alimentação pós-chuva

- A **primeira chuva após período seco** (ou “chuva da fome”) mobiliza organismos como insetos, minhocas e larvas, aumentando a oferta de alimento e atraindo peixes para margens e áreas alagadas.
- Espécies como piaus, pacus e tambacus se aproximam da vegetação recém-alagada, sendo momentos excelentes para pesca com iscas naturais.

### 🧬 Gatilhos reprodutivos

- Em algumas espécies migratórias, chuvas intensas **funcionam como gatilho para a piracema** — como curimatãs e dourados — pois elevam o nível dos rios e abrem rotas de migração.

---

## 5. Estratégias com Base no Tipo de Precipitação

| Tipo de Chuva | Estratégia Recomendada | Observações |
| --- | --- | --- |
| Sem chuva | Aproveitar períodos solunares e luminosos com iscas visuais | Ideal para peixes predadores |
| Chuva fraca e contínua (`rain`) | Usar iscas naturais ou aromatizadas; focar em espécies bentônicas | Boa para bagres e cascudos |
| Pancadas de chuva (`showers`) | Esperar estabilização, pescar após o evento | Pode coincidir com pico de atividade |
| Pós-chuva intensa | Explorar margens, áreas de vegetação e entradas de água | Ótimo para peixes onívoros |

---

## 6. Aplicações no Pesca Assistente

Com base na previsão meteorológica horária do Open-Meteo, o sistema pode:

- Cruzar **probabilidade de chuva** com `majorPeriods` e `moonIllumination` para **ajustar recomendações de horário e isca**.
- Evitar sugerir horários durante **pancadas intensas**, exceto se precedidas por bom índice solunar.
- Sinalizar dias com **"chuva da fome"** como potencialmente **altamente produtivos** — principalmente quando coincidirem com `sunRise` e `moonTransit`.
- Adaptar o **índice preditivo de sucesso** (`dayRating`) ponderando os impactos negativos ou positivos da chuva.

---

## 7. Conclusão

A chuva transforma o ambiente aquático em múltiplos níveis: físico, químico e comportamental. Compreender e integrar suas nuances ao Pesca Assistente permite elevar o nível de precisão preditiva, resultando em estratégias mais realistas, seguras e eficazes. Pescar na chuva pode ser frustrante — ou extremamente produtivo — dependendo do momento, da espécie e da leitura correta dos sinais naturais.

---

## 📚 Referências Bibliográficas

- Nogueira, L. A. & Hahn, N. S. (2015). *Efeitos da precipitação sobre a alimentação de peixes em planícies alagáveis tropicais*. Neotropical Ichthyology.
- Silva, J. C. et al. (2019). *Environmental triggers of fish reproduction in Neotropical rivers: the role of rainfall and temperature*. Environmental Biology of Fishes.
- Arantes, F. P. et al. (2022). *Hydrological dynamics and their influence on freshwater fish behavior*. Aquatic Sciences.
- NOAA (2023). *Rainfall patterns and aquatic ecosystems*.
- Open-Meteo API documentation.