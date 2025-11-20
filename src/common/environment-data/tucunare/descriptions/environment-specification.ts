export const tucanareEnvironmentSpecification = {
  climaticConditions: {
    temperature: `# Temperatura do Ar/Água (Tucunaré)
- **<20°C:** Metabolismo desacelera. Tucunaré fica apático, busca profundidade e evita perseguições longas.
- **20–24°C:** Faixa fria. Atividade reduzida; exige iscas lentas, fundo e apresentações precisas.
- **24–26°C:** Atividade crescente. Peixe circula mais cedo, inicia caçadas em baixa luminosidade.
- **26–30°C (ótimo):** Metabolismo alto. Maior agressividade, ataques explosivos, superfície eficiente.
- **30–32°C:** Superfície aquece demais. Tucunaré recua para sombras, pauleiras e fundos oxigenados.
- **>32°C:** Estresse térmico. Atividade quase nula no meio do dia; janelas apenas no amanhecer e entardecer.

## Estratégia
- **Água fria (<24°C):** Pescar no pico de aquecimento do dia. Trabalhar jigs e softs lentamente no fundo.
- **Água amena (24–28°C):** Melhor previsibilidade. Alternar superfície no amanhecer e meia-água durante o dia.
- **Água quente (28–30°C):** Explorar estruturas sombreadas, vento a favor e iscas rápidas.
- **Calor extremo (>30°C):** Somente cedo/tarde. Evitar superfície prolongada; focar sombra e entradas de água fresca.
`,
    humidity: `
# Umidade Relativa (Tucunaré)
- **>85%:** Indica instabilidade. Geralmente associado a queda de pressão e pré-chuva — bom para atividade.
- **70–85%:** Nublado/abafado. Atividade irregular, mas pode gerar bons picos antes da chuva.
- **50–70%:** Faixa neutra. Não afeta diretamente, mas modula luminosidade e sensação térmica.
- **<50%:** Céu limpo e alta pressão. Tendência de peixe manhoso e comportamento defensivo.
- **<35%:** Condição seca e clara. Meio do dia fica ruim; peixe busca abrigo profundo para evitar exposição.

## Estratégia
- **Alta umidade:** Ler nuvens e instabilidade. Pode render pré-chuva excelente.
- **Umidade média:** Ajustar velocidade conforme luminosidade abre/fecha.
- **Ar seco:** Focar amanhecer/entardecer e apresentações discretas.
`,
    pressure: `
# Pressão Atmosférica (Tucunaré)
- **Queda acentuada:** Forte estímulo alimentar. Peixe sobe e caça agressivamente.
- **Queda gradual:** Cenário positivo e previsível. Atividade aumenta ao longo das horas.
- **1010–1020 hPa (ótimo):** Estabilidade produtiva. Peixe ativo e agressivo.
- **>1020 hPa:** Pós-frente fria. Tucunaré fundo, desconfiado e lento.
- **<1008 hPa:** Pré-temporal. Bom pico antes; durante a tempestade atividade trava.

## Estratégia
- **Queda de pressão:** Usar iscas de reação e maior velocidade.
- **Estabilidade moderada:** Superfície e meia-água funcionam bem.
- **Pressão alta:** Trabalhar fundo, lento e preciso.
- **Pré-temporal:** Janelas curtas; foco total em estruturas-chave.
`,
    wind: `
# Vento (Tucunaré)
- **0–8 km/h:** Ideal. Superfície estável; ataques previsíveis.
- **8–18 km/h:** Bom. Superfície rugada aumenta confiança do peixe.
- **18–28 km/h:** Forte. Tucunaré desce, evita superfície, busca áreas abrigadas.
- **>28 km/h:** Crítico. Turbulência excessiva e baixa eficiência.

## Estratégia
- **Brisa leve:** Priorizar zara, popper e hélice.
- **Vento moderado:** Buscar margem de sotavento e meia-água.
- **Vento forte:** Sombras, baías e iscas mais pesadas.
- **Ventania:** Fundo, corrente quebrada e pontos abrigados.
`,
  },

  rain: {
    volume: `
# Volume de Chuva
- **Garoa / leve:** Excelente. Reduz luz, refresca água, prolonga atividade.
- **Moderada:** Efeito depende da temperatura. Pode estimular ou travar.
- **Forte:** Turva água, derruba atividade, peixe abriga.
- **Temporal prolongado:** Atividade mínima.

## Estratégia
- **Chuva leve:** Superfície e meia-água funcionam o dia inteiro.
- **Moderada:** Ajustar profundidade e observar turbidez.
- **Forte:** Pausar; voltar após estabilização.
`,
    showers: `# Pancadas (Showers)
- **Pancada rápida em dia quente:** Pode gerar pico explosivo pós-chuva.
- **Pancada em dia frio:** Efeito mínimo; peixe permanece lento.

## Estratégia
- **Pós-pancada quente:** Atacar imediatamente com iscas de reação.
- **Cenário frio:** Tratar como chuva normal, sem contar com pico.
`,
    probability: `
# Probabilidade de Chuva
- **Alta probabilidade sem chuva ainda:** Excelente pré-chuva; atividade sobe.
- **Alta probabilidade com tempestade prevista:** Reduz nota geral.
- **Baixa probabilidade com calor extremo:** Pouco benefício.

## Estratégia
- **Alta chance em clima quente:** Valorizar pré-chuva.
- **Tempestade prevista:** Pescar cedo e com segurança.
- **Baixa probabilidade moderada:** Leitura neutra.
`,
  },

  moonPhase: {
    phase: `
- **Lua Cheia:** Noites claras; manhã tende a ser fraca, tarde forte.
  ### Estratégia
  - Priorizar superfície no fim da tarde.

- **Lua Nova:** Noites escuras; amanhecer extremamente produtivo.
  ### Estratégia
  - Estar no ponto antes de clarear.

- **Crescente/Minguante:** Intermediárias.
  ### Estratégia
  - Focar manhã e entardecer conforme clima.
`,
  },

  sololunar: {
    majorPeriods: `# Períodos Maiores
- **Duração:** ~2h.
- Tucunaré intensifica caça, inclusive em horários atípicos.
## Estratégia
- Estar posicionado na melhor estrutura no início da janela.`,
    minorPeriods: `# Períodos Menores
- **Duração:** ~1h.
- Bons picos extras, úteis quando o dia está lento.
## Estratégia
- Usar iscas rápidas para cobrir área.`,
    sunRise: `
- Forte janela quando coincide com lua nova.
  ### Estratégia
  - Superfície nos primeiros 30–60 min.`,
    moonRise: `
- Aumento gradual de atividade por mudança luminosa.
  ### Estratégia
  - Combinar com entardecer e iscas visuais.`,
    moonSet: `
- Redução de luminosidade que libera agressividade.
  ### Estratégia
  - Excelente se ocorrer próximo ao amanhecer.
`,
  },
};
