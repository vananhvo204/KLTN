const express = require('express');
const router = express.Router();
const order = require('../../models/E_payment/order');
const orderDetail = require('../../models/E_payment/orderDetail');
const cake = require('../../models/A_store/cake');
const customer = require('../../models/B_profile/customer')
const userAccount = require('../../models/C_permission/user');
const accountsocials = require('../../models/C_permission/accountsocials');
    //thống kê Danh sách sách mua nhiều
async function getAllOrder(req, res) {
    try {
        const orderArray = await order.find({});
        return orderArray;
    } catch (err) {
        return res.status(501).json(err);
    }
}
async function getOrderDetailByOrderID(req, res) {
    try {
        const orderDetailArray = await orderDetail.find({
            orderID: req
        });
        return orderDetailArray;
    } catch (err) {
        return res.status(501).json(err);
    }
}

async function getAllOrder(req, res) {
    try {
        const aOrder = await order.find({});
        return aOrder;
    } catch (err) {
        return res.status(501).json(err);
    }
}

//get cake by ID
async function getCakeByID(req, res) {
    try {
        const aCake = await cake.findById(req);
        return aCake;
    } catch (err) {
        return res.status(501).json(err);
    }
}

//check theo week
async function checkWeek(dateNow, dateCheck) { //theo tuần
    let run = (now, check) => {
        date = { "Mon": 2, "Tue": 3, "Wed": 4, "Thu": 5, "Fri": 6, "Sat": 7, "Sun": 8 } //thứ 2 là đầu tuần
        month = { "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12 }
        var nowSplit = now.split(" ");
        var checkSplit = check.split(" ");
        if (nowSplit[3] == checkSplit[3]) { //năm =
            if (month[nowSplit[1]] == month[checkSplit[1]]) { //tháng =
                if (nowSplit[2] - 7 <= checkSplit[2] && nowSplit[2] >= checkSplit[2]) { //không cách quá 7 ngày
                    if (date[nowSplit[0]] >= date[checkSplit[0]]) //set ngày trong tuần không được lớn hơn now
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    return run(dateNow, dateCheck);
}

//check theo month
async function checkMonth(yearCheck, monthCheck, dateOrder) {
    console.log("1")
    let run = (yearCheck, monthCheck, dateOrder) => {
        month = {
            "Jan": 1,
            "Feb": 2,
            "Mar": 3,
            "Apr": 4,
            "May": 5,
            "Jun": 6,
            "Jul": 7,
            "Aug": 8,
            "Sep": 9,
            "Oct": 10,
            "Nov": 11,
            "Dec": 12
        }
        var checkSplit = dateOrder.split(" ");
        console.log("nam: "+ checkSplit[3])
        if (yearCheck == checkSplit[3]) { //năm =
            console.log("aaa: "+ checkSplit[1])
            if (month[monthCheck] == month[checkSplit[1]]) { //tháng =
                console.log("2")
                return true;
            }
        }
        return false;
    }
    return run(yearCheck, monthCheck, dateOrder);
}
//check theo year
async function checkYear(yearCheck, dateOrder) { //theo tuần
    let run = (yearCheck, dateOrder) => {
        var checkSplit = dateOrder.split(" ");
        if (yearCheck == checkSplit[3]) { //năm =
            return true;
        }
        return false;
    }
    return run(yearCheck, dateOrder);
}
//Đếm sách trong từng OrderDetail
async function CreateListCakeBuyMost(data, element) {
    let isExist1 = (data2, x) => {

        for (var key in data2) {
            if (data2[key].cakeID == x.cakeID) {
                data2[key].count += x.count;
                return data2;
            }
        } {
            var cake = {}
            cake = { "cakeID": x.cakeID, "count": x.count }
            data2.push(cake);
            return data2;
        }
    }
    return isExist1(data, element);
}

async function ShowPriceTotal(data) {
    var totalPrice = 0.0
    totalPrice += (data.totalPrice - ((data.totalPrice * data.discountCode) / 100));
    return totalPrice;
}

router.get('/TotalPriceOnWeek', function(req, res) {
    async function run() {
        var totalPriceOnWeek = 0.0
        var today = new Date();
        today = today.toString().substring(0, 24);
        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            if (await checkWeek(today, orderArray[index].orderDate) == true) {

                totalPriceOnWeek = await ShowPriceTotal(orderArray[index])
            }
        }
        res.json(totalPriceOnWeek);
    }
    run();
})

router.post('/TotalPriceOnMonth', function(req, res) {
    async function run() {
        var totalPriceOnMonth = 0.0
        var yearCheck = req.body.yearCheck
        var monthCheck = req.body.monthCheck
        var CountCakeBuy = 0
        // today = today.toString().substring(0, 24);
        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            if (orderArray[index].status == 'Done' || orderArray[index].paymentOption == 'Online' || orderArray[index].paymentOption == 'MOMO') {
                if (await checkMonth(yearCheck, monthCheck, orderArray[index].orderDate) == true) {
                    totalPriceOnMonth += orderArray[index].totalPrice;
                    const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id)
                    for(let aOrderArray of orderDetailArray)
                    {
                        CountCakeBuy += aOrderArray["count"]
                    }
                }
               
            }
        }
        const CountUser = await getSosialAccountByOrUserAccountID()
        res.json({totalPriceOnMonth,CountCakeBuy,CountUser});
    }
    run();
})
router.get('/TotalPriceOnYear/:year', function(req, res) {
    async function run() {
        var totalPriceOnYear = 0.0
        var yearCheck = req.params.year
        var CountCakeBuy = 0
        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            if (orderArray[index].status == 'Done' || orderArray[index].paymentOption == 'Online'|| orderArray[index].paymentOption == 'MOMO') {
                if (await checkYear(yearCheck, orderArray[index].orderDate) == true) {
                    totalPriceOnYear += orderArray[index].totalPrice
                    const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id)
                    for(let aOrderArray of orderDetailArray)
                    {
                        CountCakeBuy += aOrderArray["count"]
                    }
                }
            }
        }
        const CountUser = await getSosialAccountByOrUserAccountID()

        res.json({totalPriceOnYear,CountCakeBuy,CountUser});
    }
    run();
})
async function CustomPriceByMonth(Data, month, price, arrayOrderDetails) {
    let sum = 0
    for (var key of arrayOrderDetails) {
        sum += key.count
    }
    for (var key in Data) {
        if (Data[key].month == month) {
            Data[key].totalPrice += price;
            Data[key].count += sum
            return Data;
        }
    }
    var dataReturn = {}
    dataReturn = { "month": month, "totalPrice": price, "count": sum }
    Data.push(dataReturn);
    return Data;
}

