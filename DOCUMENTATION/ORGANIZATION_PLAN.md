# Plano de Reorganização do Módulo `environment-data`

## 1. Normalização de Tipos
- Mover `src/common/environment-data/types.ts` para `src/common/environment-data/types/index.ts`.
- Criar barrels (`types/index.ts` e `src/common/environment-data/index.ts`) que reexportem `RainContext`, `SolunarInput`, `TotalCalcParams`, `TotalCalcResult`, `fishList`.
- Resultado: imports mais curtos e único ponto de edição para novos tipos ou espécies.

## 2. Pacote `algorithms`
- Dividir `algorithms/index.ts` em arquivos menores: `math.ts` (clamp, smoothLerp, smoothStep), `temporal.ts` (hhmmToMinutes, minutesToEvent, windowProximity, movingAverageCentered), `total-calc.ts` (calcFinalScore, calculateTotalScoreBySpecie, diurnalModifier).
- Expor tudo via `algorithms/index.ts`, permitindo importar `@env-data/algorithms`.

## 3. Estrutura por Espécie
- Dentro de `src/common/environment-data/traira/` criar duas subpastas:
  - `descriptions/` para o markdown (`environmentSpecification.ts`).
  - `scorers/` contendo `climatic.ts`, `moon-phase.ts`, `rain.ts`, `sololunar.ts`, reunidos via `scorers/index.ts`.
- Barrel da espécie (`traira/index.ts`) passa a exportar `{ specification, scorers }` e evita blocos de texto gigantes dentro do mesmo arquivo.

## 4. Registro Central
- Em `src/common/environment-data/index.ts` importar apenas os barrels das espécies: `import { trairaSpec, trairaScorers } from "./traira"`.
- Montar `environmentDataByFish`, `calcFuncBySpecie` e `calTotalScore` usando esses objetos, facilitando a adição de novas espécies com uma linha por registro.

## 5. Definição de Espécies
- Criar `src/common/environment-data/species.ts` com `const SPECIES = ["traira"] as const;` e `export type FishList = typeof SPECIES[number];`.
- Reexportar `SPECIES`/`FishList` nos barrels para manter a lista de espécies em um único arquivo.

## 6. Documentação Modular
- Mover explicações extensas para `DOCUMENTATION/species/traira.md`, mantendo o README principal focado em visão geral.
- Cada espécie ganha um markdown específico para ser referenciado por produto ou marketing.

## 7. Alias de Caminho
- Ajustar `tsconfig.json` adicionando `"paths": { "@env-data/*": ["src/common/environment-data/*"] }`.
- Atualizar imports para usar `@env-data/algorithms`, `@env-data/types`, etc., eliminando cadeias `../../../`.

## 8. Espelhamento em Testes
- Reorganizar `test/common/environment-data` com a mesma hierarquia e barrels para utilidades de teste.
- Facilita encontrar testes correspondentes quando novos scorers são adicionados.

Com essa reorganização, o código mantém o comportamento atual, mas fica segmentado por responsabilidade, pronto para escalar para outras espécies e com pontos de entrada limpos para serviços e modelos.
