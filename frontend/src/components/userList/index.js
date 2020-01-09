import React from 'react';
//import { AutoSizer, Column, Table } from 'react-virtualized';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import TableHeader from './tableHeader';
import { Button } from '@material-ui/core';
import { connect } from "react-redux";
import * as actions from './../../actions';
import InfiniteScroll from 'react-infinite-scroller';
import { Typography } from '@material-ui/core';
import usarmylog from './usarmylog.png';
//import InfiniteLoader from "react-window-infinite-loader";
import '../../App.css';
import { Waypoint } from "react-waypoint";
import CircularProgress from '@material-ui/core/CircularProgress';
const IMAGE_PATH = '../../../public/images';
const styles = {
    root: {
        width: '100%',
        marginTop: 3,
      },
      paper: {
        width: '100%',
        marginBottom: 2,
      },
      table: {
        minWidth: 750,
      },
      tableWrapper: {
        overflowX: 'auto',
      },   
};

class UserList extends React.Component{
    constructor(props){
        super(props);
        this.scrollBar = null;
        this.searchInput = null;
        this.setSearchInput = ele =>{
            this.searchInput = ele;
        }
        this.setScrollBar = ele => {
            this.scrollBar = ele;
        }
        this.state = {
            mount: false,  
            searchText : "",
            currentView: "List",
            currentUser: null,
        }
    }

    componentDidMount() {
        const {searchText, page, orderBy, order, limit} = this.props.userQuery;
        console.log("fireDID," ,this.props.location.state);
        if(this.props.location.state !== undefined){
            if(this.props.location.state.view == "sup"){
                this.setState({currentView: "sup"});
                this.handleSup(null, this.props.location.state.currentSelect);
            }
            else if(this.props.location.state.view == "count"){
                this.setState({currentView: "count"});
                this.handleCount(null, this.props.location.state.currentSelect);
            }
            else {
                this.props.getUsers(searchText, orderBy, page, order, limit);    
            }
        }
        else{
        this.props.getUsers(searchText, orderBy, page, order, limit);    
        } 
    }

    handleRequestSort =  (event, property) => {
        const isDesc = this.props.userQuery.orderBy === property && this.props.userQuery.order === 'desc';
        this.props.sortAction(isDesc ? 'asc' : 'desc', property, this.state.currentView, this.state.currentUser);
        
    }
 
    componentDidUpdate() {
        if (this.searchInput){
            this.searchInput.focus();
        }
    }

    handleSearch = e => {
        this.setState({searchText : e.target.value})
        this.props.editSearchGet(this.searchInput.value);
    }
    
    handleRedirectAdd = e =>{
        this.props.history.push('/users/add');
        this.setState({currentUser: null});
        this.setState({currentView: ""});
    }

    handleEditUser = (e, id) =>{
        this.props.editUserList(id, this.props.history, this.state.currentView, this.state.currentUser);
    }

    handleDeleteUser = (e, id) =>{
        console.log("delete id", id);
        this.props.deleteUser(id, this.state.currentView,  this.state.currentUser, this.props.userQuery);
    }

    handleLoadMore = () => {
        console.log("loaidng more")
        this.props.loadMoreAction(this.state.currentView, this.state.currentUser);
    }

    handleSup = (e, id) =>{
        console.log("handle sup", id)
        this.props.getSup(id);
        this.setState({currentView : "sup"})
        this.setState({currentUser : id})
    }

    handleCount = (e, id) =>{
        console.log("handlecount", id)
        this.props.getCount(id);
        this.setState({currentView : "count"})
        this.setState({currentUser : id})
    }
        
    handleReset = e =>{
        this.props.resetAction();
        this.setState({currentUser: null});
        this.setState({currentView: ""});
    }

