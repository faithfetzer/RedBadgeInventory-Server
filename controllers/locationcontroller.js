const router = require("express").Router();
const {models} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateJWT = require('../middleware/validatesession');

// GET /locations/ -all locations for logged in maker

router.get('/', validateJWT, async(req, res) =>{
    try{
        const myLocations = await models.LocationModel.findAll({
            where: {userId: req.user.id}
        })
        res.status(200).json({
            myLocations
        })
    } catch(err) {
        res.status(500).json({
            message: `Error getting location information. Error ${err}`
        })
    }
})

// POST /locations/add -add location for logged in maker

router.post('/add', validateJWT, async(req, res) =>{
    const { name, url, address, notes } = req.body
    locationEntry = {
        name: name,
        url: url,
        address: address,
        notes: notes,
        userId: req.user.id
    }
    try{
        if(req.user.role == 'maker'){
            const newLocation = await models.LocationModel.create(locationEntry)
            res.status(200).json(newLocation)
        } else{
            res.status(401).json({
                message: `Not authorized`
            })
        }
    } catch (err){
        res.status(500).json({
            message: `Error adding location. Error ${err}`
        })
    }
})

// PUT /locations/update -edit locations for logged in maker

router.put('/update/:id', validateJWT, async(req, res) =>{
    const {name, url, address, notes} = req.body
    const locationToUpdate = {
        name: name,
        url: url,
        address: address,
        notes: notes,
        userId: req.user.id
    }
    try{
        if(req.user.role == 'maker'){
            const updatedLocation = await models.LocationModel.update(locationToUpdate, {where: {id: req.params.id}})
            res.status(200).json({
                message: `Location updated`,
                updated: updatedLocation
            })
        } else {
            res.status(401).json({
                message: `Not authorized`
            })
        }
    } catch(err){
        console.log(err)
        res.status(500).json({
            message: `Location not updated. Error: ${err}`
        })
    }
})

// DELETE /locations/delete -delete locations logged in maker

router.delete('/delete/:id', validateJWT, async(req, res) =>{
    const locationToDelete = await locationToDelete.findOne({
        where: { id: req.params.id}
    })
    try{
        if(req.user.role == 'maker'){
            if(locationToDelete){
                const deletedLocation = await models.LocationModel.destroy({
                    where: {
                        id: req.params.id
                    }
                    })
                res.status(200).json({
                    message: `Location has been deleted`
                    })
            } else {
                res.status(401).json({
                    message: `Location not found`
                })
            }
        } else {
            res.status(401).json({
                message: `Not authorized`
            })
        }
    } catch(err){
        console.log(err)
        res.status(500).json({
            message: `Location not deleted. Error: ${err}`
        })
    }
})


module.exports = router