router.post('/TotalPriceOnEachMonth', function(req, res) {
    async function run() {
        var totalPriceOnMonth = 0.0
        var yearCheck = req.body.yearCheck
        console.log("year:" + yearCheck)
        const orderArray = await getAllOrder(req, res);
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        let TotalPriceByEachMonth = []
        for (let i in months) {
            for (var index in orderArray) {
                const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
                if (orderArray[index].status == 'Done' ||orderArray[index].paymentOption == 'Online' ||  orderArray[index].paymentOption == 'MOMO') {
                    if (await checkMonth(yearCheck, months[i], orderArray[index].orderDate) == true) {
                        TotalPriceByEachMonth = await CustomPriceByMonth(TotalPriceByEachMonth, months[i], orderArray[index].totalPrice, orderDetailArray)
                    }
                }
            }
        }
        res.json(TotalPriceByEachMonth);
    }
    run();
})




router.get('/BuyTheMost', function(req, res) {
    async function run() {
        let arrayCakeBuyTheMost = []
        let temp = 0
        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
            for (var index2 in orderDetailArray) {
                // arrayCakeBuyTheMost.push(orderDetailArray[index2]);
                //kiểm tra xem id sách có tồn tại trong danh sách
                //nếu chưa thì thêm , có rồi thì cộng
                arrayCakeBuyTheMost = await CreateListCakeBuyMost(arrayCakeBuyTheMost, orderDetailArray[index2])
            }
        }
        arrayCakeBuyTheMost.sort(function(a, b) {
            return b.count - a.count;
        });
        //show 10 cake most 
        let arrayCakeMost = []

        for (var index in arrayCakeBuyTheMost) {
            let aCake = await getCakeByID(arrayCakeBuyTheMost[index].cakeID, res)
            arrayCakeMost.push(aCake);
            if (index >= 10) break;
        }
        res.json(arrayCakeBuyTheMost);
    }
    run();
})

