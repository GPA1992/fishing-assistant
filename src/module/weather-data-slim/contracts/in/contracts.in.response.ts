export interface HourlyResponseData<T> {
  hourly: T[];
  targetHour: T;
}

export interface DailyResponseData<T> {
  daily: T[];
  targetDay: T;
}

export interface WeatherByHourData {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
}
