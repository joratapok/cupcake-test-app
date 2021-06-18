import React from "react"
import { MarketType } from '../redux/currencyReducer'

type ErrorMessagesPropsType = {
  errors: Array<MarketType>
}

export const ErrorMessages: React.FC<ErrorMessagesPropsType> = ({errors}) => {
    return (
        <div>
            {errors && errors.map((err) => <div key={err}>Connection with market {err} was failed</div> )}
        </div>
    )
}
