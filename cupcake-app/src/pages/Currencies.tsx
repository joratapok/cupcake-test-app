import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { subscribeToMarketThunk } from '../redux/currencyReducer'
import { AppStateType } from '../redux/store'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { ErrorMessages } from '../components/ErrorMessages'

const useStyles = makeStyles({
    table: {
        minWidth: 500,
        maxWidth: 800
    },
    container: {
        maxWidth: 800
    },
    activeCell: {
        backgroundColor: '#cfe8fc',
        transition: '1s'
    },
    passiveCell: {
        transition: '0.5s'
    }
})

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            '&:nth-of-type(odd)': {
                backgroundColor: theme.palette.action.hover
            }
        }
    })
)(TableRow)

export const Currencies: React.FC = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const currencies = useSelector((state: AppStateType) => state.currency.currencies)
    const markets = useSelector((state: AppStateType) => state.currency.markets)
    const errors = useSelector((state: AppStateType) => state.currency.errors)
    useEffect(() => {
        dispatch(subscribeToMarketThunk('first'))
        dispatch(subscribeToMarketThunk('second'))
        dispatch(subscribeToMarketThunk('third'))
    }, [])
    return (
        <Container className={classes.container}>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="currencies">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Pair name / Market</TableCell>
                            {markets.map((market) => <TableCell key={market} align="center">{market}</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {currencies.map((currency) => (
                            <StyledTableRow key={currency.id}>
                                <TableCell align="left">{currency.id}</TableCell>
                                <TableCell align="center"
                                    className={(currency.first === currency.lowest && currency.lowest !== 0) ? classes.activeCell : classes.passiveCell}
                                >{currency.first}</TableCell>
                                <TableCell align="center"
                                    className={(currency.second === currency.lowest && currency.lowest !== 0) ? classes.activeCell : classes.passiveCell}
                                >{currency.second}</TableCell>
                                <TableCell align="center"
                                    className={(currency.third === currency.lowest && currency.lowest !== 0) ? classes.activeCell : classes.passiveCell}
                                >{currency.third}</TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ErrorMessages errors={errors} />
        </Container>
    )
}
