var jwt = require('jsonwebtoken');
var secret = 'supersecret';

const RegistartionPackage = require('./../models/registartion_package');
const Admin = require('./../models/admin');


const addRegPackage = async function(req,res){
    if (req.headers.token) {
      await jwt.verify(req.headers.token,secret,function(err,decoded){
        console.log(decoded)
        adminId = decoded.id
      })
      let checkAdmin = Admin.findOne({_id:adminId})
      if (!checkAdmin){res.status(401).send({message:"You are not allowed to do this job!"})}
      else{
        let newRegPack = await RegistartionPackage.create({name:req.query.name,price:req.query.price,desc:req.query.desc})
        res.status(200).send({details:newRegPack})
      }
    }
}

const getRegPackage = async function(req,res){
  let regPack = await RegistartionPackage.find({})
  res.status(200).send({details:regPack})
}

module.exports = {
  addRegPackage,
  getRegPackage
}
