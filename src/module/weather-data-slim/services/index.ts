import { openMeteoProvider } from "../repository";
import { getRainDataService } from "./get-rain-data.service";
import { getAllWeatherDataService } from "./weather-data.service";

const weatherDataPort = openMeteoProvider();
const getAllWeatherData = getAllWeatherDataService(weatherDataPort);
const getRainData = getRainDataService(weatherDataPort);

export { getAllWeatherData, getRainData };
