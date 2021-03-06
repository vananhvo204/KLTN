import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { CakeService } from '../../../app-services/cake-service/cake.service';
import { Cake } from '../../../app-services/cake-service/cake.model';
import { CategoryService } from '../../../app-services/category-service/category.service';
import { Category } from '../../../app-services/category-service/category.model';
import { Session } from 'protractor';
import { AuthorService } from '../../../app-services/author-service/author.service';
import { Author } from '../../../app-services/author-service/author.model';
import { FormGroup, FormControl } from '@angular/forms';
import { CakeFiter } from '../../../app-services/cake-service/cakefilter.model';
import { SocialAccount } from 'src/app/app-services/socialAccount-service/socialaccount.model';
import { CartCakeService } from 'src/app/app-services/cartCake-service/cartCake.service';
import { CartCake } from 'src/app/app-services/cartCake-service/cartCake.model';
//favorite
import { Favorite } from 'src/app/app-services/favorite-service/favorite.model';
import { FavoriteService } from 'src/app/app-services/favorite-service/favorite.service';
declare var $: any
@Component({
  selector: 'app-page-show-list',
  templateUrl: './page-show-list.component.html',
  styleUrls: ['./page-show-list.component.css']
})
export class PageShowListComponent implements OnInit {
 
  pageOfItems: Array<any>;
  cakes: Array<Cake> = new Array<Cake>();


  cakeFilter: CakeFiter = new CakeFiter();
  //alert
  alertMessage = "";
  alertSucess = false;
  alertFalse = false;
  cartCakeDB: CartCake = new CartCake;
  constructor(private _router: Router,private route: ActivatedRoute, private cakeService: CakeService, private authorService: AuthorService,
    private cakeCategoryService: CategoryService, private _cartCakeDB: CartCakeService,private _favoriteService:FavoriteService) {
  }
  accountSocial = JSON.parse(localStorage.getItem('accountSocial'));

  id = this.route.snapshot.paramMap.get('id');
  namefilter = this.route.snapshot.paramMap.get('name');
  favorite: Favorite = new Favorite
  listFavorite :any
  nameShow=""
  nameShow1=""
  ngOnInit() {
    this.getAllFavoriteByUserId();
    $('.searchHeader').attr('style', 'font-size: 1.6rem !important');
    $(function () {
      $("#scrollToTopButton").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 1000);
      });

    });
    //set ????? d??i cartCake
    this.cartCakeLength(this.CartCake);
    //set value gi??? h??ng tr??n thanh head 
    this.getTotalCountAndPrice();
    console.log("namefilter: "+ this.namefilter)
    if(this.namefilter=="category"){
      this.getCakeByCategoryId(this.id)
      this.getNameCategroy(this.id)
    }else
    if(this.namefilter=="sale"){
      this.getCakeSale()
      this.nameShow = "S???n Ph???m Gi???m Gi??"
      this.nameShow1 = "S???n Ph???m Gi???m Gi??"
    }
    
  
  }
  getCakeSale(){
    this.cakeService.getCakeSale().subscribe(ListCake=>{
      this.cakes=ListCake as Cake[]
    })
  }
getCakeByCategoryId(id){
this.cakeService.getCakeByCategoryId(id).subscribe(ListCake=>{
  this.cakes = ListCake as Cake[]

})
}
 
