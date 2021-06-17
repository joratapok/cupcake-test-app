import axios from 'axios'
import { MarketType } from '../redux/currencyReducer'


export type ActualCurrenciesType = {
  rates: RatesType
  timestamp: number
  base: string
  date: string
}
export type RatesType = {
  'RUB': number
  'USD': number
  'EUR': number
}

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/v1/',
    headers: { 'accept': 'application/json',
        'Access-Control-Allow-Origin': 'true'
    }
})

export const currenciesApi = {
    getActualCurrencies (market: MarketType) {
        return instance.get<ActualCurrenciesType>(`${market}/poll`).then(res => res)
    }
}
