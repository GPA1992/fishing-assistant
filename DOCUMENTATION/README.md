# Motor de Dados Ambientais

## Visão Geral
O diretório `src/common/environment-data/` concentra o motor que converte dados meteorológicos e solunares em métricas de atividade por espécie. Ele publica três blocos principais: (1) especificações textuais `environmentDataByFish` utilizadas para exibir recomendações ricas no front, (2) o registro `calcFuncBySpecie` com funções de pontuação para cada componente ambiental e (3) `calTotalScore.calculateTotalScoreBySpecie`, responsável por sintetizar todos os pesos em um `hourlyScore` (0–100). Atualmente o motor está especializado na traíra, mas o desenho foi pensado para suportar múltiplas espécies.

## Papel no Projeto
O serviço `getScoreDayService` (ver `src/module/get-day-score/services/`) injeta o motor para transformar cada hora retornada pela API meteorológica e pela geração sololunar (`sololunarGeneration`). Para cada hora, ele compõe os parâmetros definidos em `types/index.ts` (`TotalCalcParams`) e chama `calculateTotalScoreBySpecie`, obtendo um `Record<fishList, TotalCalcResult>` usado para montar a resposta do endpoint `/get-day-score`. Dessa forma, a pasta `environment-data` isola o domínio de pontuação e evita que a camada HTTP precise conhecer regras ambientais.

## Organização dos Arquivos
- `types/`: centraliza contratos como `RainContext`, `SolunarInput`, `environmentDataType` e `TotalCalcResult`, além da lista de espécies (`fishList` definida em `species.ts`). Esses tipos garantem que cada cálculo receba os campos mínimos (temperatura, pressão, solunarPeriodsData etc.).
- `index.ts`: exporta os registros por espécie (`environmentDataByFish`, `calcFuncBySpecie`) e expõe o agregador `calTotalScore`. Ao adicionar uma nova espécie este é o único arquivo que precisa ser ajustado para conectar as funções específicas.
- `algorithms/`: dividido em `math.ts`, `temporal.ts` e `total-calc.ts`, oferecendo curvas suaves (`clamp`, `smoothLerp`), utilitários de horário (`movingAverageCentered`, `windowProximity`, `hhmmToMinutes`) e o core de ponderação.
- `traira/`: implementação concreta da espécie. As descrições residem em `traira/descriptions/` e os quatro conjuntos de cálculo ficam em `traira/scorers/` (`climatic.ts`, `moon-phase.ts`, `rain.ts`, `sololunar.ts`), todos reexportados por `traira/index.ts`.

## Fluxo de Pontuação
1. O serviço chama `calculateTotalScoreBySpecie(params, ["traira"])` com os valores de uma hora específica e os dados solunares retornados pelo módulo `sololunar-generation`.
2. `total-calc.ts` consulta `calcFuncBySpecie` para obter os scorers da espécie. Cada função retorna um valor normalizado (0–100) para temperatura, umidade, pressão, vento e chuva. A chuva utiliza `RainContext` completo para considerar volume, pancadas, probabilidade e vento.
3. Os scores são ponderados por `WEIGHTS` (temperatura 32%, pressão 24%, vento 19%, chuva 20%, umidade 5%). Uma modulação diurna (`diurnalModifier`) aplica variações suaves nas partes mais afetadas pela atividade térmica.
4. Bônus adicionais vêm de `computeMoonBonusPoints` (lua nova/cheia vs. quartos) e `computeSolunarBonusPoints`, que usa janelas major/minor convertidas para hora decimal e aplica picos triangulares. O bônus combinado é limitado a +8 p.p.
5. O resultado final (`hourlyScore`) é armazenado ao lado dos sub-scores para que o front possa explicar o motivo da nota.

## Algoritmos de Apoio
- **Curvas suaves:** `smoothLerp` + `smoothStep` evitam saltos abruptos ao cruzar limites (ex.: 26–30 °C). `clamp` e `clamp01` mantêm todos os valores dentro de faixas físicas válidas.
- **Médias e proximidades:** `movingAverageCentered` permite derivar tendências (ex.: `sixHourTemp`) e `windowProximity` calcula quão perto estamos de janelas solunares major/minor.
- **Conversões temporais:** `hhmmToMinutes` e `minutesToEvent` (expostos pela subpasta) facilitam trabalhar com horários vindos do astronomia-engine sem duplicar lógica.

## Extensão para Novas Espécies
1. Criar uma nova pasta em `environment-data/` (ex.: `tucunare/`) replicando os quatro arquivos de cálculo com curvas específicas.
2. Definir o bloco textual de recomendações em `<specie>/index.ts` e exportar os scorers.
3. Registrar a espécie em `species.ts`/`types/index.ts`, importar no `index.ts` raiz e preencher `environmentDataByFish` + `calcFuncBySpecie`.
4. Opcionalmente ajustar pesos ou novos bônus em `algorithms/total-calc.ts` se o comportamento diferir muito.

Com essa estrutura, o motor permanece puro e facilmente testável, enquanto o restante do projeto apenas consome resultados altos nível, mantendo o domínio de pesca encapsulado.
