import React from 'react'
import { MarketType } from '../redux/currencyReducer'
import Box from '@material-ui/core/Box'

type ErrorMessagesPropsType = {
  errors: Array<MarketType>
}

export const ErrorMessages: React.FC<ErrorMessagesPropsType> = ({ errors }) => {
    return (
        <Box mt={1} mx={2}>
            {errors && errors.map((err) => <div key={err}>Connection with {err} market was failed. Trying to reconnect</div>)}
        </Box>
    )
}
