const Category = require('./../models/categories');

// Create the category from admin
const newCategory = async function(req,res){
  if (req.headers.token) {
		let checkCat = await Category.findOne({where:{name:req.query.name}})
		if (checkCat === null) {
			// Image upload
			if (req.file) {
				let filename = req.file.path
				let newCat = await Category.create({name:req.query.name,desc:req.query.desc,image_url:filename})
				if (newCat) {
					let fetchCat = await Category.findOne({name:newCat.name})
					res.status(200).send({details:fetchCat})
				}
				else{
					res.status(500).send({message:'Something went wrong'})
				}
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
// app.post('/newCategory',upload.single('image_url'),async(req,res) =>{
// 	console.log('in cat')
//
// })

// All Category List
app.get('/allCategory',async(req,res) => {
	if (req.headers.token) {
		let getAllCat = await Category.findAll({attributes:['id','name','image_url']})
		res.send({details:getAllCat})
		//res.json(getAllCat)
	}
	else{
		let getAllCat = await Category.findAll({attributes:['id','name','image_url']})
		res.send({details:getAllCat})
		//res.json(getAllCat)
		// res.send('Provide token')
	}
})

module.exports = {
  adminSignup,
  adminLogin
}
