'use strict';
const express = require('express');        
const router = express.Router();  

const userModel = require('../model/user');
const mongoose = require('mongoose');

router.get('/sups/:supID', (req, res) => {
    console.log("GETSUP");
    userModel.aggregate([
        {$addFields:{
            count : { 
                "$size": { "$ifNull": [ "$subs", [] ] }
        }}},
        {"$match":
            {
                _id : mongoose.Types.ObjectId(req.params.supID),
            }
        }
    ], (err, result) => {
        if (err){
            res.status(501).send(err);
        }
        res.send(result);
    }) 
})

router.get('/count/:supID', (req, res) => {
    console.log("GETCOUNT");
    userModel.aggregate([
        {$addFields:{
            count : { 
                "$size": { "$ifNull": [ "$subs", [] ] }
        }}},
        {"$match":
            {
                superior : mongoose.Types.ObjectId(req.params.supID),
            }
        }
    ], (err, result) => {
        if (err){
            res.status(501).send(err);
        }
        res.send(result);
    })   
})


router.get('/users',(req, res) => {
    console.log("getuser")
    let searchText = req.query.search;
    let sortBy = req.query.sortBy;
    var currentPage = parseInt(req.query.page);
    let dir = req.query.dir;
    let limit = parseInt(req.query.limit);
    let sortObj = {};
    let countQuery = req.query.count === undefined ? "" : mongoose.Types.ObjectId(req.query.count);
    let supQuery = req.query.sup === undefined ? "" : mongoose.Types.ObjectId(req.query.sup);
    sortObj[sortBy] = dir;
    if (countQuery){
        var preProcess = userModel.aggregate([
            {$addFields:{
                count : { 
                    "$size": { "$ifNull": [ "$subs", [] ] }
            }}},
            {"$match":
                {$and :[
                    {superior : countQuery},
                    {$or : 
                        [
                            {phone: {$regex :`${searchText}`}},
                            {email: {$regex :`${searchText}`}},
                            {supname: {$regex :`${searchText}`}},
                            {count: {$regex :`${searchText}`}},
                            {gender: {$regex :`${searchText}`}},
                            {rank : {$regex :`${searchText}`}},
                            {date : {$regex :`${searchText}`}},
                            {name : {$regex :`${searchText}`}},
                        ]
                    }
                ]}
            }     
        ])

    }
    else if (supQuery){
        var preProcess = userModel.aggregate([
            {$addFields:{
                count : { 
                    "$size": { "$ifNull": [ "$subs", [] ] }
            }}},
            {"$match":
                {$and :[
                    {_id : supQuery},
                    {$or : 
                        [
                            {phone: {$regex :`${searchText}`}},
                            {email: {$regex :`${searchText}`}},
                            {supname: {$regex :`${searchText}`}},
                            {count: {$regex :`${searchText}`}},
                            {gender: {$regex :`${searchText}`}},
                            {rank : {$regex :`${searchText}`}},
                            {date : {$regex :`${searchText}`}},
                            {name : {$regex :`${searchText}`}},
                        ]
                    }
                ]}
            }     
        ])
    }
    else{
        var preProcess = userModel.aggregate([
            {$addFields:{
                count : { 
                    "$size": { "$ifNull": [ "$subs", [] ] }
            }}},
            {"$match":
                {$or : 
                    [
                        {phone: {$regex :`${searchText}`}},
                        {email: {$regex :`${searchText}`}},
                        {supname: {$regex :`${searchText}`}},
                        {count: {$regex :`${searchText}`}},
                        {gender: {$regex :`${searchText}`}},
                        {rank : {$regex :`${searchText}`}},
                        {date : {$regex :`${searchText}`}},
                        {name : {$regex :`${searchText}`}},
                    ]
                }
            }     
        ])
    }
    
    userModel.aggregatePaginate(preProcess, {page: currentPage, limit: limit, sort : sortObj}, (err, result) => {
        if (err){
            res.status(501).send(err);
        }
        res.send(result);
    })
    ;
});

