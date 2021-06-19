import React from 'react'
import './App.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import { Currencies } from './pages/Currencies'

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Currencies />
        </Provider>
    )
}

export default App
