const router = require("express").Router();
const {ItemModel, UserModel, LocationModel} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateJWT = require('../middleware/validateSession');

// GET /items/available - all available items all makers (product feed)

router.get('/available', validateJWT, async(req,res) =>{   
    try{
        const availableItems = await ItemModel.findAll({
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
            const myItems = await ItemModel.findAll({
            where: {
                maker_id : req.user.id,
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
    const locationListed = await LocationModel.findOne({
        where: {name: location}
    })
    const itemEntry = {
        maker_id: req.user.id,
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
        location: locationListed.id,
        quantityListed: quantityListed,
        quantitySold: quantitySold
    }
    try{
        if(req.user.role == 'maker'){
            const newItem = await ItemModel.create(itemEntry)
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
    const locationListed = await LocationModel.findOne({
        where: {name: location}
    })
    const itemToUpdate = {
        maker_id: req.user.id,
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
        location: locationListed.id,
        quantityListed: quantityListed,
        quantitySold: quantitySold
    }
    try {
        if(req.user.role == 'maker'){
            const updatedItem = await ItemModel.update(itemToUpdate, {where: {id : req.params.id}})
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
    const itemToDelete = await ItemModel.findOne({
        where: { id: req.params.id }
        })
    try {
        if(req.user.role == 'maker'){
            if (itemToDelete) {
                const deletedItem = await ItemModel.destroy({
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