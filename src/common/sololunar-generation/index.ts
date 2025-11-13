import { DateTime } from "luxon";
import tzLookup from "tz-lookup";
import {
  SearchRiseSet,
  Body,
  Observer,
  AstroTime,
  Illumination,
  Equator,
  Horizon,
} from "astronomy-engine";
import { HourlyRating, Sololunar, sololunarGenerationParams } from "./types";

export const sololunarGeneration = (
  data: sololunarGenerationParams
): Sololunar => {
  const { lat, lon, date } = data;

  const tz = tzLookup(lat, lon);
  const startLocal = DateTime.fromISO(date, { zone: tz }).startOf("day");
  /*       const endLocal = startLocal.endOf("day"); */

  const obs = new Observer(lat, lon, 0);
  const tStart = new AstroTime(startLocal.toJSDate());
  /* const tEnd = new AstroTime(endLocal.toJSDate()); // mantido caso queira checar janelas */

  // --- SOL ---
  const sunRise = SearchRiseSet(Body.Sun, obs, +1, tStart, 1); // nascer
  const sunSet = SearchRiseSet(Body.Sun, obs, -1, tStart, 1); // pôr
  // “Noon” simples no meio do dia local (suficiente para scoring/indicativo)
  const sunTransit = startLocal.plus({ hours: 12 }).toJSDate();

  // --- LUA (nascer/pôr) ---
  const moonRise = SearchRiseSet(Body.Moon, obs, +1, tStart, 1);
  const moonSet = SearchRiseSet(Body.Moon, obs, -1, tStart, 1);

  // --- Lua transit (culminação) por amostragem rápida de altitude ---
  function searchMoonTransit(dayStart: DateTime): Date {
    let bestT = dayStart;
    let bestAlt = -90;
    for (let m = 0; m <= 24 * 60; m += 2) {
      // passo 2min
      const now = dayStart.plus({ minutes: m });
      const eq = Equator(
        Body.Moon,
        new AstroTime(now.toJSDate()),
        obs,
        true,
        true
      );
      const hor = Horizon(now.toJSDate(), obs, eq.ra, eq.dec, "normal");
      if (hor.altitude > bestAlt) {
        bestAlt = hor.altitude;
        bestT = now;
      }
    }
    return bestT.toJSDate();
  }
  const moonTransit = searchMoonTransit(startLocal);
  const moonUnder = DateTime.fromJSDate(moonTransit)
    .plus({ hours: 12 })
    .toJSDate(); // antitrânsito aproximado

  // --- Fase/iluminação ---
  const illum = Illumination(
    Body.Moon,
    new AstroTime(startLocal.plus({ hours: 12 }).toJSDate())
  );
  const illumFrac = illum.phase_fraction; // 0..1

  function phaseName(frac: number): string {
    if (frac < 0.03) return "New Moon";
    if (frac < 0.25) return "Waxing Crescent";
    if (frac < 0.27) return "First Quarter";
    if (frac < 0.48) return "Waxing Gibbous";
    if (frac < 0.52) return "Full Moon";
    if (frac < 0.73) return "Waning Gibbous";
    if (frac < 0.77) return "Last Quarter";
    return "Waning Crescent";
  }

  // --- helpers ---
  const fmt = (d?: Date) =>
    d ? DateTime.fromJSDate(d, { zone: tz }).toFormat("HH:mm") : "";

  const dec = (d?: Date) => {
    if (!d) return 0;
    const dt = DateTime.fromJSDate(d, { zone: tz });
    return Number((dt.hour + dt.minute / 60).toFixed(6));
  };
  const win = (center?: Date, minutes = 60): [Date, Date] | undefined => {
    if (!center) return undefined;
    const c = DateTime.fromJSDate(center, { zone: tz });
    return [c.minus({ minutes }).toJSDate(), c.plus({ minutes }).toJSDate()];
  };

  // Janelas Solunares (padrão: major ±60min, minor ±30min)
  const major1 = win(moonTransit, 60);
  const major2 = win(moonUnder, 60);
  const minor1 = win(moonRise?.date, 30);
  const minor2 = win(moonSet?.date, 30);

  // Pontuações por hora (0/20/40)
  const hourlyRating = {} as HourlyRating;
  for (let h = 0; h < 24; h++) {
    const t0 = startLocal.plus({ hours: h }).toJSDate();
    const inWin = (w?: [Date, Date]) => w && t0 >= w[0] && t0 < w[1];

    const score =
      inWin(major1) || inWin(major2)
        ? 40
        : inWin(minor1) || inWin(minor2)
        ? 20
        : 0;

    const key = h.toString() as keyof HourlyRating;
    hourlyRating[key] = score;
  }

  const dayRating = Math.round(
    Object.values(hourlyRating).reduce((a, b) => a + b, 0) / 24 / 40
  );

  const body: Sololunar = {
    sunRise: fmt(sunRise?.date),
    sunTransit: fmt(sunTransit),
    sunSet: fmt(sunSet?.date),
    moonRise: fmt(moonRise?.date),
    moonTransit: fmt(moonTransit),
    moonUnder: fmt(moonUnder),
    moonSet: fmt(moonSet?.date),
    moonPhase: phaseName(illumFrac),
    moonIllumination: Number(illumFrac.toFixed(9)),
    sunRiseDec: dec(sunRise?.date),
    sunTransitDec: dec(sunTransit),
    sunSetDec: dec(sunSet?.date),
    moonRiseDec: dec(moonRise?.date),
    moonSetDec: dec(moonSet?.date),
    moonTransitDec: dec(moonTransit),
    moonUnderDec: dec(moonUnder),

    minor1StartDec: dec(minor1?.[0]),
    minor1Start: fmt(minor1?.[0]),
    minor1StopDec: dec(minor1?.[1]),
    minor1Stop: fmt(minor1?.[1]),

    minor2StartDec: dec(minor2?.[0]),
    minor2Start: fmt(minor2?.[0]),
    minor2StopDec: dec(minor2?.[1]),
    minor2Stop: fmt(minor2?.[1]),

    major1StartDec: dec(major1?.[0]),
    major1Start: fmt(major1?.[0]),
    major1StopDec: dec(major1?.[1]),
    major1Stop: fmt(major1?.[1]),

    major2StartDec: dec(major2?.[0]),
    major2Start: fmt(major2?.[0]),
    major2StopDec: dec(major2?.[1]),
    major2Stop: fmt(major2?.[1]),

    dayRating,
    hourlyRating,
  };

  return body;
};
