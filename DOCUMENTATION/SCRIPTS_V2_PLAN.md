# Plano de evolução para scripts V2

## Objetivos

- **Reutilização multi-espécies:** permitir que todas as funções de cálculo recebam parâmetros declarativos e possam ser reaproveitadas por diferentes peixes.
- **Parametrização declarativa:** qualquer faixa de pontuação, pesos ou bônus deve ser descrita em objetos de configuração, não em lógica codificada.
- **Isolamento:** criar o diretório `src/common/environment-data/scriptsV2` com núcleo independente da implementação atual para facilitar migração gradual.

## Estrutura proposta

```
scriptsV2/
  core/
    math.ts        # clamp, smoothLerp, smoothStep, etc.
    modifiers.ts   # diurnalModifier parametrizável
    temporal.ts    # utilitários HH:MM → minutos, triangular peaks
  schema/
    types.ts       # SpeciesScoreConfig, RangeBlock, BonusConfig, etc.
  engine/
    scorer-factory.ts   # fábricas genéricas de scorers por variável
    calculator.ts       # combina scorers, pesos, bônus e gera resultado final
  species/
    traira.ts          # configuração declarativa da Traíra
  index.ts             # APIs públicas (registerSpecies, getCalculator, calculateScore)
  README.md            # guia para adicionar novas espécies
```

## Componentes principais

1. **Core matemático/temporal**  
   - Reaproveita funções da V1 (`clamp`, `smoothLerp`, `movingAverageCentered`) e adiciona suporte a `DiurnalModifierConfig` (com curvas térmicas customizáveis).

2. **Tipos de configuração**  
   - `RangeBlockConfig`: intervalo `[min,max)` com `scoreStart` → `scoreEnd`.
   - `TrendAdjustConfig`: descreve bônus/penalidades por tendência.
   - `RainRuleConfig`: lista fases (base, bônus, penalidades) aplicadas condicionalmente.
   - `SpeciesScoreConfig`: agrega pesos, caps, configs de temperatura/umidade/pressão/vento/chuva, parâmetros de bônus lunar/solunar e opções de modificador diurno.

3. **Fábricas de scorers**  
   - Funções `makeRangeScorer`, `makeTrendAdjustedScorer`, `makeConditionalRainScorer` que recebem config e devolvem funções puras (`(value, context) => score`).
   - Permitem que outras espécies alterem faixas apenas mexendo na configuração.

4. **Calculator Engine**  
   - `buildSpeciesCalculator(config)` compila scorers, pesos e bônus; devolve função `calculate(params: TotalCalcParamsV2): TotalCalcResultV2`.
   - Mantém separação entre fatores ativos e passivos, aplica `diurnalModifier`, soma bônus e aplica os caps configurados.
   - Suporta registro de múltiplas espécies através de um cache em `index.ts`.

5. **Config Traíra (prova de conceito)**  
   - Transcreve regras existentes para objetos config, garantindo compatibilidade de comportamento.
   - Permite comparação V1 vs V2 em testes futuros.

6. **Documentação e exemplos**  
   - README dentro de `scriptsV2` descrevendo passo a passo para adicionar novas espécies.
   - Exemplos de configuração e uso do motor (`import { calculateScore } from "@env-data/scriptsV2"`).

## Etapas de implementação

1. Criar diretório `scriptsV2` com subpastas `core`, `engine`, `schema`, `species`.
2. Copiar utilitários matemáticos/temporais para `core`, adaptando para configurações parametrizadas.
3. Definir tipos em `schema/types.ts` e expor interfaces públicas.
4. Implementar fábricas de scorer em `engine/scorer-factory.ts` e motor em `engine/calculator.ts`.
5. Declarar configuração da Traíra (`species/traira.ts`) e registrar no `index.ts`.
6. Adicionar README com guia e exemplos rápidos.
7. (Opcional/Futuro) Criar testes comparando V1 e V2 para validar equivalência.

## Próximos passos operacionais

- Implementar a estrutura descrita acima.
- Atualizar documentação geral (`DOCUMENTATION/ENVIRONMENT_SCORE.md`) após validação.
- Planejar migração do restante da aplicação para consumir a V2 gradualmente.
