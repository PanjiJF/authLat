const db = require("../models")
const ROLES = db.ROLES
const User = db.user

const checkDuplicate = (req, res, next) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user)=> {
        if(err) {
            res.status(500).send({message: err})
            return
        }

        if(user){
            res.status(400).send({message : "Username is already in use!"})
            return
        }

        User.findOne({
            email: req.body.email
        }).exec((err,user) => {
            if(err) {
                res.status(500).send({message: err})
                return
            }

            if(user) {
                res.status(400).send({ message : "Email is already in use!"})
                return
            }
            next()
        })
    })
}
const checkRoles = (req, res, next) => {
    if(req.body.role){
        if(!ROLES.includes(req.body.role)){
            res.status(400).send({
                message: `Role ${req.body.role} doesn't exist!`
            })
            return
        }
    }
    next()
}

module.exports = {
    checkDuplicate,
    checkRoles
}