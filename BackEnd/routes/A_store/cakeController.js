const express = require('express');
const router = express.Router();
const cake = require('../../models/A_store/cake');
const user = require('../C_permission/userController')
const promotion = require('../../models/F_event/promotion');
const { ConsoleMessage } = require('puppeteer');

//cake
//get all
router.get('/', function(req, res) {
    console.log('get request for all cakes');
    cake.find({})
        .exec(function(err, cakes) {
            if (err) {
                console.log("err req cakes");
            } else {
                cakes = cakes.filter(cake => cake.inStock == true)
                res.json(cakes);
            }
        });
});
router.get('/admin', function(req, res) {
    console.log('get request for all cakes');
    cake.find({})
        .exec(function(err, cakes) {
            if (err) {
                console.log("err req cakes");
            } else {              
                res.json(cakes);
            }
        });
});
// get a person
router.get('/:cakeID', function(req, res) {
    cake.findById(req.params.cakeID)
        .exec(function(err, cakes) {
            if (err) console.log("Error retrieving cake");
            else res.json(cakes);
        });
})


//post
router.post('/',  function(req, res) {
    if (req.body.sale == null || req.body.sale == "") req.body.sale = 0
    var newcake = new cake();
    newcake.nameCake = req.body.nameCake;
    newcake.categoryID = req.body.categoryID;
    newcake.priceCake = req.body.priceCake;
    newcake.detailCake = req.body.detailCake;
    newcake.imgCake = req.body.imgCake;
    newcake.sale = req.body.sale;
    newcake.quantity = 100;
    newcake.rate = 0;
    newcake.spdacbiet = false;
    newcake.inStock = false
    newcake.save(function(err, insertedcake) {
        if (err) {
            console.log('Err Saving cake');
        } else {
            res.json(insertedcake);
        }
    });
});


//update
// router.put('/:id',  function(req, res) {
//         if (req.body.sale == null || req.body.sale == "") req.body.sale = 0
//         cake.findByIdAndUpdate(req.params.id, {

//                 $set: {
//                     nameCake: req.body.nameCake,
//                     categoryID: req.body.categoryID,
//                     priceCake: req.body.priceCake,
//                     detailCake: req.body.detailCake,
//                     imgCake: req.body.imgCake,
//                     sale: req.body.sale,
//                     quantity: req.body.quantity,
//                     spdacbiet: req.body.spdacbiet,
//                     inStock : req.body.inStock
//                 }
//             }, {
//                 new: true
//             },
//             function(err, updatedcake) {
//                 if (err) {
//                     res.send("err Update");
//                 } else {
//                     res.json(updatedcake);
//                 }
//             })
//     })
router.put('/:id',  function(req, res) {
        if (req.body.sale == null || req.body.sale == "") req.body.sale = 0
        cake.findByIdAndUpdate(req.params.id, {

                $set: {
                    nameCake: req.body.nameCake,
                    categoryID: req.body.categoryID,
                    priceCake: req.body.priceCake,
                    detailCake: req.body.detailCake,
                    imgCake: req.body.imgCake,
                    sale: req.body.sale,
                    quantity: req.body.quantity,
                    spdacbiet: req.body.spdacbiet,
                    inStock : req.body.inStock
                }
            }, {
                new: true
            },
            function(err, updatedcake) {
                if (err) {
                    res.send("err Update");
                } else {
                    res.json(updatedcake);
                }
            })
    })
//udpate instock
router.put('/instock/:id',  function(req, res) {  
    cake.findByIdAndUpdate(req.params.id, {

                        $set: {                           
                            inStock : req.body.inStock
                        }
                    }, {
                        new: true
                    },
                    function(err, updatedcake) {
                        if (err) {
                            res.send("err Update");
                        } else {
                            res.json(updatedcake);
                        }
                    })
})
async function UpdateInStock(id,check)
 {
    const Update = await cake.findByIdAndUpdate(id, {
        $set: {
            inStock: check,
        }
    }, {
        new: true
    })
    return Update
 }
   //delete
router.delete('/:id',  function(req, res) {
    cake.findByIdAndRemove(req.params.id, function(err, deletecake) {
        if (err) {
            res.send('err Delete');
        } else {
            res.json({ message: 'Successfully deleted' });
        }
    });
});
//get cake by category
router.get('/findbycategory/:category_id', function(req, res) {
        cake.find({
                categoryID: req.params.category_id
            })
            .exec(function(err, cakes) {
                if (err) console.log("Error retrieving cakes");
                else { 
                    cakes = cakes.filter(cake => cake.inStock == true)
                    res.json(cakes); }
            });
    })

