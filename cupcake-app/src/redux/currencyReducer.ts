import { AppStateType, InferActionsTypes } from './store'
import { currensiesApi } from '../api/api'
import { ThunkAction } from 'redux-thunk'

export type CurrenciesType = {
  RUB/CUPCAKE: number
  USD/CUPCAKE: number
  EUR/CUPCAKE: number
  RUB/USD: number
  RUB/EUR: number
  EUR/USD: number
}

export type MarketType = 'first' | 'second' | 'third'
export type CurrenciesInitialType = typeof initial
export type CurrenciesActionsTypes = InferActionsTypes<typeof currenciesActions>
type ThunkType = ThunkAction<Promise<void>, AppStateType, any, bookReducerActionsTypes>

export const GET_ACTUAL_CURRENCIES = 'GET_ACTUAL_CURRENCIES'

const initial = {
    currencies: {
      first: {} as CurrenciesType,
      second: {} as CurrenciesType,
      third: {} as CurrenciesType,
    }
}

const currenciesReducer = (state = initial, action: CurrenciesActionsTypes): CurrenciesInitialType => {
    switch (action.type) {
    case GET_ACTUAL_CURRENCIES:
        return {
            ...state,
            currencies: {...state.currencies,
              action.payload.market: action.payload.currenciesData,
            }
        }
    default:
        return state
    }
}

export const currenciesActions = {
    getActualCurrencies: (currenciesData: CurrenciesType, market: MarketType) => ({ type: GET_ACTUAL_CURRENCIES, payload: {
      currenciesData,
      numberMarket
    } } as const)
}

const calcCurrencyValues = (rates: RatesType) => {
  let currentCurrencyValues: CurrenciesType = {
    RUB/CUPCAKE: 0,
    USD/CUPCAKE: 0,
    EUR/CUPCAKE: 0,
    RUB/USD: 0,
    RUB/EUR: 0,
    EUR/USD: 0,
  }
  currentCurrencyValues[RUB/CUPCAKE] = 1 / rates['RUB']
  currentCurrencyValues[USD/CUPCAKE] = 1 / rates['USD']
  currentCurrencyValues[EUR/CUPCAKE] = 1 / rates['EUR']
  currentCurrencyValues[RUB/USD] = rates['USD'] / rates['RUB']
  currentCurrencyValues[RUB/EUR] = rates['EUR'] / rates['RUB']
  currentCurrencyValues[EUR/USD] = rates['USD'] / rates['EUR']
  return currentCurrencyValues
}

export const subscribeToMarketThunk = (market: MarketType): ThunkType => {
  return async (dispatch) => {
    let response = await currensiesApi.getActualCurrencies(market)
    if (response.status == 502) {
      await subscribe();
    } else if (response.status != 200) {
      console.error(response.statusText);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await subscribe();
    } else {
      let currencies: ActualCurrenciesType = await response.data;
      dispatch(getActualCurrencies(calcCurrencyValues(currencies.rates), market))
      await subscribe();
    }
  }
}

export const getActualCurrenciesThunk = (market: MarketType): ThunkType => {
    return async (dispatch) => {
        try {
            const response = await commentApi.getComments(id)
            dispatch(actionsBooksReducer.getComments(response.data))
        } catch (e) {
            console.error(e)
        }
    }
}


export default currenciesReducer
