import {AppStateType, InferActionsTypes} from './store'
import {ActualCurrenciesType, currenciesApi, RatesType} from '../api/api'
import {ThunkAction} from 'redux-thunk'

export type CurrenciesType = {
    'RUB/CUPCAKE': number
    'USD/CUPCAKE': number
    'EUR/CUPCAKE': number
    'RUB/USD': number
    'RUB/EUR': number
    'EUR/USD': number
}

export type MarketType = 'first' | 'second' | 'third'
export type CurrenciesInitialType = typeof initial
export type CurrenciesActionsTypes = InferActionsTypes<typeof currenciesActions>
type ThunkType = ThunkAction<Promise<void>, AppStateType, any, CurrenciesActionsTypes>

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
                currencies: {
                    ...state.currencies,
                    [action.payload.market]: action.payload.currenciesData,
    }
}
default:
    return state
}
}

export const currenciesActions = {
    setActualCurrencies: (currenciesData: CurrenciesType, market: MarketType) => ({
        type: GET_ACTUAL_CURRENCIES, payload: {
            currenciesData, market
        }
    } as const)
}

const calcCurrencyValues = (rates: RatesType): CurrenciesType => {
    let currentCurrencyValues: CurrenciesType = {
        'RUB/CUPCAKE': 0,
        'USD/CUPCAKE': 0,
        'EUR/CUPCAKE': 0,
        'RUB/USD': 0,
        'RUB/EUR': 0,
        'EUR/USD': 0,
    }
    currentCurrencyValues['RUB/CUPCAKE'] = +(1 / rates['RUB']).toFixed(2)
    currentCurrencyValues['USD/CUPCAKE'] = +(1 / rates['USD']).toFixed(2)
    currentCurrencyValues['EUR/CUPCAKE'] = +(1 / rates['EUR']).toFixed(2)
    currentCurrencyValues['RUB/USD'] = +(rates['USD'] / rates['RUB']).toFixed(2)
    currentCurrencyValues['RUB/EUR'] = +(rates['EUR'] / rates['RUB']).toFixed(2)
    currentCurrencyValues['EUR/USD'] = +(rates['USD'] / rates['EUR']).toFixed(2)
    return currentCurrencyValues
}

export const subscribeToMarketThunk = (market: MarketType): ThunkType => {
    return async function subscribe(dispatch) {
        let response = await currenciesApi.getActualCurrencies(market)
        if (response.status == 502) {
            await subscribe(dispatch);
        } else if (response.status != 200) {
            console.error(response.statusText);
            await new Promise(resolve => setTimeout(resolve, 5000));
            await subscribe(dispatch);
        } else {
            let currencies: ActualCurrenciesType = await response.data;
            dispatch(currenciesActions.setActualCurrencies(calcCurrencyValues(currencies.rates), market))
            await subscribe(dispatch);
        }
    }
}

export default currenciesReducer
