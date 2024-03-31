const express = require("express")
const multer = require('multer')
const Lala = require("../models/signup_schema")
const Products = require("../models/p_schema")
const Cart = require("../models/cart")
const router = express.Router()
const bcrypt = require('bcrypt')






router.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.role = req.session.role;
    res.locals.user_id = req.session.user_id;
    next();
 
 });



 const gateway = function (req, res, next) {
    if (req.session.user) {
       next();
    } else {
       res.redirect('/signin');
    }
 };




 router.post('/addtocart',gateway,async(req, res) => {
    try {

        const { ptype,pfile, pname, psize, pquantity, pprice, pcolor } = req.body
        const cartq = new Cart({
            ptype,
             pfile,
            pname,
             psize,
              pquantity,
               pprice,
                pcolor,   
        })
        await cartq.save()
console.log(cartq);
    }        
    catch (error) {
        console.log(error);
    }
})










router.get("/dashboard-viewproduct", async (req, res) => {
    try {
        var pdata = await Products.find({});
        // console.log("got data")
        res.render("dashboard/viewproduct", { pdata: pdata })
    } catch (err) {
        console.log(err)
    }
})

// delete

router.get("/pdelete/:id", async (req, res) => {
    try {
        const pdata = await Products.findByIdAndRemove(req.params.id)
        console.log("data delete")
        res.redirect("/dashboard-viewproduct")
    } catch (err) {
        console.log(err)
    }

})


// edit

router.get("/pedit/:id", async (req, res) => {
    try {
        const pdata = await Products.findById(req.params.id)
        // console.log("got data")
        res.render("dashboard/product-edit", { pdata: pdata })
    } catch (err) {
        console.log(err)
    }
})

router.post("/pedit/:id", async (req, res) => {
    const pupdatedata = {
        pfile: req.body.pfile,
        pname: req.body.pname,
        pdiscription: req.body.pdiscription,
        pdiscount: req.body.pdiscount,
        pprice: req.body.pprice
    }
    try {
        const pdata = await Products.findByIdAndUpdate(req.params.id, pupdatedata)
        console.log("data updated")
        res.render("/dashboard-viewproduct", { pdata: pdata })
        res.redirect("../dashboard-viewproduct")
    } catch (err) {
        console.log(err)
    }
})

//################# product #########################


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../Urban-Zoro/public/product")
    },
    filename: (req, file, cb) => {
        // cb(null,file.originalname)
        cb(null, Date.now() + (file.originalname))
    }
})

const filefilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

let upload = multer({ storage, filefilter })

router.post("/dashboard-add", upload.single('pfile'), (req, res) => {

    const { ptype, pname, pdiscription, pdiscount, pprice, pcolr } = req.body
    var details = new Products({
        ptype,
        pfile: req.file.filename,
        pname,
        pdiscription,
        pdiscount,
        pprice,
        pcolr
    })
    details.save().then((result) => {
        console.log(result)
        res.redirect('/dashboard-add')
    }).catch((err) => {
        console.log(err)
    })
})



router.get('/cartonpage', gateway, async (req, res) => {
const product = await Cart.find({})
       res.send({ product: product })
 
    })
 





// #############################################################

router.get("/",gateway,(req, res) => {
    console.log(req.session);
    res.render("index",{role:req.session})

})



router.get('/product:id', async (req, res) => {
    try {
        // console.log(req.params.id,'ihaighwahgowahgowajgoawjogjawogjwaojgowajgowajgowajogjwaogj');
        const product = await Products.findOne({ _id: req.params.id });
        const sideimg = await Products.find({ ptype: product.ptype }).limit(5)


        res.render('productpage', { product: product, sideimg: sideimg })
    } catch (err) {
        console.log(err);
    }
});



// const cartstorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "../Urban-Zoro/public/product")
//     },
//     filename: (req, file, cb) => {
//         // cb(null,file.originalname)
//         cb(null, Date.now() + (file.originalname))
//     }
// })

// let cartupload = multer({ storage: cartstorage })
// , cartupload.single('pfile')












