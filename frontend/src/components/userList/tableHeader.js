import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import { withStyles } from "@material-ui/core/styles";

const styles = {
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
      },
};
class TableHeader extends React.Component {
    constructor(props){
        super(props);
        
    }

    handleCreateSort = property => event => {
        this.props.onRequestSort(event, property);
    }

    render(){
        const headCells = [
            { id: 'avatar', numeric: false, disablePadding : false, label: 'Avatar'},
            { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
            { id: 'gender', numeric: false, disablePadding: false, label: 'Sex' },
            { id: 'rank', numeric : false, disablePadding: false, label: 'Rank'},
            { id: 'date', numeric : false, disablePadding : false, label: 'Start Date'},
            { id: 'phone', numeric : false, disablePadding: false, label: 'Phone'},
            { id: 'email', numeric : false, disablePadding : false, label: 'Email'},
            { id: 'superior', numeric : false, disablePadding : false, label: 'Superior'},
            { id: 'subs', numeric : false, disablePadding : false, label: '# of D.S.'},
          ];

        const { classes, order, orderBy } = this.props;
        return(
            <TableHead>
                <TableRow>
                    {headCells.map(headCell => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={order}
                                onClick={this.handleCreateSort(headCell.id)}
                            >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                    <TableCell>
                        Edit
                    </TableCell>
                    <TableCell>
                        Delete
                    </TableCell>
                </TableRow>
            </TableHead>
        )
    }
}


export default withStyles(styles)(TableHeader);