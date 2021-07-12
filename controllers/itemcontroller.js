const router = require("express").Router();
const {models} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateJWT = require('../middleware/validatesession');

// GET /items/available - all available items all makers (product feed)

router.get('/available', validateJWT, async(req,res) =>{   
    try{
        const availableItems = await models.ItemModel.findAll({
            include: {
                model: models.UserModel},
            where: {
            available : true
        }
        })
            res.status(200).json({
                availableItems
            })
    } catch (err) {
        res.status(500).json({
            message: `Error getting item information. Error ${err}`
        })
    }
})

// GET /items/mine - all items for logged in maker

router.get('/mine', validateJWT, async(req,res) =>{   
    try{
        if(req.user.role == 'maker'){
            const myItems = await models.ItemModel.findAll({
            include: {
                    model: models.LocationModel},
            where: {
                userId : req.user.id,
            }

            })
            res.status(200).json({
                myItems
            })
        } else{
            res.status(401).json({
                message: `Not authorized`
            })
        }
    } catch(err) {
        res.status(500).json({
            message: `Error getting item information. Error ${err}`
        })
    }
})

// POST /items/add - create items for logged in maker

router.post('/add', validateJWT, async(req,res) =>{ 
    const {
        name, 
        description,
        volume,
        volumeUnit,
        weight,
        weightUnit,
        height,
        width,
        depth,
        lengthUnit,
        category,
        available,
        price,
        totalQuantity,
        location,
        quantityListed,
        quantitySold
    } = req.body
    const locationListed = await models.LocationModel.findOne({
        where: {name: location, userId: req.user.id}
    })
    try{
        if(locationListed){
            locationValue = locationListed.id
        } else {
            locationValue = null
        }
        const itemEntry = {
            name: name, 
            description: description,
            volume: volume,
            volumeUnit: volumeUnit,
            weight: weight,
            weightUnit: weightUnit,
            height: height,
            width: width,
            depth: depth,
            lengthUnit: lengthUnit,
            category: category,
            available: available,
            price: price,
            totalQuantity: totalQuantity,
            quantityListed: quantityListed,
            quantitySold: quantitySold,
            userId: req.user.id,
            locationId: locationValue
    }
        if(req.user.role == 'maker'){
            const newItem = await models.ItemModel.create(itemEntry)
            res.status(200).json(newItem)
        } else{
            res.status(401).json({
                message: `Not authorized`
            })
        }
    } catch(err){
        res.status(500).json({
            message: `Error adding item. Error ${err}`
        })
    }
})

// PUT /items/update -edit items for logged in maker

router.put('/update/:id', validateJWT, async(req, res) =>{
    const {
        name, 
        description,
        volume,
        volumeUnit,
        weight,
        weightUnit,
        height,
        width,
        depth,
        lengthUnit,
        category,
        available,
        price,
        totalQuantity,
        location,
        quantityListed,
        quantitySold
    } = req.body
    const locationListed = await models.LocationModel.findOne({
        where: {name: location, userId: req.user.id}
    })
    
    try {
        if(locationListed){
            locationValue = locationListed.id
        } else {
            locationValue = null
        }
        const itemToUpdate = {
        name: name, 
        description: description,
        volume: volume,
        volumeUnit: volumeUnit,
        weight: weight,
        weightUnit: weightUnit,
        height: height,
        width: width,
        depth: depth,
        lengthUnit: lengthUnit,
        category: category,
        available: available,
        price: price,
        totalQuantity: totalQuantity,
        quantityListed: quantityListed,
        quantitySold: quantitySold,
        userId: req.user.id,
        locationId: locationValue
        }
        if(req.user.role == 'maker'){
            const updatedItem = await models.ItemModel.update(itemToUpdate, {where: {id : req.params.id}})
            res.status(200).json({
                message: `Item updated`,
                updated: updatedItem
                })
        } else{
            res.status(401).json({
                message: `Not authorized`
            })
        }
    } 
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: `Item not updated. Error: ${err}`
        })
    }
} )

// DELETE /items/delete -delete items for logged in maker

router.delete('/delete/:id', validateJWT, async(req, res) =>{
    const itemToDelete = await models.ItemModel.findOne({
        where: { id: req.params.id }
        })
    try {
        if(req.user.role == 'maker'){
            if (itemToDelete) {
                const deletedItem = await models.ItemModel.destroy({
                    where: { id: req.params.id }
                })
                res.status(200).json({ 
                    message: "Item has been deleted" });
            } else {
                res.status(401).json({
                    message: `Item not found`
                })
            }
        } else{
            res.status(401).json({
                message: `Not authorized`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: `Error deleting item ${err}`
        }) 
    }
})


module.exports = router