//get cake by category and is spdacbiet
router.get('/findbycategoryspecial/:category_id', function(req, res) {
        cake.find({
                categoryID: req.params.category_id               
            })
            .exec(function(err, cakes) {
                if (err) console.log("Error retrieving cakes");
                else { 
                    cakes = cakes.filter(cake => (cake.spdacbiet == true && cake.inStock == true));
                    res.json(cakes); }
            });
    })

    //get cake by price
router.post('/price', function(req, res) {
    cake.find({
            priceCake: { $gte: req.body.price1, $lte: req.body.price2 }
        })
        .exec(function(err, cakes) {
            if (err) console.log("Error retrieving cakes");
            else {
                cakes = cakes.filter(cake => cake.inStock == true)
                 res.json(cakes); 
                }
        });
})
router.post('/filter', function(req, res) {

    cake.find({})
        .exec(function(err, cakes) {
            // let cakesList = []
            // cakesList.push(cakes)
            // console.log
            if (err) {
                console.log("err req cakes");
            } else {
                if (req.body.category_id != null) {
                    cakes = cakes.filter(cake => (cake.categoryID == req.body.category_id &&  cake.inStock == true));

                }
                if (req.body.price1 != null && req.body.price2 != null) {
                    cakes = cakes.filter(cake => (cake.priceCake >= req.body.price1 && cake.priceCake <= req.body.price2));
                }
                if (req.body.nameCake != null) {
                    cakes = cakes.filter(cake => (removeAccents(cake.nameCake).toLowerCase().indexOf(removeAccents(req.body.nameCake).toLowerCase()) != -1 && cake.inStock == true));
                    console.log(cakes)
                }
                if (req.body.sortByPrice == "sortAscending") {
                    cakes.sort(function(a, b) {
                        return (a.priceCake) - (b.priceCake);
                    });
                    // cakes = cakes.filter((element, index) => {
                    //     return index === 0 || element.priceCake !== cakes[index - 1].priceCake;
                    // });
                    // console.log(cakes)
                }
                if (req.body.sortByPrice == "sortDescending") {
                    cakes.sort(function(a, b) {
                        return (b.priceCake) - (a.priceCake);
                    });
                    // cakes = cakes.filter((element, index) => {
                    //     return index === 0 || element.priceCake !== cakes[index - 1].priceCake;
                    // });
                    console.log(cakes)
                }
                res.json(cakes);
            }
        });
});

function removeAccents(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/??/g, 'd').replace(/??/g, 'D');
  }

// X??? l?? thanh to??n
async function UpdateQuantityByCakeID(acake, cakeQuantityUpdate, res) {

    const Updatecake = await cake.findByIdAndUpdate(acake._id, {
        $set: {
            quantity: acake.quantity + cakeQuantityUpdate,
        }
    }, {
        new: true
    })

    return Updatecake
}
async function getCakeByID(req, res) {
    const acake = await cake.findById(req)

    return acake
}

router.post('/UpdateQuantity', function(req, res) {
    async function run() {
        const acake = await getCakeByID(req.body._id, res)
        const update = await UpdateQuantityByCakeID(acake, req.body.quantity, res)
        console.log(update)
        res.json(update)
    }
    run()
})


//check Gi??? h??ng thanh to??n b???t ?????ng b???
router.post('/CheckBillBeforePay', function(req, res) {
    async function run() {
        let temp = -1;
        for (let index in req.body) {
            const acake = await getCakeByID(req.body[index]._id, res)
                //ki???m s??? l?????ng oke th?? tr???
            if (acake.quantity >= req.body[index].count) {

                const update = await UpdateQuantityByCakeID(acake, -req.body[index].count, res)
            } else {
                temp = index
                break
            }
        }
        if (temp == -1) {
            res.json(true)
        } else { //roll back d??? li???u
            for (let index in req.body) {
                if (temp == index) {
                    break
                }
                const acake = await getCakeByID(req.body[index]._id, res)
                const update = await UpdateQuantityByCakeID(acake, req.body[index].count, res)
            }
            res.json(false)
        }
    }
    run()
})

