# Documentação de cálculo de score ambiental

Este documento descreve em detalhes como os scripts localizados em `src/common/environment-data` calculam o score horário usado pelo assistente. A implementação atual está centrada na espécie **Traíra**, mas a arquitetura permite plugar novos peixes reutilizando a mesma infraestrutura matemática.

## 1. Linha do tempo do cálculo

1. Os dados crus chegam como `TotalCalcParams`, contendo temperatura, umidade, pressão, vento, chuva (volume, probabilidade e pancadas), hora local (inteira e decimal), tendência de pressão e dados solunares.
2. Para cada espécie declarada em `environmentDataByFish` (hoje apenas `traira`), o motor busca em `calcFuncBySpecie` o conjunto de funções específicas (`climaticConditionsCalc`, `rainCalc`, `sololunarCalc` etc.).
3. Cada função retorna um score normalizado (0–100) para sua variável.
4. Os scores são ponderados pelos pesos globais e divididos em duas partes: ativa (temperatura, vento, chuva) e passiva (umidade, pressão).
5. A parte ativa sofre a correção de ritmo `diurnalModifier`, modelando a oscilação diária de atividade conforme a hora e a adequação térmica.
6. Após somar as partes ativa e passiva, são adicionados bônus lunares/solunares (limitados a +8 pontos). O resultado é truncado para 3 casas decimais e limitado ao intervalo 0–100.

## 2. Funções auxiliares

Localizadas em `src/common/environment-data/algorithms`:

- `clamp(x, a, b)` e `clamp01(x)` limitam valores para evitar extrapolações.
- `smoothStep` e `smoothLerp` fazem transições suaves entre faixas com curvas cúbicas, evitando saltos abruptos de score.
- `movingAverageCentered`, `hhmmToMinutes`, `windowProximity` e `minutesToEvent` (em `temporal.ts`) convertem horários `HH:MM` e calculam proximidade de janelas. Essas funções sustentam cálculos temporais presentes/planejados para regimes solunares.

## 3. Estruturas e extensibilidade

- `calcScoreFunctions` define quais funções de score cada espécie deve prover.
- `environmentDataByFish` associa descrições textuais (guias de campo) para cada variável, servindo de apoio ao usuário, mas não influenciam a matemática.
- `calculateTotalScoreBySpecie` executa `calcFinalScore` para cada espécie solicitada e devolve um mapa `{ fish: TotalCalcResult }`.

## 4. Pesos globais

Os pesos definidos em `total-calc.ts` refletem a influência relativa de cada variável no score final:

| Variável    | Peso |
|-------------|------|
| Temperatura | 0.32 |
| Pressão     | 0.24 |
| Vento       | 0.19 |
| Chuva       | 0.20 |
| Umidade     | 0.05 |

O denominador da média ponderada é a soma desses pesos (`1.0`). Temperatura, vento e chuva são considerados fatores “ativos” e sofrem o ajuste diurno; pressão e umidade formam a parcela “passiva”, permanecendo estáveis ao longo do dia.

## 5. Scores climáticos por variável (Traíra)

As funções estão em `src/common/environment-data/traira/scorers/climatic.ts`.

### Temperatura (`temperatureScore`)

Faixa por faixa com interpolação suave:

- `<8°C`: 0 pontos.
- `8–12°C`: sobe de 0 para 10 (condição extrema).
- `12–15°C`: 10 → 25 (atividade ainda baixa).
- `15–18°C`: 25 → 40.
- `18–22°C`: 40 → 70 (transição estável).
- `22–26°C`: 70 → 100 (faixa ótima).
- `26–30°C`: 100 → 80 (leve queda).
- `30–33°C`: 80 → 20 (estresse térmico).
- `33–36°C`: 20 → 0.
- `>36°C`: 0.

A função `clamp` garante o intervalo 0–100 antes do arredondamento.

### Umidade (`humidityScore`)

Modela o impacto da luz difusa/contraste:

- `>=90%`: 20 pontos (cenário muito úmido).
- `80–90%`: 35 → 20.
- `70–80%`: 55 → 35.
- `60–70%`: 75 → 55.
- `50–60%`: 95 → 75.
- `40–50%`: 100 → 95 (melhor faixa).
- `35–40%`: 90 → 100.
- `25–35%`: 75 → 90.
- `<25%`: 60 (ar excessivamente seco).

### Pressão (`pressureScore`)

1. **Base absoluta:** a pressão corrente gera um score interpolado por blocos (980–1030 hPa). O topo fica em torno de 1016–1018 hPa (~100 pontos). Valores muito altos/baixos convergem para 45–60.
2. **Tendência de 6h (`dp6h`):**
   - Queda (valor negativo): bônus de até +6 pontos para quedas de −6 hPa por 6h.
   - Alta (valor positivo): penalidade de até −12 para +6 hPa/6h.
3. O resultado é truncado para 0–100 e arredondado.

### Vento (`windScore`)

- 0 km/h: 55 (calmaria absoluta).
- 0–3 km/h: 85 → 95 (pico ~2–3 km/h).
- 3–8 km/h: 95 → 80.
- 8–18 km/h: 80 → 60.
- 18–28 km/h: 60 → 35.
- 28–40 km/h: 35 → 20.
- `>40 km/h`: 15.

## 6. Regra de chuva (`rainScore`)

Implementada em `src/common/environment-data/traira/scorers/rain.ts`, recebe um `RainContext` composto por volume total, probabilidade, pancadas dedicadas (`showerVolumeMmPerHour`), temperatura, umidade, pressão e vento. A lógica resume-se a:

