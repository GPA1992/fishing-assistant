import { environmentDataType } from "../types";

// talvez seja necessario ignorar showers
const traira: environmentDataType = {
  climaticConditions: {
    temperature: `# Temperatura do Ar (Traíra)
- **<12°C:** Ar frio derruba rápido a temperatura da água rasa. Traíra fica parada em fundos e poços. Ataques quase inexistentes.
- **12–15°C:** Água esfria o bastante para reduzir fortemente o metabolismo. Só reage a iscas encostadas na estrutura e com trabalho mínimo.
- **15–18°C:** Transição fria. Água ainda gelada. Atividade moderada para baixa. Traíra ocupa rasos ensolarados nas horas mais quentes do dia.
- **18–22°C:** Zona estável. Água mantém leve aquecimento. Predadora já circula com mais frequência. Bom para iscas lentas e softs.
- **22–26°C (ótimo):** Ar quente aquece rasos cedo. Água atinge faixa de conforto. Ataques mais previsíveis em estruturas e vegetação.
- **26–30°C:** Atividade alta no início da manhã e fim da tarde. No meio do dia a água superficial superaquece e perde O₂. Traíra busca sombra.
- **30–33°C:** Limiar de estresse. Horários quentes produzem quedas bruscas de oxigênio. Atividade real quase só em janelas curtas.
- **>33°C:** Calor extremo. Água rasa esquenta rápido. Traíra refugia-se em profundidade ou sombra densa. Janelas úteis apenas no amanhecer e crepúsculo.

## Estratégia por faixa térmica
- **Frio (<18°C):** Evitar manhãs geladas. Pescar no pico de aquecimento do dia. Trabalhar iscas lentamente.
- **Ameno (18–24°C):** Faixa mais previsível. Água responde bem ao aquecimento solar. Iscas com ritmo moderado.
- **Quente (24–30°C):** Melhor condição geral. Focar superfície e cobertura vegetal. Alternar velocidade conforme horário.
- **Calor extremo (>30°C):** Pescar somente cedo/tarde. Procurar sombra dura, árvores caídas e trechos profundos.
`,
    humidity: `
# Umidade Relativa (Traíra)
- **>85%:** Geralmente indica céu nublado, neblina ou ameaça de chuva. Luz difusa reduz contraste e a traíra pode ficar menos ativa, dificultando a caça visual.
- **70–85%:** Ambiente úmido comum em dias nublados. Atividade tende a ser mais irregular. Pode melhorar antes/depois de pancadas rápidas, mas estabiliza em nível mediano.
- **50–70%:** Faixa neutra. Condições variam conforme vento, cobertura e temperatura. Não afeta diretamente o comportamento, mas modula transparência do ar e luminosidade.
- **<50%:** Ar seco associado a céu limpo. Maior contraste de luz. Facilita a localização de presas. Considerado cenário mais favorável no estudo.
- **<35% (muito seco):** Normalmente indica céu muito limpo e forte incidência solar. O aquecimento superficial da água pode reduzir o O₂ na camada superior, levando a traíra a descer ou reduzir atividade no pico do calor.

## Estratégia
- **Umidade alta (>80%):** Priorizar horários com melhor luz (janela entre dissipação de neblina e início de chuva). Usar iscas de maior vibração ou cor marcante.
- **Umidade média (60–80%):** Ler o céu. Se estiver nublado, reduzir velocidade das iscas; se abrir clareira, aproveitar porque a atividade sobe rápido.
- **Umidade baixa (<60%):** Condição mais estável. Focar estruturas expostas pela luz direta. Trabalhos mais rápidos funcionam melhor.
`,
    pressure: `
# Pressão Atmosférica (Traíra)
- **Queda acentuada (>3–4 hPa):** Forte estímulo alimentar. Antes de tempestades ou frentes frias, a traíra sobe para rasos e ataca com agressividade.
- **Queda gradual (1–3 hPa):** Cenário consistentemente positivo. Indica instabilidade chegando. Atividade tende a subir ao longo das horas.
- **Faixa ótima (1010–1020 hPa):** Zona citada no estudo como mais produtiva. Tempo firme porém não estagnado. Comportamento previsível e moderadamente ativo.
- **Alta estável (>1020 hPa):** Pós-frente fria. Traíra fica profunda, seletiva e lenta. Exige iscas menores, fundo e trabalho sutil.
- **Baixa muito profunda (<1005 hPa):** Próximo de tempestades severas. Pode gerar bom pico pré-evento, seguido de forte queda de atividade assim que o tempo “fecha”.

## Estratégia
- **Pressão em queda:** Priorizar momentos imediatamente antes da mudança de tempo. Aumentar velocidade e usar iscas mais agressivas.
- **Pressão estável moderada (1010–1020):** Estruturas, cobertura e técnicas padrão funcionam com previsibilidade.
- **Pressão alta estática:** Trabalhar fundo e lento. Usar apresentações discretas e precisas.
- **Pré-tempestade:** Janelas curtas e explosivas. Monitorar tendência, não valores absolutos.

`,
    wind: `
# Vento (Traíra)
- **0–8 km/h (brisa leve):** Condição ideal. Superfície estável. A traíra detecta vibrações e som da presa com precisão.
- **8–18 km/h (vento moderado):** Pequena ondulação. A pesca ainda é eficiente, mas a leitura de ataques fica menos nítida.
- **18–28 km/h (vento forte):** Ondas formadas. Vegetação balança. Estímulos sensoriais se diluem. Traíra tende a descer e ficar escondida.
- **>28 km/h (ventania):** Condição crítica. Controle da linha e da isca se perde. Atividade cai de forma acentuada.

## Estratégia
- **Brisa leve:** Priorizar iscas de superfície e meia-água. É o cenário mais produtivo.
- **Vento moderado:** Ajustar arremessos “de costa” para o vento e usar iscas mais estáveis (meia-água/fundo).
- **Vento forte:** Procurar áreas abrigadas (enseadas, barrancos, mato fechado). Evitar iscas de superfície.
- **Ventania:** Não insistir na superfície. Usar iscas mais pesadas, que se mantenham estáveis no fundo.

`,
  },
  rain: {
    volume: `# Volume de Chuva
- **Chuvas leves (0–2 mm/h):** Mantêm a traíra ativa. Em água e ar quentes (24–32°C), podem favorecer a caça e dar boa nota.
- **Chuvas moderadas (2–5 mm/h):** Começam a reduzir eficiência, principalmente com tempo frio ou sequência longa.
- **Chuvas fortes (>5 mm/h):** Atrapalham muito. Turbulência, água turva e corrente deixam a traíra retraída.
- **Chuva forte prolongada:** Caracteriza frente instalada. Atividade cai para patamar muito baixo.

## Estratégia
- **Volume leve:** Pescaria mantida. Em dia quente, cenário positivo.
- **Volume moderado:** Avaliar duração e temperatura. Curto e com clima ameno ainda rende. Longo ou frio tende a ser ruim.
- **Volume forte ou temporal contínuo:** Evitar. Esperar estabilizar e clarear para retomar.`,

    showers: `# Pancadas (Showers)
- **Pancada isolada em dia quente e estável:** Cenário premium. Após a pancada cessar, há pico de atividade pela combinação de leve resfriamento, quebra de luz e oxigenação.
- **Pancada em dia já chuvoso/frio:** Não gera o mesmo efeito. Com água fria ou sistema já carregado, o ganho é mínimo.

## Estratégia
- **Pancada em dia quente limpo:** Esperar parar e arremessar imediatamente após. Alta chance de ataque.
- **Pancada em cenário frio ou muito chuvoso:** Tratar como chuva comum. Não contar com pico de atividade.`,

    probability: `# Probabilidade de Chuva
- **Alta probabilidade sem chuva ainda (≥40%) em dia quente:** Indica boa janela pré-chuva. A traíra tende a se alimentar mais antes da mudança.
- **Probabilidade alta com vento forte ou volumes previstos altos:** Sinal de temporal. Reduz nota e tende a travar o peixe.
- **Probabilidade baixa em calor extremo seco:** Não traz benefício. Pode indicar água aquecida demais e menor conforto.

## Estratégia
- **Alta probabilidade em condição quente e estável:** Valorizar horas imediatamente antes da chuva.
- **Alta probabilidade associada a temporal:** Reduz expectativa geral. Priorizar segurança.
- **Baixa probabilidade com clima moderado:** Manter leitura neutra, sem bônus ou penalidade relevante.`,
  },
  moonPhase: {
    phase: `
- Lua Cheia: Alta luminosidade noturna. A traíra patrulha margens e superfície com maior atividade visual.
  ### Estratégia
  - Usar iscas de superfície e meia-água em noites claras.
  - Aproveitar ações noturnas mais previsíveis.

- Lua Nova: Noite escura. Menor atividade noturna pela baixa visibilidade; a traíra costuma amanhecer mais faminta.
  ### Estratégia
  - Priorizar o amanhecer como principal janela de atividade.
  - Começar com iscas discretas e aumentar intensidade conforme a luz cresce.

- Quarto Crescente / Minguante: Efeito intermediário. Alteram a luminosidade de forma moderada e influenciam principalmente horários de transição.
  ### Estratégia
  - Focar amanhecer e entardecer.
  - Ajustar velocidade e profundidade de acordo com clima e vento do dia.
  `,
  },
  sololunar: {
    majorPeriods: `# Períodos Maiores
- Ocorrem no **zênite (moonTransit)** e no **nadir (moonUnderfoot)**.
- **Duração média:** 2 horas.
- São as janelas de **maior atividade**, com alta probabilidade de ataques e captura de exemplares grandes.
- A atividade pode começar poucos minutos após o trânsito e se estender levemente além.
- **Modulação ambiental:** temperatura e clima podem ampliar ou reduzir a intensidade.
## Estratégia
- Estar no melhor ponto durante toda a janela.
- Manter a isca ativa e cobrindo a estrutura com constância.`,
    minorPeriods: `# Períodos Menores
- Surgem no **nascer da Lua (moonRise)** e no **pôr da Lua (moonSet)**.
- **Duração média:** 1 hora.
- Intensidade moderada, porém superior ao restante do dia.
- Funcionam como janelas extras quando a pescaria está lenta.
## Estratégia
- Atacar áreas rasas e estruturas rápidas.
- Alternar iscas caso o período maior tenha sido fraco.`,
    sunRise: `
- Marca início da fase de maior aquecimento e reorganização alimentar. Em noites escuras (lua nova), a traíra tende a iniciar o dia mais ativa.
  ### Estratégia
  - Trabalhar iscas por 30–60 minutos após o nascer do sol.
  - Se coincidir com moonSet, a janela se intensifica.
  `,
    moonRise: `
- O nascer da lua tende a gerar um período gradual de aumento de atividade por mudança luminosa e comportamento solunar.
  ### Estratégia
  - Combinar com entardecer para janelas críticas.
  - Usar iscas mais visuais em lua cheia.
  `,
    moonSet: `
- A saída da lua reduz luminosidade e pode liberar atividade, especialmente em noites escuras.
  ### Estratégia
  - Se ocorrer próximo ao amanhecer, cria um pico duplo.
  - Bom para iniciar pescarias em madrugadas claras ou em amanheceres de lua nova.
`,
  },
};

export default traira;
