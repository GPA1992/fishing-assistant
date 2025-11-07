# IA - Influência Climática na Pesca em Água Doce: Uma Análise por Variável Ambiental

## 1. Introdução

O ambiente climático exerce influência direta sobre o comportamento dos peixes, afetando sua fisiologia, deslocamento, alimentação e reprodução. Ao integrar variáveis como **temperatura, umidade, pressão atmosférica e vento** com dados astronômicos (lunares e solares), é possível construir um modelo preditivo sofisticado e responsivo, como proposto no Pesca Assistente.

---

## 2. Temperatura do Ar a 2 Metros (`temperature_2m`)

A temperatura do ar próxima à superfície influencia, por condução e radiação, a temperatura da água — que é um dos principais determinantes da **atividade metabólica dos peixes**.

- **Temperaturas entre 22°C e 28°C**: consideradas ideais para a maioria das espécies tropicais de água doce, como tilápia, tucunaré e traíra.
- **Abaixo de 20°C**: ocorre uma **redução na atividade alimentar** de espécies tropicais. Os peixes tendem a buscar profundidades ou áreas com maior estabilidade térmica.
- **Acima de 30°C**: pode haver **queda na oxigenação** da água e estresse fisiológico.

🧠 **Aplicação prática**:

- Evitar sugerir horários de pesca com temperaturas extremas, especialmente se coincidir com pressão instável.
- Priorizar espécies mais adaptadas a cada faixa térmica.

---

## 3. Umidade Relativa do Ar a 2 Metros (`relative_humidity_2m`)

A umidade do ar afeta **a sensação térmica ambiental** e está relacionada à **formação de nevoeiros, orvalho e microclimas** que influenciam a pesca matutina.

- **Alta umidade (>80%)** nas primeiras horas do dia indica condições favoráveis para **atividade de insetos**, o que atrai peixes insetívoros.
- **Umidade baixa (<40%)** combinada com temperaturas elevadas pode levar à evaporação e aquecimento excessivo da lâmina d’água superficial.

🧠 **Aplicação prática**:

- Ajustar estratégias conforme a umidade: com alta umidade pela manhã, usar iscas naturais que imitem insetos.
- Integrar com `sunRise` para prever “manhãs produtivas”.

---

## 4. Pressão Atmosférica ao Nível da Superfície (`surface_pressure`)

A pressão atmosférica é um dos **principais indicadores da estabilidade ou instabilidade do tempo** e afeta diretamente o comportamento dos peixes.

- **Pressão estável e alta (>1015 hPa)**: tende a **favorecer a alimentação** dos peixes, especialmente quando combinada com vento fraco.
- **Quedas bruscas de pressão** (ex: >3 hPa em poucas horas): sinalizam **frentes frias** ou tempestades, o que reduz a atividade.
- **Baixa pressão constante (<1005 hPa)**: pode indicar tempo instável; peixes tornam-se inativos ou buscam refúgio.

🧠 **Aplicação prática**:

- Integrar a pressão com `dayRating` e `majorPeriods` para prever o sucesso da pesca.
- Emitir alertas de baixa produtividade quando houver queda acentuada de pressão.

---

## 5. Velocidade do Vento a 10 Metros (`wind_speed_10m`)

O vento afeta a **oxigenação da água**, a **dispersão de odores e partículas**, e **forma redemoinhos** que atraem peixes.

- **Ventos suaves (5–15 km/h)**: **oxigenam a superfície** e criam movimentação atrativa de insetos e matéria orgânica.
- **Ventos fortes (>25 km/h)**: podem causar **turbidez**, dificultar navegação e dispersar os cardumes.
- Direção do vento também é importante: vento que sopra em direção à margem pode concentrar nutrientes e atrair peixes para essas áreas.

🧠 **Aplicação prática**:

- Sugerir pontos de pesca favorecidos pelo vento lateral ou frontal leve.
- Reforçar uso de iscas sensoriais quando o vento provocar turbidez.

---

## 6. Integração Climática com os Ciclos Lunares e Solunares

Os efeitos das variáveis climáticas são potencializados (ou reduzidos) conforme a fase lunar e os períodos solunares:

| Condição Combinada | Resultado Provável |
| --- | --- |
| **Alta pressão + majorPeriod** | Pico de atividade: ótimo para predadores visuais |
| **Queda de pressão + chuva + vento forte** | Queda de produtividade: ideal evitar ou mudar tática |
| **Alta umidade + amanhecer + chuva leve anterior** | Momento ideal para espécies insetívoras em margens |
| **Temperatura ideal + moonUnderfoot + vento leve** | Ativação de peixes de meia profundidade |

---

## 7. Aplicações no Pesca Assistente

O sistema pode:

- Calcular um **índice climático de favorabilidade horária**, cruzando `value` dos dados com `hourlyRating`.
- Criar alertas como:
    - “🟢 Alta pressão e temperatura ideal: aproveite o pico de alimentação agora!”
    - “🔴 Queda rápida de pressão: atividade reduzida prevista.”
- Adaptar **recomendações de isca, local e horário** conforme os padrões detectados.
- Gerar visualizações de calor (heatmaps) para representar graficamente a influência de cada variável ao longo do dia.

---

## 8. Conclusão

A leitura integrada do clima — temperatura, umidade, pressão e vento — fornece uma **base científica robusta para interpretar o comportamento dos peixes**. Quando combinada com as variáveis astronômicas já consideradas (Lua e Sol), essa abordagem transforma o Pesca Assistente em uma ferramenta de alta precisão, capaz de oferecer **recomendações adaptativas, preditivas e contextualizadas** para diferentes realidades de pesca em água doce.

---

## 📚 Referências Bibliográficas

- Cooke, S. J., et al. (2016). *Environmental physiology of freshwater fishes*. Journal of Fish Biology.
- Silva, J. C., et al. (2019). *Environmental triggers of fish reproduction in Neotropical rivers*. Environmental Biology of Fishes.
- NOAA (2023). *Climate variables and aquatic ecosystems*.
- Open-Meteo API Documentation.
- Knight, J. A. (1936). *Moon Up - Moon Down: The Story of the Solunar Theory*.