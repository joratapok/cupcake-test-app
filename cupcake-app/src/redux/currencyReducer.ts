import {AppStateType, InferActionsTypes} from './store'
import {ActualCurrenciesType, currenciesApi, RatesType} from '../api/api'
import {ThunkAction} from 'redux-thunk'

export type CurrencyVariantType = {
    id: 'RUB/CUPCAKE' | 'USD/CUPCAKE' | 'EUR/CUPCAKE' | 'RUB/USD' | 'RUB/EUR' | 'EUR/USD'
    first: number
    second: number
    third: number
    lowest: number
}

export type MarketType = 'first' | 'second' | 'third'
export type CurrenciesInitialType = typeof initial
export type CurrenciesActionsTypes = InferActionsTypes<typeof currenciesActions>
type ThunkType = ThunkAction<Promise<void>, AppStateType, any, CurrenciesActionsTypes>

export const SET_ACTUAL_CURRENCIES = 'SET_ACTUAL_CURRENCIES'
export const SET_NULLIFY_MARKET = 'SET_NULLIFY_MARKET'
export const SET_LOWEST_VALUE = 'SET_LOWEST_VALUE'
export const SET_ERROR_MARKET = 'SET_ERROR_MARKET'
export const DELETE_ERROR_MARKET = 'DELETE_ERROR_MARKET'

const initial = {
    currencies: [
      {id: 'RUB/CUPCAKE' ,first: 0, second: 0, third: 0, lowest: 0},
      {id: 'USD/CUPCAKE' ,first: 0, second: 0, third: 0, lowest: 0},
      {id: 'EUR/CUPCAKE' ,first: 0, second: 0, third: 0, lowest: 0},
      {id: 'RUB/USD' ,first: 0, second: 0, third: 0, lowest: 0},
      {id: 'RUB/EUR' ,first: 0, second: 0, third: 0, lowest: 0},
      {id: 'EUR/USD' ,first: 0, second: 0, third: 0, lowest: 0}
    ] as Array<CurrencyVariantType>,
    markets: ['first', 'second', 'third'] as Array<MarketType>,
    errors: [] as Array<MarketType>,
}

const currenciesReducer = (state = initial, action: CurrenciesActionsTypes): CurrenciesInitialType => {
    switch (action.type) {
        case SET_ACTUAL_CURRENCIES:
                return {
                    ...state,
                    currencies: [...state.currencies.map((el, index) => {
                      return {...el, [action.payload.market]: action.payload.currenciesData[index]}
                    })]
                }
        case SET_NULLIFY_MARKET:
                return {
                    ...state,
                    currencies: [...state.currencies.map((el) => {
                      return {...el, [action.payload.market]: 0}
                    })]
                }
        case SET_LOWEST_VALUE:
                return {
                    ...state,
                    currencies: [...state.currencies.map((el) => {
                      return {...el, lowest: findLowestValue(el)}
                    })]
                }
        case SET_ERROR_MARKET:
                return {
                    ...state,
                    errors: [...state.errors, action.payload.market]
                }
        case DELETE_ERROR_MARKET:
                return {
                    ...state,
                    errors: [...state.errors.filter((market) => market !== action.payload.market )]
                }
    default:
        return state
}
}

export const currenciesActions = {
    setActualCurrencies: (currenciesData: Array<number>, market: MarketType) => ({
        type: SET_ACTUAL_CURRENCIES, payload: {
          currenciesData, market
        }
    } as const),
    setNullifyMarket: (market: MarketType) => ({
        type: SET_NULLIFY_MARKET, payload: {
          market
        }
    } as const),
    setLowestValue: () => ({ type: SET_LOWEST_VALUE } as const),
    setErrorMarket: (market: MarketType) => ({
        type: SET_ERROR_MARKET, payload: {
          market
        }
    } as const),
    deleteErrorMarket: (market: MarketType) => ({
        type: DELETE_ERROR_MARKET, payload: {
          market
        }
    } as const),
}

const calcCurrencyValues = (rates: RatesType): Array<number> => {
    let currentCurrencyValues: Array<number> = []
    currentCurrencyValues.push(+(1 / rates['RUB']).toFixed(3))
    currentCurrencyValues.push(+(1 / rates['USD']).toFixed(3))
    currentCurrencyValues.push(+(1 / rates['EUR']).toFixed(3))
    currentCurrencyValues.push(+(rates['USD'] / rates['RUB']).toFixed(3))
    currentCurrencyValues.push(+(rates['EUR'] / rates['RUB']).toFixed(3))
    currentCurrencyValues.push(+(rates['USD'] / rates['EUR']).toFixed(3))
    return currentCurrencyValues
}

export const subscribeToMarketThunk = (market: MarketType): ThunkType => {
    return async function subscribe(dispatch, getState) {
      const errors: Array<MarketType> = getState().currency.errors
        try {
          let response = await currenciesApi.getActualCurrencies(market)
          if (response.status === 502) {
              await subscribe(dispatch, getState);
          } else if (response.status !== 200) {
              dispatch(currenciesActions.setNullifyMarket(market))
              await new Promise(resolve => setTimeout(resolve, 15000));
              await subscribe(dispatch, getState);
          } else {
              let currencies: ActualCurrenciesType = await response.data;
              dispatch(currenciesActions.setActualCurrencies(calcCurrencyValues(currencies.rates), market))
              dispatch(currenciesActions.setLowestValue())
              if (errors.includes(market)) {
                  dispatch(currenciesActions.deleteErrorMarket(market))
              }
              await subscribe(dispatch, getState);
          }
        } catch (e) {
            console.error('>>>>');
            console.error('Connection was failed');
            dispatch(currenciesActions.setNullifyMarket(market))
            if (!errors.includes(market)) {
                dispatch(currenciesActions.setErrorMarket(market))
            }
            await new Promise(resolve => setTimeout(resolve, 15000));
            await subscribe(dispatch, getState);
        }
    }
}

function findLowestValue(currencyPair: CurrencyVariantType) {
    let lowest: number = Math.min(currencyPair['first'], currencyPair['second'], currencyPair['third'])
    if (lowest === currencyPair['first'] && lowest === currencyPair['second']) {
      lowest = 0
    }
    if (lowest === currencyPair['second'] && lowest === currencyPair['third']) {
      lowest = 0
    }
    if (lowest === currencyPair['first'] && lowest === currencyPair['third']) {
      lowest = 0
    }
    return lowest
}

export default currenciesReducer
