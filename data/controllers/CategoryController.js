const Category = require('./../models/categories');

// Create the category from admin
const newCategory = async function(req,res){
  if (req.headers.token) {
    let newCat;
    let filename;
		let checkCat = await Category.findOne({where:{name:req.query.name}})
		if (checkCat === null) {
			// Image upload
			if (req.file) {
				filename = req.file.path
				newCat = await Category.create({name:req.query.name,desc:req.query.desc,image_url:filename})
			}
      else{
        filename = "public/images/7fafb23b6b109077534e0da91315713f"
        newCat = await Category.create({name:req.query.name,desc:req.query.desc,image_url:filename})
      }
      if (newCat) {
        let fetchCat = await Category.findOne({name:newCat.name})
        res.status(200).send({details:fetchCat})
      }
      else{
        res.status(500).send({message:'Something went wrong'})
      }
		}
		else{
			res.status(200).send({message:'Already Available'})
		}
	}
	else{
		res.send('Provide token')
	}
}

// Create the category from admin
const editCategory = async function(req,res){
  if (req.headers.token) {
    let updateCat;
    let filename;
		let checkCat = await Category.findOne({_id:req.query.id})
		if (checkCat != null) {
      console.log(req)
			// Image upload
			if (req.file) {
				filename = req.file.path
        // update({_id: req.query.customerId},{$set:{image_url:filename}})
        console.log('in file')
				updateCat = await Category.update({_id:req.query.id},{$set:{desc:req.query.desc,image_url:filename}})
			}
      else{
        console.log('in not file')
        filename = checkCat.image_url
        updateCat = await Category.update({_id:req.query.id},{$set:{desc:req.query.desc,image_url:filename}})
      }
      if (updateCat) {
        let fetchCat = await Category.findOne({_id:req.query.id})
        res.status(200).send({details:fetchCat})
      }
      else{
        res.status(500).send({message:'Something went wrong'})
      }
		}
		else{
			res.status(401).send({message:'Cannot find the category'})
		}
	}
	else{
		res.send('Provide token')
	}
}

// All Category List
const allCategory = async function(req,res){
  let getAllCat;
  if (req.headers.token) {
    getAllCat = await Category.find({},{name:1,image_url:1})
    res.send({details:getAllCat})
  }
  else{
    getAllCat = await Category.find({},{name:1,image_url:1})
    res.send({details:getAllCat})
  }
}

// Get One Category details and service list
const oneCategoryService = async function(req,res){
  if (req.headers.token) {
		if (req.query.categoryId) {
			let getCat = await Category.findOne({_id: req.query.categoryId},{name:1,image_url:1,desc:1})
			if (getCat) {
				let getAllServ = await Service.find({category_id: req.query.categoryId},{name:1,image_url:1})
				// Professional details
				let profCat = await ProfessionCategory.find({category_id: req.query.categoryId})
        let professionId = await profCat.map(x => x.profession_id)
        console.log(professionId)
        let profDet = await Profession.find({_id:professionId,is_active:1,is_verify:1},{name:1,phoneno:1,city:1})
        console.log(profDet)
				let hashCat = {}
				hashCat['category'] = getCat
				hashCat['service'] = getAllServ
				hashCat['professionals'] = profDet
				res.send(hashCat)
			}
		}else{
			res.send({message:"Please provide category Id"})
		}
	}else{
		if (req.query.categoryId) {
			let getCat = await Category.findOne({_id: req.query.categoryId},{name:1,image_url:1,desc:1})
			if (getCat) {
				// Service Details
				let getAllServ = await Service.find({category_id: req.query.categoryId},{name:1,image_url:1})
				// Professional details
				let profDet = await Profession.find({category_id: req.query.categoryId})
				let hashCat = {}
				hashCat['category'] = getCat
				hashCat['service'] = getAllServ
				hashCat['professionals'] = profDet
				res.send(hashCat)
			}
		}else{
			res.send({message:"Please provide category Id"})
		}
	}
}

// Single Category List with details and its services
// app.get('/oneCategoryService',async(req,res) => {
// 	// console.log("I'm in one category service",req.params.categoryId)
//
// })


module.exports = {
  newCategory,
  allCategory,
  editCategory,
  oneCategoryService
}