    render(){
        const { searchText, page, order, orderBy} = this.props.userQuery;
        const { userList, docs, moreLoading} = this.props.users;
        const loader = moreLoading ? <div className="loadbar">Loading ...</div> : (docs.hasNextPage? <div className="loadbar"></div> :<div className="loadbar">That's all</div> );
        console.log("render doc",docs);
        if (this.props.users.isLoading && !this.props.users.moreLoading){
            return (
                <div className={"loading"}>  
                    <CircularProgress color="secondary" />
                </div>
            )
        }
        else{
            const { classes } = this.props;
            return (
                <div className={"root"}>
                    <div className={"title"}>
                    <img src={require(`./headlogo.jpg`)} alt="Head" width="100" height="100" />
                    </div>
                    <div className={"table"}>
                        <div className = {"btn-group"}>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={e => this.handleReset(e)}
                                disabled = {this.state.isError}> 
                                Reset
                            </Button>
                            <Button
                            color="primary"
                            variant="contained"
                            onClick={e => this.handleRedirectAdd(e)}
                            disabled = {this.state.isError}> 
                                Add User
                            </Button>
                        </div>
                        <div>
                            Search: <br></br>
                            <input value = {searchText} onChange = {this.handleSearch} ref={this.setSearchInput}></input>
                        </div>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size= 'medium'
                            aria-label="enhanced table"
                        >
                            <TableHeader
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}
                                rowCount={userList.length}
                            />
                        </Table>
                        <div ref={this.setScrollBar} style={{ overflow: 'auto', height: '160px' }} >
                            <Table style={{tableLayout: 'fixed'}}>
                                <TableBody>
                                    {userList.map((row, index) =>(
                                                <React.Fragment key= {row._id}>
                                                    <TableRow>
                                                        <TableCell>
                                                            <img src={row.avatar === undefined ? usarmylog : require(`./${row.avatar}`)} alt="Your Avatar" width="25" height="25" />
                                                        </TableCell>
                                                        <TableCell align="left">{row.name}</TableCell>
                                                        <TableCell align="left">{row.gender}</TableCell>
                                                        <TableCell align="left">{row.rank}</TableCell>
                                                        <TableCell align="left">{row.date}</TableCell>
                                                        <TableCell align="left">
                                                            <a href={`tel:${row.phone}`}>{row.phone}</a>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <a href={`mailto:${row.email}?subject=your title&body=TThe message"`}>{row.email}</a>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <a  className = {"l"}onClick= {(e) => {this.handleSup(e, row.superior)}}>{row.supname}</a>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {row.count == 0? "": <a  className = {"l"}onClick= {(e) => {this.handleCount(e, row._id)}}>{row.count}</a>}
                                                        </TableCell>
                                                        <TableCell align="right"><EditIcon onClick= {(e) => {this.handleEditUser(e, row._id)}}></EditIcon></TableCell>
                                                        <TableCell align="right"><DeleteIcon onClick= {(e) => {this.handleDeleteUser(e, row._id)}}></DeleteIcon></TableCell>
                                                    </TableRow>
                                                    {docs.hasNextPage && index === page * 3 -1 && (<Waypoint  onEnter={() => 
                                                        this.handleLoadMore()
                                                        }/>)}
                                                </React.Fragment>
                                            )
                                        )}
                                </TableBody>
                            </Table>
                        </div>
                        <br/>
                        {loader}
                    </div>
                    <br/>
                    
                </div> 
            )    
        }
    }
}

const mapStateToProps = state => {
    return {
      userQuery: state.userQuery,
      editUser: state.editUserp
    }
  }

const mapDispatchToProps = dispatch => {
    return {
      editSearchGet: (text) => {
        dispatch(actions.editSearchGet(text));
      },
      resetAction: () => {
        dispatch(actions.resetAction());
      },
      sortAction: (order,orderBy, state, user) => {
        dispatch(actions.sortAction(order,orderBy, state, user));
      },
      loadMoreAction: (state, user) => {
        dispatch(actions.loadMoreAction(state, user))
      },
      editLimit: (limit) => {
        dispatch(actions.editLimit(limit))
      },
      editUserList: (id, history,view, currentSelect) => {
        dispatch(actions.editUserList(id, history, view, currentSelect))
      }
    }
  }
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserList));