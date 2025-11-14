# Motor de Pontuação `scriptsV2`

## Organização

- `core/` abriga utilitários puros (math, ranges, temporais). Destaque para `buildDiurnalModifier`, `triangularPeakAtCenter` e avaliadores de faixa.
- `engine/` contém o coração do cálculo: `calculator.ts` monta uma função por espécie e `scorer-factory.ts` cria os *scorers* (faixa, tendência, chuva).
- `schema/` define contratos (`SpeciesScoreConfig`, `ScoreComputationInput`, `ScoreComputationResult` etc.).
- `species/` disponibiliza as configurações específicas (ex.: `traira`) com ranges, pesos e regras declarativas de chuva.
- `index.ts` registra os peixes carregando suas configs e expõe `calculateScore(speciesId, input)` para o restante do sistema (`getScoreDayService`).

## Pipeline Horário

1. **Entrada**: cada hora traz `temperature`, `humidity`, `pressure`, `windSpeed`, `probability`, `total`, `showers`, `localHour`, `localHourDec`, `pressureTrend6h`, dados solunares e iluminação.
2. **Temperatura efetiva da água**: `computeWaterTemp` mantém um estado `prevWaterTemp` por espécie com inércia `k = 0.2`. Ao detectar que a hora voltou ou virou o dia (`shouldResetWaterState`), o histórico é reiniciado. O valor suavizado passa a alimentar todo cálculo térmico (`temperatureScore` e `diurnalFactor`), diluindo picos bruscos de ar.
3. **Scorers**:
   - `createRangeScorer` avalia um número contra `RangeBlockConfig`. Cada bloco pode mapear faixas (ex.: 20‑24°C → 70 pontos, 24‑28°C → 90) e aplica `clamp`/`round` configuráveis.
   - `createTrendAdjustedScorer` estende o comportamento de faixa incorporando tendências: quedas de pressão dentro de `trend.fall.limit` podem somar até `maxBonus`, subidas descontam usando `trend.rise.maxPenalty`.
   - `createRainScorer` processa regras declarativas. `RainRule` inclui condições sobre `volume`, `probability`, `showers`, `temperature`, `humidity`, `wind` e *flags* derivadas (`warm|hot|cold`). As ações `set|max|min|scale` constroem uma árvore determinística (“se chuva > 1mm e temperatura quente, score = 70; depois se probabilidade < 30%, scale 0.6”). `baseRules` definem o baseline; `modifiers` ajustam o valor final antes do clamp.
4. **Pesos e breakdown**: cada nota bruta (`tempRaw`, `humidityRaw`, etc.) é multiplicada pelos pesos definidos em `SpeciesWeightsConfig`, gerando `ScoreBreakdown`. `activeVariables` (default: temperatura, vento, chuva) sofrem o efeito do modificador diurno; `passiveVariables` (umidade, pressão) não recebem o boost horário.
5. **Modificador diurno**: `buildDiurnalModifier` calcula `diurnalFactor = clamp(1 - amplitude * cos(...))`, onde `amplitude = amplitudeBase * suitability`. `suitability` resulta de `temperatureRanges`: se a água estiver em faixa ideal, a oscilação diária é máxima; se estiver fria/quente demais, o fator aproxima-se de 1, evitando exageros quando o peixe estaria inativo.
6. **Bônus lunares/solunares**:
   - `computeMoonBonus` transforma a iluminação (0–1) em bônus seguindo `mode` (“center-peaks” privilegia fases cheia/nova; “edge-peaks” favorece quartos) e limita por `maxBonus`.
   - `computeMoonPhaseBonus` lê a mesma iluminação para determinar a fase (cheia ≥ 75 %, nova ≤ 25 %, demais como quartos) e aplica reforços alinhados ao comportamento descrito: noites claras e o amanhecer subsequente na lua cheia, alvorada faminta na lua nova e janelas de transição (amanhecer/entardecer) nos quartos. Esses reforços usam janelas triangulares (picos em torno de 07h no amanhecer e 18h no entardecer), então horários mais próximos do centro ganham mais pontos do que as bordas da janela.
   - `computeSolunarBonus` cria picos triangulares (`triangularPeakAtCenter`) centrados nos períodos maior/menor; soma ponderada por `majorWeight`/`minorWeight` e clamp final `maxBonus`.
   Os três bônus respeitam o `bonusCap` (default 8) antes de serem aplicados e expostos individualmente em `ScoreComputationResult`.
7. **Agregação**: `hourlyScore = (activePart + passivePart)/sumWeights`, depois adiciona os bônus, clampa para 0–100 e arredonda conforme `precision`. O retorno (`ScoreComputationResult`) inclui `hourlyScore`, `breakdown` ponderado, `moonBonus`, `moonPhaseBonus` e `solunarBonus`.

## Critérios por Variável

- **Temperatura (água)**: controlada pelo `RangeScoreConfig` da espécie, mas alimentada por `waterTemp`. Com a inércia térmica, manhãs frias seguram a nota mesmo com aquecimento rápido e tardes quentes sobem gradualmente.
- **Umidade**: faixa configurada penaliza extremos ou valores baixos/altos de acordo com o perfil do peixe.
- **Pressão**: além do valor absoluto ideal, a tendência em 6h recompensa quedas suaves (frentes favoráveis) ou penaliza subidas (estabilidade quente), garantindo sensibilidade a mudanças de tempo.
- **Vento**: avalia a velocidade em km/h; ranges típicos apontam que ventos moderados ajudam (oxigenação), calmarias ou ventos fortes punem.
- **Chuva**: combina intensidade (`total`), probabilidade, pancadas (`showers`), temperatura, umidade e vento para modelar condições como garoa estável, pancadas fortes ou temporais. As regras permitem “fatores humanos”: ex. `set 80` para chuva leve durante temperaturas quentes à tarde, ou `scale 0.5` se apesar de chuva o vento estiver acima do limite.
- **Modificador diurno**: horários preferenciais (alvorada, entardecer) são modelados pelo coseno; somente variáveis “ativas” recebem o boost. Se a temperatura efetiva não estiver adequada, o fator se aproxima de 1 (sem bônus), evitando superestimar horários clássicos quando a água está fria/quente.
- **Bônus externos**: fases lunares e períodos solunares reforçam horas com maior atividade natural. Como o `bonusCap` limita o somatório, eles ajustam o comportamento sem distorcer a escala geral.

## Interface e Integração

- `registerSpecies` em `scriptsV2/index.ts` recebe a configuração da espécie, instancia `buildSpeciesCalculator` e registra em um mapa.
- `calculateScore(speciesId, input)` consulta o registrador e chama `calculate`. Se a espécie não existir, lança erro.
- O serviço `getScoreDayService` percorre cada hora das previsões de clima, monta `ScoreComputationInput` e chama `calculateScore` para cada peixe solicitado; o objeto retornado é usado diretamente na resposta do endpoint `/get-day-score`.

## Benefícios do Modelo

- **Configurável**: novos peixes exigem apenas um `SpeciesScoreConfig`; o motor permanece imutável.
- **Estável**: a temperatura efetiva suaviza mudanças abruptas vindas da API, mantendo coerência ecológica (água não esquenta/esfria instantaneamente).
- **Determinístico**: não há efeitos colaterais externos além do estado térmico por espécie; isso facilita testes e validações.
- **Extensível**: é simples adicionar novos bônus (ex.: marés) ou variáveis de entrada, pois os scorers já operam com contratos bem tipados e modularizados.