1. **Base por volume/probabilidade (mutuamente exclusivos):**
   - Sem chuva atual (`volume === 0`): score parte de 40 e varia com a probabilidade (0 → 45, 30 → 60, 70 → 75, 100 → 85).
   - Chuva leve (`0–2 mm/h`): 65 → 78.
   - Chuva moderada (`2–5 mm/h`): 40 → 25.
   - Forte (`>5 mm/h`): decai de 25 para 5 até 20 mm/h.
2. **Janela de pancadas:** se o dia estiver quente, seco e estável (`volume === 0`, prob <40, 24°C ≤ T ≤ 32°C, umidade ≤75%) e houver pancada registrada (`showers > 0`), aplica-se um bônus entre 80 e 95 pontos.
3. **Pré-chuva quente:** para dias quentes e probabilidade ≥30%, o score sobe de 70 (30%) para 92 (90%).
4. **Penalizações:**
   - Chuva em cenário frio (`T < 20°C`) corta o score em 50%.
   - Umidade >95% com chuva contínua (sem pancada) reduz para 70% do valor.
   - Tempestade (volume ≥8 mm/h ou prob ≥70% com vento ≥25 km/h) limita o score ao resultado de uma rampa 15 → 0 entre 8 e 30 mm/h.
   - Calor seco extremo sem chuva (`T > 32°C`, volume 0, prob 0) reduz gradativamente até 60% do valor quando T chega a 38°C.
5. Resultado final: arredondado e limitado a 0–100.

## 7. Modificador diurno

Definido em `diurnalModifier`:

- Converte a hora local para [0,24) e calcula uma oscilação senoidal com amplitude base `aBase = 0.05` (±6%).
- A amplitude real `a` é reduzida conforme o calor através de `thermalSuitability`, que mede a adequação da temperatura ambiente (0.3 em frio extremo, 1.0 no ótimo 22–26°C, e volta a 0.3 em calor >34°C).
- O modificador é `m = 1 - a * cos(((h - 12) * π) / 6)` e fica limitado a `[1-a, 1+a]`. Assim, a parte ativa sofre leve boost no amanhecer/tarde e cai no meio do dia ou madrugada, dependendo da temperatura.

## 8. Bônus lunares e solunares

Localizados em `src/common/environment-data/traira/scorers/sololunar.ts`:

- `computeMoonBonusPoints`: recebe a iluminação (0–1) e aplica a parábola `edgePeak = 1 - 4*(f - 0.5)^2`. O valor é máximo (=1) quando `f = 0.5` (lua cheia) e zero quando `f = 0` ou `1`. O bônus é `edgePeak * 2`, logo pode adicionar até +2 pontos quando a lua está cheia e nenhum ponto em nova/quase nova.
- `computeSolunarBonusPoints`: compara a hora decimal local com janelas **major** e **minor**. Cada janela gera um pico triangular (1 no centro, 0 nas bordas).
  - Majors são multiplicadas por 4 pontos cada (até +8 no total).
  - Minors valem 2 pontos cada (até +4).
  - Após somar, o bônus solunar é limitado a +8.

O somatório `moonBonus + solunarBonus` passa por uma limitação adicional para respeitar o teto combinado de +8 no cálculo final.

## 9. Score total

Executado em `calcFinalScore`:

```ts
tempScore = temperatureScore * 0.32;
humidityScore = humidityScore * 0.05;
pressureScore = pressureScore * 0.24;
windScore = windScore * 0.19;
rainScore = rainScore * 0.20;

activePart = (tempScore + windScore + rainScore) * diurnalModifier;
passivePart = humidityScore + pressureScore;
hourlyScore = (activePart + passivePart) / sumWeights;
hourlyScore = clamp(hourlyScore + combinedBonus, 0, 100);
hourlyScore = roundTo3Decimals(hourlyScore);
```

Observações:

- `sumWeights` vale 1, então a divisão apenas normaliza a soma ponderada.
- Após a soma com os bônus (máximo +8), o valor é arredondado para 3 casas decimais.
- O resultado retorna junto aos componentes individuais (`tempScore`, `humidityScore`, `pressureScore`, `windScore`, `rainScore`, `moonBonus`, `solunarBonus`), facilitando auditoria.

## 10. Moon phase standalone

`moonPhaseCalc.moonPhaseScore` (em `moon-phase.ts`) converte a fase lunar (0 nova, 0.5 cheia, 1 nova) em um score independente:

- Lua cheia (fase 0.5) → 100 pontos.
- Quartos (0.25 e 0.75) → 75 pontos.
- Lua nova → 100 pontos (via interpolação que retorna 100 ao aproximar-se de 0 ou 1).

Esse score não entra diretamente em `calcFinalScore`, mas pode ser apresentado ao usuário ou usado em futuras ponderações.

## 11. Considerações adicionais

- O tipo `TotalCalcParams` contém campos ainda não usados (`rain`, `sololunarScore`, `sixHourTemp`). Eles estão disponíveis para extensões futuras, como comparar score calculado versus estimado.
- `trairaEnvironmentSpecification` fornece a narrativa operacional usada na interface; qualquer ajuste ali não modifica o cálculo matemático, mas deve acompanhar mudanças de faixa para manter coerência.
- Para incluir novas espécies, basta adicionar descrições, scorers e pesos (se necessário) em diretórios equivalentes e registrar no `environmentDataByFish` e `calcFuncBySpecie`.

Com esses elementos é possível auditar e evoluir o motor de score garantindo rastreabilidade completa das regras de negócio implementadas no código.