getNameCategroy(id){
    this.cakeCategoryService.getCategoryById(id).subscribe(aCategory=>{
      this.nameShow =aCategory["nameCategory"]
      this.nameShow1 = "Loa??i sa??n ph????m"
    })
  }
  // check count cart before add (hover )
  checkCountMax10 = true;
  checkCountCartBeforeAdd(selectedCake: Cake) {
    this.checkCountMax10 = true;
    for (var i = 0; i < this.lengthCartCake; i++) {
      if (this.CartCake[i]._id == selectedCake._id) {
        //ki???m tra s??? l?????ng 
        if (this.CartCake[i].count == 10) {
          this.checkCountMax10 = false;
        }
        console.log(this.CartCake[i].count);
      }
    }
    //n???u s???n ph???m kh??ng c?? trong cartcake ( ch??a t???ng th??m v??o gi???)

  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }
  selectedCake = [];
  detailCake(cake: Cake) {
    return this._router.navigate(['/cakeDetail/' + `/${cake._id}`]);

  }



  getid_cake(id) {
    localStorage.setItem('cake_detail', id);
  }









  change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
  }


  addACake = "";
  //add to cart (CakeDetail,CountSelect)
  // s??? l?????ng t???i ??a ch??? ???????c 10 m???i qu???n s???n ph???m , t??nh lu??n ???? c?? trong gi???

  checkedAddCake = true;
  addToCart(selectedCake: Cake) {
    this.addACake = selectedCake.nameCake;
    var CartCake = [];    //l??u tr??? b??? nh??? t???m cho localStorage "CartCake"
    var dem = 0;            //V??? tr?? th??m s???n ph???m m???i v??o localStorage "CartCake" (n???u s???n ph???m ch??a t???n t???i)
    var temp = 0;           // ????nh d???u n???u ???? t???n t???i s???n ph???m trong localStorage "CartCake" --> count ++
    // n???u localStorage "CartCake" kh??ng r???ng

    if (localStorage.getItem('CartCake') != null) {
      //ch???y v??ng l???p ????? l??u v??o b??? nh??? t???m ( t???o m???ng cho Object)

      for (var i = 0; i < JSON.parse(localStorage.getItem("CartCake")).length; i++) {
        CartCake[i] = JSON.parse(localStorage.getItem("CartCake"))[i];
        // n???u id cake ???? t???n t???i trong  localStorage "CartCake" 
        if (CartCake[i]._id == selectedCake._id) {
          temp = 1;  //?????t bi???n temp
          // n???u s??? l?????ng t???i ??a ch??? ???????c 10 m???i qu???n s???n ph???m , t??nh lu??n ???? c?? trong gi??? th?? oke
          if (parseInt(CartCake[i].count) + 1 <= 10) {
            CartCake[i].count = parseInt(CartCake[i].count) + 1;  //t??ng gi?? tr??? count
            //c???p nh???t cartcake v??o db
            this.putCartCakeDB(CartCake[i]);
          }
          else {
            //show alert
            this.checkedAddCake = false;
            //update l???i s??? l?????ng 


            this.alertMessage = "???? t???n t???i 10 qu???n s???n ph???m " + CartCake[i].nameCake + " trong gi??? h??ng";
            this.alertFalse = true;
            setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
          }
        }
        dem++;  // ?????y v??? tr?? g??n ti???p theo
      }
    }

    if (temp != 1) {      // n???u s???n ph???m ch??a c?? ( temp =0 ) th?? th??m s???n ph???m v??o
      selectedCake.count = 1;  // set count cho s???n ph???m
      CartCake[dem] = selectedCake; // th??m s???n ph???m v??o v??? tr?? "dem" ( v??? tr?? cu???i) 
      //l??u cartcake v??o db
      this.postCartCakeDB(selectedCake);
    }
    // ????? m???ng v??o localStorage "CartCake"
    localStorage.setItem("CartCake", JSON.stringify(CartCake));

    this.getTotalCountAndPrice();
    //  //show alert
    //  this.alertMessage="Th??m th??nh c??ng s???n ph???m "+ selectedCake.nameCake +" v??o gi??? h??ng";
    //  this.alertSucess=true;
    //  setTimeout(() => {this.alertMessage="";this.alertSucess=false}, 6000); 

  }

  //get total count and price 
  TongTien = 0;
  TongCount = 0;
  CartCake = [];
  lengthCartCake = 0;
  getTotalCountAndPrice() {
    this.TongTien = 0;
    this.TongCount = 0;
    this.CartCake = JSON.parse(localStorage.getItem("CartCake"));
    this.cartCakeLength(this.CartCake);
    if (this.CartCake != null) {
      for (var i = 0; i < this.lengthCartCake; i++) {
        this.TongTien += parseInt((parseInt(this.CartCake[i].priceCake) * parseInt(this.CartCake[i].count) * (100 - this.CartCake[i].sale) / 100).toFixed(0));
        this.TongCount += parseInt(this.CartCake[i].count);

      }
    }
    $('#tongtien').html("&nbsp;" + this.formatCurrency(this.TongTien.toString()));
    $('.cart_items').html(this.TongCount.toString());
    localStorage.setItem("TongTien", this.TongTien.toString());
    localStorage.setItem("TongCount", this.TongCount.toString());
  }
  //#endregion
  formatCurrency(number) {
    var n = number.split('').reverse().join("");
    var n2 = n.replace(/\d\d\d(?!$)/g, "$&,");
    return n2.split('').reverse().join('') + 'VN??';
  }
  // set ????? d??i c???a gi??? h??ng
  cartCakeLength(CartCake) {
    if (CartCake == null) {
      this.lengthCartCake = 0;
    } else {
      this.lengthCartCake = CartCake.length;
    }
  }

  // go to cart cake
  goToCartCake() {
    this._router.navigate(['/cartCake']);
  }

  startPage: Number;
  paginationLimit: Number;

  startPageCategories: Number;
  paginationLimitCategories: Number;
  showMoreItems() {
    this.paginationLimit = this.authorService.authors.length;
  }
  showLessItems() {
    this.paginationLimit = 5;
  }
  showMoreCategories() {
    this.paginationLimitCategories = this.cakeCategoryService.categories.length;
  }
  showLessCategories() {
    this.paginationLimitCategories = 5;
  }

  postCartCakeDB(selectedCake: Cake) {
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
      this.cartCakeDB.userID = this.accountSocial._id;
      this.cartCakeDB.cakeID = selectedCake._id;
      this.cartCakeDB.count = selectedCake.count;
      this._cartCakeDB.postCartCake(this.cartCakeDB).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
    }
  }
  putCartCakeDB(selectedCake: Cake) {
    if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
      this.cartCakeDB.userID = this.accountSocial._id;
      this.cartCakeDB.cakeID = selectedCake._id;
      this.cartCakeDB.count = selectedCake.count;
      this._cartCakeDB.putCartCake(this.cartCakeDB).subscribe(
        req => {
          console.log(req);
        },
        error => console.log(error)
      );
    }
  }

 // favorite Cake
 favoriteCake(cakeID){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
  this.favorite.cakeID=cakeID;
  this.favorite.userID=this.accountSocial._id
  this._favoriteService.postFavorite(this.favorite).subscribe(
    aFavorite=>{ // aFavorite s??? tr??? v??? all favorite by userID
      this.listFavorite = aFavorite as Favorite[];
  })
}else{
  this.alertMessage = "B???n ph???i ????ng nh???p ????? th???c hi???n thao t??c n??y";
  this.alertFalse = true;
  setTimeout(() => { this.alertMessage = ""; this.alertFalse = false }, 4000);
}
}
getAllFavoriteByUserId(){
  if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
  this._favoriteService.getAllFavoriteByUserID(this.accountSocial._id).subscribe(
    listFavorites =>{
      this.listFavorite = listFavorites as Favorite[];
    }
  )
}
}
//validate favorite 
validateFavorite(id) {
if (JSON.parse(localStorage.getItem('accountSocial')) != null) {
for(let index in this.listFavorite)
{
  if(id==this.listFavorite[index].cakeID)
  return true;
}
return false
}
return false
}

}
