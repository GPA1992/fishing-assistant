import { openMeteoProvider } from "../repository";
import { getAllWeatherDataService } from "./weather-data.service";

const weatherDataPort = openMeteoProvider();
const getAllWeatherData = getAllWeatherDataService(weatherDataPort);

export { getAllWeatherData };
