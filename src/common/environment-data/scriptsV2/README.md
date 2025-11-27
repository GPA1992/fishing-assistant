# scriptsV2

Nova implementação do motor de score ambiental, pensada para reaproveitar cada função de cálculo entre múltiplas espécies. A arquitetura é declarativa: cada peixe descreve faixas e pesos em objetos de configuração e o motor gera automaticamente os scorers.

## Estrutura

- `core/`: utilitários matemáticos, temporais e de modificadores diurnos.
- `schema/`: tipos de configuração (faixas, regras de chuva, pesos, bônus).
- `engine/`: fábricas genéricas (`createRangeScorer`, `createRainScorer`) e o `buildSpeciesCalculator`.
- `species/`: configurações específicas (ex.: `traira.ts`).
- `index.ts`: registro de espécies e API pública (`calculateScore`, `registerSpecies`).

## Como adicionar uma espécie

1. **Criar config** em `species/<nome>.ts` exportando um `SpeciesScoreConfig`:
   ```ts
   import { SpeciesScoreConfig } from "../schema/types";

   export const tucanareScoreConfig: SpeciesScoreConfig = {
     id: "tucanare",
     weights: { temperature: 0.3, pressure: 0.2, wind: 0.2, rain: 0.2, humidity: 0.1 },
     temperature: { ranges: [...], clamp: { min: 0, max: 100 } },
     // demais variáveis …
    rain: { baseRules: [...], modifiers: [...] },
    diurnal: { maxBonus: 10 },
     moonBonus: { maxBonus: 2, mode: "center-peaks" },
     solunarBonus: { majorWeight: 4, minorWeight: 2, maxBonus: 8 },
   };
   ```
2. **Registrar** a espécie em `index.ts` (importar o config e chamar `registerSpecies`).
3. **Calcular score**:
   ```ts
   import { calculateScore } from "@env-data/scriptsV2";

   const result = calculateScore("traira", {
     temperature: 25,
     humidity: 55,
     pressure: 1013,
     windSpeed: 10,
     probability: 20,
     total: 0,
     showers: 0,
     localHour: 8,
     localHourDec: 8.5,
     pressureTrend6h: -2,
     solunarPeriodsData: { major1StartDec: 6.5, major1StopDec: 8.5 },
   });
   ```

## Principais ideias

- **Faixas reutilizáveis:** `RangeBlockConfig` define pontos de interpolação suave (linear ou smooth-step) que alimentam os scorers de temperatura, umidade, vento etc.
- **Chuva parametrizada:** `RainRule` descreve condições (volume, probabilidade, temperatura, flags de calor/frio) e ações (`set`, `max`, `min`, `scale`). Basta alterar o array de regras para personalizar comportamentos.
- **Bonus configuráveis:** `MoonBonusConfig` e `SolunarBonusConfig` determinam pesos máximos e formato das curvas, mantendo o cap configurável por espécie.
- **Fase da lua contextualizada:** além do bônus por iluminação, o motor interpreta a fase (cheia, nova, quartos) e aplica reforços em janelas horárias específicas (lua cheia cobre noite e o amanhecer seguinte, lua nova privilegia o amanhecer faminto, quartos reforçam transições), gerando o `moonPhaseBonus`.
- **Modificador diurno:** `DiurnalModifierConfig` aceita janelas de horário com pico triangular, liberando um bônus (0 → pico → 0) para cada janela configurada. Você pode injetar as janelas ao criar a sessão com `createCalculatorSession("traira", [{ startHour: 7, endHour: 10, peakBonus: 10 }])`.

Com esse formato, futuras espécies compartilham o mesmo motor bastando copiar/ajustar configurações e, se necessário, adicionar regras customizadas.
