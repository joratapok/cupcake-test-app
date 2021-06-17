import axios from 'axios'


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
    baseURL: 'localhost:3000/api/v1/',
})

export const currensiesApi = {
    getActualCurrencies (market: MarketType) {
        return instance.get<ActualCurrenciesType>(`${market}/poll`).then(res => res)
    }
}
