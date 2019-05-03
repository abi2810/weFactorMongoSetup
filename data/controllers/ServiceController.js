const Service = require('./../models/services');
const ServiceType = require('./../models/service_type');

// Create Services link to category from admin
const newService = async function(req,res){
  if (req.headers.token) {
    let filename;
    let newServ;
		if (req.query.categoryId) {
			let checkService = await Service.findOne({name:req.query.name})
			if (checkService === null) {
        if (req.file) {
          filename = req.file.path
          newServ = await Service.create({category_id:req.query.categoryId,name:req.query.name,desc:req.query.desc,image_url:filename})
        }else{
          filename = "public/images/7fafb23b6b109077534e0da91315713f"
          newServ = await Service.create({category_id:req.query.categoryId,name:req.query.name,desc:req.query.desc,image_url:filename})
        }
				if (newServ) {
					let fetchServ = await Service.findOne({name:newServ.name})
					res.status(200).send({details:fetchServ})
				}else{
					res.status(500).send({message:"Something went wrong"})
				}
			}
      else{
        res.send({message:"Already Available"})
      }
		}
		else{
			res.send({message:"Please select an category to add service"})
		}
	}
	else{
		res.send('Provide token')
	}
}

// Create Service Type link to services from admin
const newServiceType = async function(req,res){
  if (req.headers.token) {
		if (req.query.serviceId) {
			let newServType = await ServiceType.create({service_id:req.query.serviceId,name:req.query.name,price:req.query.price})
			if (newServType) {
				let fetchServType = await ServiceType.findOne({name:newServType.name})
				res.status(200).send({details:fetchServType})
			}
			else{
				res.status(500).send({message:"Something went wrong"})
			}
		}
	}
	else{
		res.send('Provide token')
	}
}

// Get One Service List and its types
const oneService = async function(req,res){
  let getServ;
  let getServType;
  if (req.headers.token) {
    console.log('in token')
		if (req.query.serviceId) {
			getServ = await Service.findOne({_id:req.query.serviceId})
			if (getServ) {
				getServType = await ServiceType.find({service_id:req.query.serviceId})
				let hashServ = {}
				hashServ['service'] = getServ
				hashServ['service_type'] = getServType
				res.send(hashServ)
			}
		}else{
			res.send({message:"Please provide service id"})
		}
	}
	else{
    console.log('in not token')
		if (req.query.serviceId) {
      console.log('in if')
			getServ = await Service.findOne({_id:req.query.serviceId})
      console.log(getServ)
			if (getServ) {
				getServType = await ServiceType.find({service_id:req.query.serviceId})
				let hashServ = {}
				hashServ['service'] = getServ
				hashServ['service_type'] = getServType
				res.send(hashServ)
			}
		}else{
			res.send({message:"Please provide service id"})
		}
	}
}

// app.get('/oneService/:serviceId',async(req,res) => {
//
// })


module.exports = {
  newService,
  newServiceType,
  oneService
}
