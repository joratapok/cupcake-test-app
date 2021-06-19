import { applyMiddleware, combineReducers, createStore } from 'redux'
import currencyReducer from './currencyReducer'
import thunkMiddleware from 'redux-thunk'

type RootReducerType = typeof rootReducer
export type AppStateType = ReturnType<RootReducerType>
export type InferActionsTypes<T> = T extends {[key: string]: (...args: any[]) => infer U } ? U : never

const rootReducer = combineReducers({
    currency: currencyReducer
})

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export default store
