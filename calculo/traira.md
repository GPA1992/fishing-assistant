# Calculo da pontuacao da traira

## Visao geral do fluxo
- Temperatura considerada e suavizada como temperatura da agua (20% do delta por hora) e reinicia quando a hora retrocede.
- Cada fator ambiental converte o valor medido em uma nota de 0 a 100 usando faixas declaradas; notas fora das faixas sao limitadas ao minimo e maximo definidos.
- Pesos especificos da especie combinam as notas: temperatura 0.32, pressao 0.24, vento 0.19, chuva 0.20, umidade 0.05.
- Variaveis ativas (temperatura, vento, chuva) sofrem o ajuste diurno; variaveis passivas (umidade, pressao) nao. A media ponderada resultante e limitada a 0-100.
- Bonus externos (lua, solunar, janela da fase da lua) somam ao score, mas o total de bonus e limitado a +8 antes do corte final em 0-100.

## Interpretacao das faixas por fator

### Temperatura da agua (peso 0.32)
Faixa principal entre 22-26 C, com queda apos 26 C e anulacao abaixo de 8 C ou acima de 36 C.

| Temperatura (C) | Nota aproximada |
| --- | --- |
| ate 8 | 0 |
| 8-12 | 0 -> 10 |
| 12-15 | 10 -> 25 |
| 15-18 | 25 -> 40 |
| 18-22 | 40 -> 70 |
| 22-26 | 70 -> 100 (pico em 26) |
| 26-30 | 100 -> 80 |
| 30-33 | 80 -> 20 |
| 33-36 | 20 -> 0 |
| acima de 36 | 0 |

### Umidade relativa (peso 0.05)
Preferencia por ar moderadamente umido; extremos altos ou muito baixos reduzem a nota.

| Umidade (%) | Nota aproximada |
| --- | --- |
| 0-25 | 60 |
| 25-35 | 75 -> 90 |
| 35-40 | 90 -> 100 |
| 40-50 | 100 -> 95 |
| 50-60 | 95 -> 75 |
| 60-70 | 75 -> 55 |
| 70-80 | 55 -> 35 |
| 80-90 | 35 -> 20 |
| 90-100 | 20 |

### Pressao atmosferica (peso 0.24)
Melhor faixa entre 1010-1016 hPa, penalizando pressao em alta subida e premiando queda suave.

| Pressao (hPa) | Nota aproximada |
| --- | --- |
| 900-980 | 45 |
| 980-995 | 50 -> 60 |
| 995-1005 | 60 -> 75 |
| 1005-1010 | 75 -> 90 |
| 1010-1016 | 90 -> 100 (pico) |
| 1016-1022 | 100 -> 85 |
| 1022-1030 | 85 -> 60 |
| 1030-1050 | 60 |

**Tendencia em 6h:** queda de pressao adiciona ate +6 pontos (queda de 6 hPa ou mais); subida retira ate -12 pontos (subida de 6 hPa ou mais). O resultado final e sempre limitado a 0-100.

### Vento (peso 0.19)
Vento fraco e ligeiro e melhor; vento acima de 18 km/h reduz bastante a nota.

| Vento (km/h) | Nota aproximada |
| --- | --- |
| 0-3 | 95 -> 100 |
| 3-8 | 100 -> 80 |
| 8-18 | 80 -> 60 |
| 18-28 | 60 -> 35 |
| 28-40 | 35 -> 20 |
| acima de 40 | 15 |

### Chuva (peso 0.20)
Pontuacao inicia com uma regra base (a primeira que casa) e depois aplica modificadores adicionais. Valores finais sao limitados a 0-100.

**Regras base (escolhe apenas a primeira aplicavel):**
- Volume 0 mm e probabilidade 0%: fixa em 40.
- Volume 0 mm e probabilidade <30%: varia de 45 a 60 conforme a probabilidade.
- Volume 0 mm e probabilidade 30-70%: varia de 60 a 75 conforme a probabilidade.
- Volume 0 mm e probabilidade >=70%: varia de 75 a 85 conforme a probabilidade.
- Chuva leve 0-2 mm: varia de 65 a 78 conforme o volume.
- Chuva moderada 2-5 mm: varia de 40 a 25 (piora com mais volume).
- Chuva forte 5-20 mm: varia de 25 a 5 (piora com mais volume).
- Chuva extrema >20 mm: fixa em 5.

**Modificadores (podem combinar):**
- Pancadas isoladas em dia quente e umido moderado (volume=0, showers>0, prob.<40%, umidade <=75%, temperatura morna 24-32 C): eleva para no maximo 80-95.
- Pre-choque quente (sem volume, prob.>=30%, temperatura morna 24-32 C): eleva para no maximo 70-92 conforme a probabilidade.
- Chuva com frio (temperatura <=20 C e volume>0): reduz pela metade.
- Volume alto com umidade saturada e sem pancadas (umidade>95%, volume>0, showers=0): multiplica por 0.7.
- Temporal por volume alto (volume>=8 mm): limita ao minimo entre o atual e um intervalo que vai de 15 a 0 conforme o volume cresce.
- Temporal com vento quando e muito provavel (prob.>=70% e vento>=25 km/h): tambem limita ao minimo usando a mesma curva 15 -> 0.
- Calor seco absoluto (temp.>=32 C, volume=0, prob.=0): reduz 40% a 100% conforme a temperatura sobe 32-38 C (multiplica por fator 1 -> 0.6).

Faixas termicas usadas por essas regras: morno 24-32 C, quente >=32 C, frio <=20 C.

## Ajuste diurno e adequacao termica
- Amplitude base de 0.05 gera varacao diaria suave: fator vai de 0.95 (referencia ao meio-dia) a 1.05 (transicoes de manha e fim de tarde).
- A amplitude depende da adequacao termica da agua: 0.3 em temperaturas muito baixas (<18 C) ou muito altas (>34 C), subindo ate 1 entre 22-26 C, caindo apos 30 C. Se nao houver dado de temperatura, usa adequacao padrao 0.7.
- Apenas temperatura, vento e chuva sao multiplicados por esse fator; umidade e pressao entram sem ajuste.

## Bonus externos
- **Iluminacao da lua:** esquema "center-peaks" com maximo de +2 pontos, melhor em iluminacao ao redor de 50% e zerado em lua nova ou cheia.
- **Solunar:** cada periodo maior pesa 4 e cada menor pesa 2; quanto mais perto do centro do periodo, maior o reforco. O total solunar e limitado a +8 antes do cap global.
- **Janela da fase da lua:** reforcos pequenos adicionais por hora local decimada e fase:
  - Lua cheia: ate +1.5 na faixa 20h-4h30 e um arrasto menor ate 10h.
  - Lua nova: ate +1.5 focado em 4h30-9h.
  - Luas crescente/minguante: ate +1.2 em janelas 5h-9h e 16h-20h30.
- A soma de todos os bonus e truncada em +8 antes de combinar com a media ponderada.

## Resultado final
- Nota base = media ponderada dos fatores apos ajuste diurno (ativos) e sem ajuste (passivos).
- Bonus externos somam, mas o score final fica entre 0 e 100 com corte inferior e superior.
