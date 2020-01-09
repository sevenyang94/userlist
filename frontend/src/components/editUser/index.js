import React from 'react';
import { TextField, Select, Button, FormControl } from '@material-ui/core'
import  MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from "@material-ui/core/styles";
import { Container } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {isAfter, format} from 'date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import usarmylog from './usarmylog.png';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import { connect } from "react-redux";
import * as actions from './../../actions';

const styles = {
    formControl: {
        margin: 'normal',
        width: 200,
        display: "flex",
        wrap: "nowrap"
    },
    textField: {
        fullWidth: true
    },
    submitButton: {
        color: 'default',
        marginleft: 100

    },
};

class EditUser extends React.Component{
    constructor(props){
        super(props);
        console.log("current sTATE LOCATION", this.props.location.state)
        var {currUser} = this.props.location.state;
 
        this.state = {
            name: currUser.name,
            nameError: "",
            sex: currUser.gender,
            sexError: "",
            rank: currUser.rank,
            rankError : "",
            date: currUser.date,
            dateError: "" ,
            phone: currUser.phone,
            phoneError : "",
            email: currUser.email,
            emailError: "",
            fileURL : currUser.avatar,
            file : [],
            superior : currUser.superior,
            supname : currUser.supname,
            superiorError: "",
            superiorList: ["None"],
            isError: true,
            newphoto : false,
          };
    }

    componentDidMount() {
        // this.props.editUserList(this.props.match.params.id);
        const {searchText, page, orderBy, order, limit} = this.props.addUser;
        this.props.addUserList(searchText, orderBy, page, order, limit);
        this.setState({isError: this.errorCheck()});
    }

    errorCheck = () =>{
        const {name, nameError, sex, sexError, rank, rankError, date, dateError, phone, phoneError,email, emailError} = this.state;
        const check = (nameError || sexError || rankError || dateError || phoneError || emailError) || 
        !(name && rank && sex && date && phone && email);
        if (check) {
            return true
        }
        else{
            return false;
        }   
        
    };

    handlePhoto(event) {
        this.setState({
          newphoto: true,
          fileURL: URL.createObjectURL(event.target.files[0]),
          file: [event.target.files[0]]
        })
      }

    recurCheck(newUser, visited, recStack, userList){
       
        visited[newUser] = true;
        recStack[newUser] = true;
        console.log("visited", visited);
        console.log("recStack", recStack);
        console.log("currsub", userList.filter(item => { return item._id === newUser})[0].subs);
        userList.filter(item => { return item._id === newUser})[0].subs.forEach(item => {
            console.log("item", item)
            if ((visited[item]) == false ){
                if (this.recurCheck(item, visited, recStack, userList)){
                    return true;
                }
                else if (recStack[item] == true){
                    return true;
                }
            }
            else{
                return true;
            }
        recStack[newUser] = false;
        return false;
        })
    }

    circleCheck(newUser){
        console.log("chec new ",newUser);
        console.log(this.props.location.state.currUser._id);
        var userList = [...this.props.addUser.userList];
        var visited = {};
        var recStack = {};
        for (let i = 0; i < userList.length; i++){
            visited[userList[i]._id] = false;
            recStack[userList[i]._id] = false;
        }
        
        
        if(userList.filter(item => {return item._id === this.props.location.state.currUser._id})[0].superior === null && newUser!== "None"){
            userList.filter(item => {return item._id === newUser})[0].subs.push(this.props.location.state.currUser._id);
            console.log("after userlist", userList);
        }
        else if(userList.filter(item => {return item._id === this.props.location.state.currUser._id})[0].superior && newUser !== "None"){
            let subs = userList.filter(item => {return item._id === userList.filter(item => {return item._id === this.props.location.state.currUser._id})[0].superior})[0].subs;
            console.log(subs,"before")
            subs.splice(subs.indexOf(this.props.location.state.currUser._id), 1 );
            console.log(subs,"after");
            userList.filter(item => {return item._id === newUser})[0].subs.push(this.props.location.state.currUser._id);
            
        }
        else if(newUser === "None" && userList.filter(item => {return item._id === this.props.location.state.currUser._id})[0].superior){
            let subs = userList.filter(item => {return item._id === userList.filter(item => {return item._id === this.props.location.state.currUser._id})[0].superior})[0].subs;
            console.log(subs,"before")
            subs.splice(subs.indexOf(this.props.location.state.currUser._id), 1 );
            console.log(subs,"after");

        }
        

        for (let i = 0; i < userList.length; i++){
            if ((visited[userList[i]._id]) == false){
                console.log("rec")
                if (this.recurCheck(userList[i]._id, visited, recStack, userList)){
                    return true;
                }
            }
        }
        return false;
        
    }
    