router.get('/getCakeSale/get', function(req, res) {
    console.log('get request for all cakes');
    cake.find({})
        .exec(function(err, cakes) {
            if (err) {
                console.log("err req cakes");
            } else {
                cakes = cakes.filter(cake => (cake.sale > 0));
                
                res.json(cakes);
            }
        });
});




//#region //Update by cakeID and sale
//update

router.get('/UpdateByCakeIDAndSale/Update', function(req, res) {
    async function run() {
        //get all promotion ph?? h???p v???i ng??y hi???n t???i
        const listUpdate = []

        const listPromotion = await getAllPromotionExistToDay()
        //x??a sale
        for (let promotion of listPromotion[1]) {
                if(promotion.StatusUpdateCakeSale=="used"){
                for(let id of promotion.listCakeIn){
                    const update = await UpdateByCakeIDAndSaleNOTTRUE(id, promotion, res)
                    // thay ?????i tr???ng th??i c???a promotion
                }
                const UpdatePromotion= await UpdatePromotionOut(promotion._id,"NotUse",res)
            }
        }
        //t???o sale
            for (let promotion of listPromotion[0]) {
                    if(promotion.StatusUpdateCakeSale=="NotUse"){
                    for(let id of promotion.listCakeIn){
                        const update = await UpdateByCakeIDAndSale(id, promotion, res)
                        // thay ?????i tr???ng th??i c???a promotion
                    }
        
                    const UpdatePromotion= await UpdatePromotionOut(promotion._id,"used",res)
                }
            }
        res.json(listPromotion)
    }
    run()

})
async function UpdateByCakeIDAndSale(id, req, res) {
    const Updatecake = await cake.findByIdAndUpdate(id, {
        $set: {
            sale: req.discount,
        }
    }, {
        new: true
    })
    return Updatecake
}
async function UpdateByCakeIDAndSaleNOTTRUE(id, req, res) {
    const Updatecake = await cake.findByIdAndUpdate(id, {
        $set: {
            sale: 0,
        }
    }, {
        new: true
    })
    return Updatecake
}
async function UpdatePromotionOut(id,status,res){
    const update = await promotion.findByIdAndUpdate(id, {
        $set: {
            StatusUpdateCakeSale: status,
        }
    }, {
        new: true
    })
    return update
}

//get all promotion check by date now
async function getAllPromotionExistToDay() {
    try {
        //get time now
        var Listmonth = { "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12" }
        var now = new Date();
        var nowSplit = now.toString().split(" ") //hi???n t???i  
        var nowDate=""
        nowDate = nowSplit[3] + "-" + Listmonth[nowSplit[1]] + "-" + nowSplit[2] + " " + nowSplit[4].split(":")[0] + ":" + nowSplit[4].split(":")[1] //year,month,day: //year,month,day
        const AllPromotion = await getAllPromotion()
 
        const ListPromotionTrue = []
        const ListPromotionFalse = []
        for (let APromotion of AllPromotion) {
   
              if(APromotion.listCakeIn[0]=="")continue
       
            var IsExist = await CheckExistTime(APromotion["startDate"],APromotion["endDate"],nowDate)
            if(IsExist) ListPromotionTrue.push(APromotion)
            else ListPromotionFalse.push(APromotion)
        }
        return [ListPromotionTrue,ListPromotionFalse]
        }
        catch (error) {
            console.log(error)
        }
    }
    async function getAllPromotion() {
        const ArrayPromotion = await promotion.find({})
        return ArrayPromotion
    }
    async function CheckExistTime(Start, End, nowCheckDate) {
        if(Date.parse(Start) <= Date.parse(nowCheckDate))
        {
            if(Date.parse(End) >= Date.parse(nowCheckDate))
            {
            }
        }
        return false
    }

    //#endregion



    //#region //ki???m tra s??ch t???n t???i trong list  --->tr??? v??? 2 ph???n ????ng v?? sai

    router.post('/CheckExistListCakeID', function(req, res) {
        async function run() {
            const trueData = []
            const falseData = []
            const array = []
                //l???c tr??ng nhau

            for (let index of req.body) {
                const check = await CheckCakeID(index, res)
                array.push(check)
                if (check == null) {
                    falseData.push(index)
                } else {
                    trueData.push(index)
                }
            }
            console.log({ trueData, falseData, array })
            res.json({ trueData, falseData, array })
        }
        run()
    })
    async function CheckCakeID(req, res) {
        try {
            const acake = await cake.findById(req)

            return acake
        } catch (error) {
            return null
        }
    }
    //#endregion
    module.exports = router;