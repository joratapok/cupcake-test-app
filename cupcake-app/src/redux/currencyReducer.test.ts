import currenciesReducer, { currenciesActions, CurrencyVariantType, MarketType } from './currencyReducer'

const state = {
    currencies: [
        { id: 'RUB/CUPCAKE', first: 1.23, second: 1.24, third: 1.25, lowest: 0 },
        { id: 'USD/CUPCAKE', first: 2.34, second: 2.35, third: 2.36, lowest: 0 },
        { id: 'EUR/CUPCAKE', first: 3, second: 3, third: 4, lowest: 0 }
    ] as Array<CurrencyVariantType>,
    markets: ['first', 'second', 'third'] as Array<MarketType>,
    errors: ['second'] as Array<MarketType>
}

test('values at first market must change', () => {
    const action = currenciesActions.setActualCurrencies([10, 20], 'first')
    const newState = currenciesReducer(state, action)
    expect(newState.currencies[0].first).toBe(10)
    expect(newState.currencies[1].first).toBe(20)
})

test('values at second and third markets must stay without changes', () => {
    const action = currenciesActions.setActualCurrencies([10, 20], 'first')
    const newState = currenciesReducer(state, action)
    expect(newState.currencies[0].second).toBe(1.24)
    expect(newState.currencies[0].third).toBe(1.25)
})

test('values at second markets must nullify', () => {
    const action = currenciesActions.setNullifyMarket('second')
    const newState = currenciesReducer(state, action)
    expect(newState.currencies[0].second).toBe(0)
    expect(newState.currencies[1].second).toBe(0)
})

test('values at first and third markets must stay without changes', () => {
    const action = currenciesActions.setNullifyMarket('second')
    const newState = currenciesReducer(state, action)
    expect(newState.currencies[0].first).toBe(1.23)
    expect(newState.currencies[1].third).toBe(2.36)
})

test('find lowest values', () => {
    const action = currenciesActions.setLowestValue()
    const newState = currenciesReducer(state, action)
    expect(newState.currencies[0].lowest).toBe(1.23)
    expect(newState.currencies[2].lowest).toBe(0)
})

test('first market must be added in array with errors', () => {
    const action = currenciesActions.setErrorMarket('first')
    const newState = currenciesReducer(state, action)
    expect(newState.errors).toStrictEqual(['second', 'first'])
})

test('second market must be deleted from array with errors', () => {
    const action = currenciesActions.deleteErrorMarket('second')
    const newState = currenciesReducer(state, action)
    expect(newState.errors).toStrictEqual([])
})