router.get('/FourCakeBuyTheMost', function(req, res) {
        async function run() {
            let arrayCakeBuyTheMost = []
            let temp = 0
            const orderArray = await getAllOrder(req, res);
            for (var index in orderArray) {
                const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
                for (var index2 in orderDetailArray) {
                    // arrayCakeBuyTheMost.push(orderDetailArray[index2]);
                    //kiểm tra xem id sách có tồn tại trong danh sách
                    //nếu chưa thì thêm , có rồi thì cộng
                    arrayCakeBuyTheMost = await CreateListCakeBuyMost(arrayCakeBuyTheMost, orderDetailArray[index2])
                }
            }
            arrayCakeBuyTheMost.sort(function(a, b) {
                return b.count - a.count;
            });
            let arrayFourCakeMost = []
            for (let i in arrayCakeBuyTheMost) {
                let cakeByID = await getCakeByID(arrayCakeBuyTheMost[i].cakeID, res)

                let CakeBuyMost = {}
                CakeBuyMost = { "nameCake": cakeByID.nameCake, "count": arrayCakeBuyTheMost[i].count }
                arrayFourCakeMost.push(CakeBuyMost)
                if (i >= 3) break;
            }
            res.json(arrayFourCakeMost);
        }
        run();
    })
    //Buy the most By week
router.get('/CakeBuyTheMostOnWeek', function(req, res) {
        async function run() {
            let arrayCakeBuyTheMost = []
            let temp = 0
            var today = new Date();
            today = today.toString().substring(0, 24);
            const orderArray = await getAllOrder(req, res);
            for (var index in orderArray) {
                if (await checkWeek(today, orderArray[index].orderDate) == true) {
                    const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
                    for (var index2 in orderDetailArray) {
                        // arrayCakeBuyTheMost.push(orderDetailArray[index2]);
                        //kiểm tra xem id sách có tồn tại trong danh sách
                        //nếu chưa thì thêm , có rồi thì cộng
                        arrayCakeBuyTheMost = await CreateListCakeBuyMost(arrayCakeBuyTheMost, orderDetailArray[index2])
                    }
                }
            }
            arrayCakeBuyTheMost.sort(function(a, b) {
                return b.count - a.count;
            });
            //show 10 cake most 
            let arrayCakeMost = []

            for (var index in arrayCakeBuyTheMost) {
                let aCake = await getCakeByID(arrayCakeBuyTheMost[index].cakeID, res)
                arrayCakeMost.push(aCake);
                if (index >= 10) break;
            }
            res.json(arrayCakeBuyTheMost);
        }
        run();
    })
    //Buy the most By month
router.get('/CakeBuyTheMostOnMonth', function(req, res) {
        async function run() {
            let arrayCakeBuyTheMost = []
            let temp = 0
            var today = new Date();
            today = today.toString().substring(0, 24);
            const orderArray = await getAllOrder(req, res);
            for (var index in orderArray) {
                if (await checkMonth(today, orderArray[index].orderDate) == true) {
                    const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
                    for (var index2 in orderDetailArray) {
                        // arrayCakeBuyTheMost.push(orderDetailArray[index2]);
                        //kiểm tra xem id sách có tồn tại trong danh sách
                        //nếu chưa thì thêm , có rồi thì cộng
                        arrayCakeBuyTheMost = await CreateListCakeBuyMost(arrayCakeBuyTheMost, orderDetailArray[index2])
                    }
                }
            }
            arrayCakeBuyTheMost.sort(function(a, b) {
                return b.count - a.count;
            });
            //show 10 cake most 
            let arrayCakeMost = []

            for (var index in arrayCakeBuyTheMost) {
                let aCake = await getCakeByID(arrayCakeBuyTheMost[index].cakeID, res)
                arrayCakeMost.push(aCake);
                if (index >= 10) break;
            }
            res.json(arrayCakeBuyTheMost);
        }
        run();
    })
    //Buy the most By Year
router.get('/CakeBuyTheMostOnYear', function(req, res) {
    async function run() {
        let arrayCakeBuyTheMost = []
        let temp = 0
        var today = new Date();
        today = today.toString().substring(0, 24);
        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            if (await checkYear(today, orderArray[index].orderDate) == true) {
                const orderDetailArray = await getOrderDetailByOrderID(orderArray[index]._id, res);
                for (var index2 in orderDetailArray) {
                    // arrayCakeBuyTheMost.push(orderDetailArray[index2]);
                    //kiểm tra xem id sp có tồn tại trong danh sách
                    //nếu chưa thì thêm , có rồi thì cộng
                    arrayCakeBuyTheMost = await CreateListCakeBuyMost(arrayCakeBuyTheMost, orderDetailArray[index2])
                }
            }
        }
        arrayCakeBuyTheMost.sort(function(a, b) {
            return b.count - a.count;
        });
        //show 10 cake most 
        let arrayCakeMost = []

        for (var index in arrayCakeBuyTheMost) {
            let aCake = await getCakeByID(arrayCakeBuyTheMost[index].cakeID, res)
            arrayCakeMost.push(aCake);
            if (index >= 10) break;
        }
        res.json(arrayCakeBuyTheMost);

    }
    run();
})


// Khách hàng tiềm năng
async function getUserIDByCusID(req, res) {
    try {
        const aUser = await customer.findById(req);
        return aUser;
    } catch (err) {
        return res.status(501).json(err);
    }
}
//
async function BestUser(data, order, userInOrder) {
    let isExist1 = (data2, orderCheck, userInOrderCheck) => {
        for (var key in data2) {
            if (data2[key].userID == userInOrderCheck.userID) {
                data2[key].totalPrice += orderCheck.totalPrice;
                return data2;
            }
        } {
            var cake = {}
            cake = { "userID": userInOrderCheck.userID, "totalPrice": orderCheck.totalPrice }
            data2.push(cake);
            return data2;
        }
    }
    return isExist1(data, order, userInOrder);
}
//khách hàng tiềm năng theo năm
router.get('/BestUser/:year', function(req, res) {
    async function run() {
        let arrayUserBuyBest = []
        let temp = 0
        const orderArray = await getAllOrder(req, res);
        var yearCheck = req.params.year
        for (var index in orderArray) {
            if (await checkYear(yearCheck, orderArray[index].orderDate) == true) {
                if (orderArray[index].status == 'Done'||orderArray[index].paymentOption == 'Online') {
                    const userInOrder = await getUserIDByCusID(orderArray[index].customerID, res);
                    arrayUserBuyBest = await BestUser(arrayUserBuyBest, orderArray[index], userInOrder)
                }
            } else {
                var cake = {}
                cake = { "userID": "not found", "totalPrice": 0.0 }
                arrayUserBuyBest.push(cake);
            }
        }
        arrayUserBuyBest.sort(function(a, b) {
            return b.totalPrice - a.totalPrice;
        });
        //show khách hàng tiềm năng
        res.json(arrayUserBuyBest[0]);
        return
    }
    run();
});
//Month Example: Jul Jun ....
router.post('/BestUserOnMonth', function(req, res) {
    async function run() {
        let arrayUserBuyBest = []
        var yearCheck = req.body.yearCheck
        var monthCheck = req.body.monthCheck

        const orderArray = await getAllOrder(req, res);
        for (var index in orderArray) {
            if (await checkMonth(yearCheck, monthCheck, orderArray[index].orderDate) == true) {
                if (orderArray[index].status == 'Done'||orderArray[index].paymentOption == 'Online') {
                    const userInOrder = await getUserIDByCusID(orderArray[index].customerID, res);
                    arrayUserBuyBest = await BestUser(arrayUserBuyBest, orderArray[index], userInOrder)
                }
            } else {
                var cake = {}
                cake = { "userID": "not found", "totalPrice": 0.0 }
                arrayUserBuyBest.push(cake);
            }
        }
        arrayUserBuyBest.sort(function(a, b) {
            return b.totalPrice - a.totalPrice;
        });
        //show khách hàng tiềm năng
        res.json(arrayUserBuyBest[0]);
        return
    }
    run();
})


//layas all usser
async function getSosialAccountByOrUserAccountID() {
    try {

        const accountUser = await userAccount.find()
        const accountSosial = await accountsocials.find()
        const total = parseInt(accountUser.length) + parseInt(accountSosial.length)
        console.log( total)
        return total
    } catch (error) {

    }
}
module.exports = router;