    handleName = e => {
        const reg = /^[a-zA-Z\-'\s]+$/;
        this.setState({
            [e.target.name]: e.target.value
          });
        if (!e.target.value.match(reg)){
            this.setState({
                nameError : "Name has to be in alphabet list and separated by whitespace", 
                isError: true
            });
        }
        else{
            this.setState({nameError: ""}, () => { this.setState({isError: this.errorCheck()}) });  
        }
    }

    handleSex = e => {
        this.setState({
            [e.target.name]: e.target.value
          });
        
        if (e.target.value === '' ){
        this.setState({
            sexError : "Gender cannot be empty", 
            isError: true
        });
        }
        else{
            this.setState({sexError: ""}, () => { this.setState({isError: this.errorCheck()}) });  
        }
    }

    handleRank = e => {
        this.setState({
            [e.target.name]: e.target.value
          });
        
        if (e.target.value === '' ){
        this.setState({
            rankError : "Gender cannot be empty", 
            isError: true
        });
        }
        else{
            this.setState({rankError: ""}, () => { this.setState({isError: this.errorCheck()}) });  
        }
    }

    handleDateChange = e => {
        let today = new Date()
        this.setState({
            'date' : format(e, 'MM/dd/yyyy')
          });
          if (isAfter(e, today) ){
            this.setState({
                dateError : "Date cannot be later than today", 
                isError: true
            });
            }
            else{
                this.setState({dateError: ""}, () => { this.setState({isError: this.errorCheck()}) });  
            }
    }

    handlePhone = e => {
        const reg = /^\d{9}$/;
        this.setState({
            [e.target.name]: e.target.value
          });
        if (!this.state.phone.match(reg)){
            this.setState({
                phoneError : "phone should be in 10 digits", 
                isError: true
            });
        }
        else{
            this.setState({phoneError: ""}, () => { this.setState({isError: this.errorCheck()}) });  
        }
    }

    handleEmail = e =>{
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        this.setState({
            [e.target.name]: e.target.value
          });
        if (!this.state.email.match(reg)){
            this.setState({
                emailError : "please check your email format and provide a valid email address", 
                isError: true
            });
        }
        else{
            this.setState({emailError: ""}, () => { this.setState({isError: this.errorCheck()}) });  
        }
    }

    handleSuperior = e => {
        const filtered = this.props.addUser.userList.filter( item => {
            return item._id === e.target.value
        });
    
        console.log(this.circleCheck(e.target.value), "check");
        if (filtered.length !== 0 && this.circleCheck(e.target.value)){
            console.log("wrong supeiror");
            this.setState({
                superiorError : "This superior is not valid for the rules", 
                isError: true
        });
        }
        else{
            this.setState({superiorError: ""}, () => { this.setState({isError: this.errorCheck() ,[e.target.name]: e.target.value,
                supname: filtered.length === 0 ? "" : filtered[0].name}) });  
        }
    }

    handleSubmit = e => {
        //TO DO ACTIONS
        e.preventDefault();
        console.log(this.state.file[0]);
        if (!this.state.isError) {
            var newUser = {
                name: this.state.name,
                rank: this.state.rank,
                date: this.state.date,
                phone: this.state.phone,
                email: this.state.email,
                gender: this.state.sex,
                superior: this.state.superior,
                supname : this.state.supname
            }
            if (this.state.file[0]){
                var imageData = new FormData();
                console.log("Submiting photo first ");
                imageData.append("image", this.state.file[0], this.state.file[0].name);
                axios.post('http://localhost:8080/upload', imageData).then( photoRes =>{
                    console.log("url", photoRes.data.imageUrl);
                    newUser.avatar = photoRes.data.imageUrl;
                    console.log("current historuy", this.props.location.state);
                    this.props.editUserAction(this.props.match.params.id, newUser, this.props.history, this.props.location.state.view,
                        this.props.location.state.currentSelect); 
                    console.log("upload user with photo");
                });
            }
            else {
                newUser.avatar = this.state.fileURL;
                console.log("NEW user", newUser ,this.props.match.params.id);
                this.props.editUserAction(this.props.match.params.id, newUser, this.props.history, this.props.location.state.view,
                    this.props.location.state.currentSelect); 
                console.log("upload user without photo");
            }
            
          // clear form
            this.setState({
            name: "",
            nameError: "",
            sex: "",
            sexError: "",
            rank : "",
            rankError: "",
            date : "",
            dateError : "",
            phone: "",
            phoneError: "",
            email: "",
            emailError: "",
            superior: "",
            superiorError: ""
            });
        }
        
    }

    // componentWillUpdate(nextProps, nextState){
    //     const {searchText, page, orderBy, order, limit} = this.props.addUser;
    //     if(nextState.name !== this.state.name)
    //         {
    //         this.props.addUserList(searchText, orderBy, page, order, limit);
    //         console.log("fireADDLIST");    
    //         this.setState({superiorList: this.props.addUser.userList});
    //     }  
        
    // }
    
    render(){
        const { classes }  = this.props;
        return (
                <Container maxWidth="sm" jusitfy = "center">
                    <Typography variant="h5" component="h5">
                        Edit User
                    </Typography>
                    <br />
                    <br />
                    <Typography variant="h6" component="h6">
                        Upload your avatar
                    </Typography>
                    <div>
                        <input type="file" onChange={this.handlePhoto.bind(this)}/>
                        <img src={this.state.fileURL === undefined ? usarmylog : this.state.newphoto ?  this.state.fileURL: require(`../userList/${this.state.fileURL}`) } alt="Your Avatar" width="250" height="250"/>
                    </div>
                    <form>
                        <TextField
                            className= {classes.textField}
                            name= "name"
                            label= "name"
                            margin="normal"
                            value={this.state.name}
                            onChange={e => {this.handleName(e)}}
                            error={this.state.nameError !== ''}
                            helperText = {this.state.nameError}
                        />
                        <br />
                        <FormControl
                            error={this.state.rankError !== ''}
                            className = {classes.formControl}
                        >
                            <InputLabel>Rank</InputLabel>
                            <Select
                                value={this.state.rank}
                                onChange={e => {this.handleSex(e)}}
                                inputProps={{
                                    name: 'rank'
                                }}
                                autoWidth
                            >
                            <MenuItem key = {'1'} value = {'General'}>General</MenuItem>
                            <MenuItem key = {'2'} value = {'Colonel'}>Colonel</MenuItem>
                            <MenuItem key = {'3'} value = {'Major'}>Major</MenuItem>
                            <MenuItem key = {'4'} value = {'Captain'}>Captain</MenuItem>
                            <MenuItem key = {'5'} value = {'Lieutenant'}>Lieutenant</MenuItem>
                            <MenuItem key = {'6'} value = {'Warrent Office'}>Warrent Office</MenuItem>
                            <MenuItem key = {'7'} value = {'Sergeant'}>Sergeant</MenuItem>
                            <MenuItem key = {'8'} value = {'Corporal'}>Corporal</MenuItem>
                            <MenuItem key = {'9'} value = {'Specialist'}>Specialist</MenuItem>
                            <MenuItem key = {'10'} value = {'Private'}>Private</MenuItem>
                            </Select>
                            </FormControl>
                        <br /> 
                        <FormControl
                            error={this.state.sexError !== ''}
                            className = {classes.formControl}
                        >
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={this.state.sex}
                                onChange={e => {this.handleSex(e)}}
                                inputProps={{
                                    name: 'sex'
                                }}
                                autoWidth
                            >
                            <MenuItem key = {'M'} value = {'Male'}>Male</MenuItem>
                            <MenuItem key = {'F'} value = {'Female'}>Female</MenuItem>
                            </Select>
                            </FormControl>
                        <br /> 
                        <MuiPickersUtilsProvider utils = {DateFnsUtils}>
                            <KeyboardDatePicker
                                value={this.state.date}
                                label="Start Date"
                                onChange={e => {this.handleDateChange(e)}}
                                margin="normal"
                                id="date-picker-dialog"
                                format="MM/dd/yyyy"
                                error={this.state.dateError !== ''}
                                helperText={this.state.dateError}
                                KeyboardButtonProps={{
                                  'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <br />
                        <TextField
                            className= {classes.textField}
                            name= "phone"
                            label= "Office Phone"
                            margin="normal"
                            value={this.state.phone}
                            onChange={e => {this.handlePhone(e)}}
                            error={this.state.phoneError !== ''}
                            helperText = {this.state.phoneError}
                        />
                        <br />
                        <br />
                        <TextField
                            className= {classes.textField}
                            name= "email"
                            label= "Email"
                            margin="normal"
                            value={this.state.email}
                            onChange={e => {this.handleEmail(e)}}
                            error={this.state.emailError !== ''}
                            helperText = {this.state.emailError}
                        />
                        <FormControl
                            error={this.state.superiorError !== ''}
                            className = {classes.formControl}
                        >
                            <InputLabel>Superior</InputLabel>
                            <Select
                                value={this.state.superior === null? "None" : this.state.superior}
                                onChange={e => {this.handleSuperior(e)}}
                                inputProps={{
                                    name: 'superior'
                                }}
                                autoWidth
                            >
                            {/* {console.log(this.props.addUser, "add detail")} */}
                            
                            {[{_id : "None", name : "None"}, ...this.props.addUser.userList.filter( item =>
                                 { return item._id !== this.props.location.state.currUser._id})]
                                 .map((item, index) => (
                                <MenuItem key = {index} value = {item._id}>{item.name}</MenuItem>
                            ))}
                            
                            </Select>
                            </FormControl>
                        <br /> 
                        <br />
                        <br />
                        <br />
                        <br />
                        <Button
                        color="primary"
                        variant="contained"
                        onClick={e => this.handleSubmit(e)}
                        disabled = {this.state.isError}> 
                            Edit
                        </Button>
                    </form>
                </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
      addUser: state.addUser,
      editUser: state.editUser,
    }
}
  
  const mapDispatchToProps = dispatch => {
    return {
      editUserAction: (id, newUser, history, view, currentSelect) => {
        dispatch(actions.editUsers(id, newUser, history, view, currentSelect));
        },
      editUserList : (id) => {
        dispatch(actions.editUserList(id));
      },
      addUserList : (searchText, sortBy, page, dir, limit) => {
        dispatch(actions.addUserList(searchText, sortBy, page, dir, limit));
      }
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditUser));