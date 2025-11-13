import { clamp } from "../../algorithms";

export type SolunarPeriodsData = {
  // horas decimais locais (ex.: 17.8333 = 17:50)
  major1StartDec?: number;
  major1StopDec?: number;
  major2StartDec?: number;
  major2StopDec?: number;
  minor1StartDec?: number;
  minor1StopDec?: number;
  minor2StartDec?: number;
  minor2StopDec?: number;
  moonIllumination?: number; // 0..1
};

// pico no centro da janela, 0 nas bordas
function triangularPeakAtCenter(
  hourLocalDec: number,
  startDec: number,
  stopDec: number
): number {
  if (startDec === undefined || stopDec === undefined) return 0;
  if (stopDec <= startDec) return 0;
  const mid = (startDec + stopDec) / 2;
  const half = (stopDec - startDec) / 2;
  const dist = Math.abs(hourLocalDec - mid);
  const x = clamp(1 - dist / half, 0, 1);
  return x; // 0..1
}

// bônus de Lua: pico em nova/cheia, mínimo em 1/2 (quartos)
export function computeMoonBonusPoints(moonIllum: number | undefined): number {
  if (typeof moonIllum !== "number") return 0;
  const f = clamp(moonIllum, 0, 1);
  // curva simples com pico nas bordas (0 e 1), vale 0 no meio (0.5)
  const edgePeak = 1 - 4 * (f - 0.5) * (f - 0.5); // 0..1
  const bonus = edgePeak * 2; // máx +3 pts
  return bonus;
}

// bônus solunar por janelas major/minor
export function computeSolunarBonusPoints(
  d: SolunarPeriodsData,
  hourLocalDec: number
): number {
  const majors = [
    triangularPeakAtCenter(hourLocalDec, d.major1StartDec!, d.major1StopDec!),
    triangularPeakAtCenter(hourLocalDec, d.major2StartDec!, d.major2StopDec!),
  ];
  const minors = [
    triangularPeakAtCenter(hourLocalDec, d.minor1StartDec!, d.minor1StopDec!),
    triangularPeakAtCenter(hourLocalDec, d.minor2StartDec!, d.minor2StopDec!),
  ];

  // pesos: major vale 1.0 (até +4 cada), minor vale 0.5 (até +2 cada)
  const majorSum = majors.reduce((a, b) => a + b, 0); // 0..2
  const minorSum = minors.reduce((a, b) => a + b, 0); // 0..2

  const majorBonus = clamp(majorSum * 4, 0, 8); // duas majors podem somar até +8, mas vamos capar geral abaixo
  const minorBonus = clamp(minorSum * 2, 0, 4); // duas minors até +4

  // cap combinado: +8
  return clamp(majorBonus + minorBonus, 0, 8);
}
