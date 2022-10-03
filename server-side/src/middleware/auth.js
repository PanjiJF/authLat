const jwt = require("jsonwebtoken");
const db = require("../models")
const User = db.user
const Role = db.role

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  console.log(token)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req,res,next) => {
    console.log(req.userId)
    User.findById(req.userId).exec((err,user) => {
        if(err) {
            res.status(500).send({ message : err})
            return
        }

        Role.findOne({
            _id: user.role
        },
        (err, role) =>{
            if(err) {
                res.status(500).send({ message : err})
                return
            }
            if(role.name ==="admin") {
                next()
                return
            }
            res.status(403).send({ message: "Unauthorized!"})
            return
        })
    })
}

const isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
  
      Role.find(
        {
          _id: user.role
        },
        (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
  
          if(role.name == "moderator"){
            next()
            return
          }
  
          res.status(403).send({ message: "Require Moderator Role!" });
          return;
        }
      );
    });
 };
  

module.exports = {
    verifyToken,
    isAdmin,
    isModerator
  }