router.get("/Sneakers", gateway,async (req, res) => {
    const Sneakers = await Products.find({ ptype: 'Sneakers' })
    res.render("Sneakers", { Sneakers: Sneakers,role:req.session })
})



router.get("/T-shirts",gateway, async (req, res) => {
    const Tshirts = await Products.find({ ptype: 'T-shirt' })

    res.render("T-shirts", { Tshirts: Tshirts,role:req.session })
})


router.get("/Joggers",gateway, async (req, res) => {
    const Joggers = await Products.find({ ptype: 'Joggers' })
    res.render("Joggers", { Joggers: Joggers,role:req.session })
})


router.get("/Hoodie", gateway,async (req, res) => {
    const Hoodie = await Products.find({ ptype: 'Hoodie' })
    res.render("Hoodie", { Hoodie: Hoodie,role:req.session })
})


router.get("/Jewellery",gateway, async (req, res) => {
    const Jewellery = await Products.find({ ptype: 'Jewellery' })
    res.render("Jewellery", { Jewellery: Jewellery,role:req.session })
})



router.get("/Contact",gateway, (req, res) => {
    res.render("Contact",{role:req.session})
})


router.get("/About",gateway, (req, res) => {
    res.render("About",{role:req.session})
})

router.get("/signin", (req, res) => {
    res.render("signin")
})
router.get("/signup", (req, res) => {
    res.render("signup")
})

router.post("/signup", (req, res) => {
    const { uname, email, password, phone } = req.body
    let detail = new Lala({
        uname, email, password, phone
    })
    detail.save().then((result) => {

        res.redirect('/signin')
    })
        .catch((err) => {
            console.log(err)
        })
})






router.get("/cart", gateway,(req, res) => {
    res.render("cart",{role:req.session})
})


 
router.post("/signin",async (req, res) => {
    const { email, password } = req.body
    let data = await Lala.findOne({ email })
    if (data) {
        const ismatch = await bcrypt.compare(password, data.password)
        if (ismatch) {
            req.session.user = data.uname
            req.session.role = data.user_role
            req.session.user_id = data._id
            res.redirect('/')
        }
    }
})








//################# dashboard #########################

router.get("/dashboard",gateway, (req, res) => {
    res.render("dashboard/index",{role:req.session})
})


router.get("/dashboard-add",gateway, (req, res) => {
    res.render("dashboard/addproduct",{role:req.session})
})

router.get("/dashboard-viewproduct", gateway,(req, res) => {
    res.render("dashboard/viewproduct",{role:req.session})
})

router.get("/dashboard-admin",gateway, (req, res) => {
    res.render("dashboard/viewsignup",{role:req.session})
})

// get data in mongo and show in dashboard




router.get('/dashboard-viewsignup',gateway, async (req, res) => {
    try {
        const data = await Lala.find({});
        console.log(data);
        res.render('dashboard/viewsignup', { data: data,role:req.session })
    }
    catch (err) {
        console.log(err)
    }
});


// delete data

router.get("/delete/:id", async (req, res) => {
    try {
        const data = await Lala.findByIdAndRemove(req.params.id)
        console.log("data deleted")
        res.redirect('../dashboard-viewsignup')
    }
    catch (err) {
        console.log(err)
    }
})

// update data with help of 1 get the data then 2 post the update data
router.get("/edit/:id", async (req, res) => {
    try {
        const data = await Lala.findById(req.params.id)
        console.log(data)
        res.render("dashboard/signup-edit", { data: data })
    }
    catch (err) {
        console.log(err)
        res.render("kya kre ho bete")
    }
})


router.post("/edit/:id", async (req, res) => {

    var updatedata = {
        uname: req.body.uname,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone
    }

    try {
        const data = await Lala.findByIdAndUpdate(req.params.id, updatedata)
        console.log(data)
        res.render("/dashboard-viewsignup", { data: data })
        res.redirect("../dashboard-viewsignup")
    }
    catch (err) {
        console.log(err)
        res.render("kya kre ho bete")

    }
})









module.exports = router;