router.get('/users/:user_id', (req, res) => {
    userModel.findById(mongoose.Types.ObjectId(req.params.user_id), (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
});
//post steps
//check superior 是否为空，
//是直接加，否则， 先Insert这个人进User,然后拿到Id, increase 这个人sup 的DS数，和加入这个人到sup tables
router.post('/users', (req, res) => {
    console.log("create User");
    //save photo
    var user = new userModel({
        name: req.body.name,
        gender: req.body.gender,
        rank : req.body.rank,
        date: req.body.date,
        phone: req.body.phone,
        email: req.body.email,
        avatar: req.body.avatar,
        superior: null,
        subs: [],
        supname: ""
    });   
    if (req.body.superior !== "None"){
        user.superior = mongoose.Types.ObjectId(req.body.superior);
        user.supname = req.body.supname;
        
        user.save( userErr => {
            if(userErr) {
                res.status(501).send(userErr);
            }
            console.log(user.superior);
            userModel.findById(user.superior, (err, findUser) => {
                console.log("finduser", findUser);
                if (err) {
                    res.status(501).send(err);
                }
                if (!findUser.subs.includes(user.id)) {
                    findUser.subs.push(user.id);
                }
                findUser.save(updateErr =>  {
                    if (updateErr) {
                        res.status(501).send(updateErr);
                    }
                    res.status(200).json({ message: 'User Add!' });
                });
            }); 
        })
    }
    else{
        user.save( userErr => {
            if (userErr) {
                res.status(501).send(userErr);
            };
            res.status(200).json({ message: 'user created!' });
        });
    }
});

router.put('/users/:user_id', (req, res) => {
    console.log(" edit");
    var oldUser = {}
    userModel.findById(mongoose.Types.ObjectId(req.params.user_id), (err, user) => {
        console.log("oldUser", user)
        var nameFlag = false;
        var superiorFlag = false;
        oldUser.superior = user.superior;
        if (err) {
            res.status(501).send(err);
        }
        if (req.body.avatar){
            user.avatar = req.body.avatar;
        }
        if (req.body.name && (req.body.name !== user.name)){
            nameFlag = true;
            user.name = req.body.name;
        }
        if (req.body.gender){
            user.gender = req.body.gender;
        }
        if (req.body.rank){
            user.rank = req.body.rank;
        }

        if (req.body.date){
            user.date = req.body.date;
        }

        if (req.body.phone){
            user.phone = req.body.phone;
        }

        if (req.body.email){
            user.email = req.body.email;
        }

        if (req.body.superior){
            
            if (req.body.superior === "None"){
                user.superior = null;
                superiorFlag = true;
            }
            else if (user.superior !== mongoose.Types.ObjectId(req.body.superior)){
                user.superior = req.body.superior;
                superiorFlag = true;
            }
            
        }

        if (req.body.supname && (req.body.supname !== user.supname)){
            superiorFlag = true;
            user.supname = req.body.supname;
        }
        else if(req.body.supname === ""){
            user.supname = "";
        }


        user.save(err =>  {
            if (err) {
                res.status(501).send(err);
            }
            
            if(nameFlag){
                userModel.updateMany({"superior" : mongoose.Types.ObjectId(req.params.user_id) }, {"$set" : {"supname" : req.body.name}}, (err, ack) => {
                    if (err){
                        res.status(501).send(err);
                    }
                })
            }

            if(superiorFlag){
                console.log("superior Flag")
                if(oldUser.superior == null && req.body.superior !== "None"){
                    userModel.findById(req.body.superior, (err, findUser) => {
                        console.log("editUser1");
                        if (err) {
                            res.status(501).send(err);
                        }
                        if (!findUser.subs.includes(user.id)) {
                            findUser.subs.push(user.id);
                        }
                        findUser.save(updateErr =>  {
                            if (updateErr) {
                                res.status(501).send(updateErr);
                            }
                        });
                    }); 
                }
            else if(oldUser.superior !== null && req.body.superior === "None") {
                userModel.findById(oldUser.superior, (err, findUser) => {
                    console.log("editUser2");
                    if (err) {
                        res.status(501).send(err);
                    }
                    findUser.subs.splice(findUser.subs.indexOf(user.id), 1);
                    
                    findUser.save(updateErr =>  {
                        if (updateErr) {
                            res.status(501).send(updateErr);
                        }
                    });
                }); 
            }

            else if(oldUser.superior !== null && req.body.superior !== "None"){
                userModel.findById(oldUser.superior, (err, findUser) => {
                    console.log("editUser3");
                    if (err) {
                        res.status(501).send(err);
                    }
                    findUser.subs.splice(findUser.subs.indexOf(user.id), 1);
                    
                    findUser.save(updateErr =>  {
                        if (updateErr) {
                            res.status(501).send(updateErr);
                        }
                    });
                });
                userModel.findById(req.body.superior, (err, findUser) => {
                    console.log("editUser4");
                    if (err) {
                        res.status(501).send(err);
                    }
                    if (!findUser.subs.includes(user.id)) {
                        findUser.subs.push(user.id);
                    }
                    findUser.save(updateErr =>  {
                        if (updateErr) {
                            res.status(501).send(updateErr);
                        }
                    });
                }); 
            }
            }
            res.status(200).json({ message: 'User updated!' });
        });

    });
});

router.delete('/users/:user_id', (req, res) => {
    var oldUser = {}
    var subFlag = false;
    var superiorFlag = false;
    userModel.findById(mongoose.Types.ObjectId(req.params.user_id), (err, user) => {
        if (err) {
            res.status(501).send(err);
        }
        if(user.superior !== null){
            oldUser.superior = user.superior;
            superiorFlag = true;
        }
        if(user.subs.length !== 0){
            oldUser.subs = user.subs;
            subFlag = true;
        }
        
    })

    userModel.deleteOne({
        _id: req.params.user_id
    }, (err, user) => {
        if (err) {
            res.status(501).send(err);
        }

        if(subFlag){
            console.log("sub delete")
            userModel.updateMany({"_id":{$in : oldUser.subs} }, {"$set" : {"superior" : null, "supname" : ""}}, (err, ack) => {
                if (err){
                    res.status(501).send(err);
                }
            })
        }

        if(superiorFlag){
            console.log("superior delete")
            userModel.updateMany({"_id": oldUser.superior}, {"$pull" : {"subs": req.params.user_id }}, (err, ack) => {
                if (err){
                    res.status(501).send(err);
                }
            })
        }
        res.status(200).json({ message: 'Successfully deleted' });
    });
});

module.exports = router;
