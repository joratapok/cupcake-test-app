import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {subscribeToMarketThunk} from "../redux/currencyReducer";
import {AppStateType} from "../redux/store";
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export const Currencies: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const currencies = useSelector((state: AppStateType) => state.currency.currencies)
    useEffect(() => {
        dispatch(subscribeToMarketThunk('first'))
        dispatch(subscribeToMarketThunk('second'))
        dispatch(subscribeToMarketThunk('third'))
    }, [])
    // @ts-ignore
    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="currencies">
                <TableHead>
                    <TableRow>
                        <TableCell align="right">Pair name / Market</TableCell>
                        {Object.keys(currencies).map((market) => <TableCell>{market}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>

                    {Object.entries(currencies.first).map(([currency, value]) => (
                        <TableRow>
                            <TableCell align="right">{currency}</TableCell>
                            <TableCell align="right">{value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
