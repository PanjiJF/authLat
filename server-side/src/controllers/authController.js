const db = require("../models")
const User = db.user
const Role = db.role

let jwt = require("jsonwebtoken")
let bcrypt = require("bcryptjs")

exports.register = (req,res) => {
    const user = new User({
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        username : req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password,8)

    })
    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err})
            return
        }

        if(req.body.role){
            Role.findOne({ name : req.body.role},
                (err, role) => {
                    if(err) {
                        res.status(500).send({ message: err})
                        return
                    }

                    user.role = role._id
                    user.save(err => {
                        if (err) {
                          res.status(500).send({ message: err });
                          return;
                        }
            
                        res.send({ message: "User was registered successfully!" });
                      });
                })
        } else {
            Role.findOne({ name : "user"}, (err,role) => {
                if (err) {
                    res.status(500).send({ message: err})
                }
                user.role = role._id
                user.save(err => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
          
                    res.send({ message: "User was registered successfully!" });
                  });
            })
        }
    })
}

exports.login = (req, res) => {
    User.findOne({
      username: req.body.username
    })
      .populate("role", "-__v")
      .exec((err, user) => {
        if (err) {   
          res.status(500).send({ message: err });
          return;
        }
  
        if (!user) {
          return res.status(404).send({ message: "Invalid Credentials" });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Credentials!"
          });
        }
  
        var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: 86400 // 24 hours
        });
  
        // var authorities = [];
  
        // for (let i = 0; i < user.roles.length; i++) {
        //   authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        // }
        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          accessToken: token
        });
      });
  };