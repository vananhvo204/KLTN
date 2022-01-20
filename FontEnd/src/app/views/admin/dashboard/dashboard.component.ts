import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatisticService } from 'src/app/app-services/statistic-service/statistic.service';
import { UserService } from 'src/app/app-services/user-service/user.service';
import { SocialaccountService } from 'src/app/app-services/socialAccount-service/socialaccount.service';
import { AuthenticateService } from 'src/app/app-services/auth-service/authenticate.service';
import { CakeService } from 'src/app/app-services/cake-service/cake.service';
declare var $:any;       
class TotalMonth{
  yearCheck: string;
  monthCheck: string;
}  

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // accountSocial = JSON.parse(localStorage.getItem('accountSocial'));
  // statusLogin = localStorage.getItem('statusLogin');
  // loginBy = localStorage.getItem('loginBy');

  //Doughnut Chart
   doughnutChartLabels = [];
   doughnutChartType: string = ''
   doughnutChartData = []
  //Bar Chart
    barChartOptions = {};
   barChartLabels = [] 
   barChartType = ''
   barChartLegend = false

   barChartData = [];
  //Radar chart
  //  radarChartLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  //  radarChartData = [
  //   {data: [120, 130, 180, 70], label: '2017'},
  //   {data: [90, 150, 200, 45], label: '2018'}
  // ];
   //radarChartType = 'radar';

 
  constructor(private _router: Router, private statisticService: StatisticService,private cakeService: CakeService,
     private userService: UserService, private accountSocialService: SocialaccountService) { }
     FourCakeBuyMost : any
    ngOnInit() {
    // this.doughnutChartLabels =  [];
    // this.doughnutChartData = [59, 34, 28, 17];
    this.statisticService.getFourCakesBuyTheMost().subscribe(res => {
      this.FourCakeBuyMost = res
      for(let i in this.FourCakeBuyMost){
        this.doughnutChartData.push(this.FourCakeBuyMost[i].count)
        this.doughnutChartLabels.push(this.FourCakeBuyMost[i].nameCake)
      }
      this.doughnutChartType = 'doughnut';
    })
    this.totalMonth.yearCheck = "2021"
    this.TotalPriceOnEachMonth();
  
    $('#field_month').addClass("readonly-wrapper");
    $('#select_month').addClass("readonly-block");
    $("#month").on('change',function(){
      if($("#month").is(':checked')){
        $('#field_month').removeClass("readonly-wrapper");
        $('#select_month').removeClass("readonly-block");
      }
      else{
        $('#field_month').addClass("readonly-wrapper");
          $('#select_month').addClass("readonly-block");
      }
  });

 
  
    this.statisticService.TotalPriceOnYear(2021).subscribe(total => {
      this.totalYear = total["totalPriceOnYear"]
      this.countCakeBuy = total["CountCakeBuy"]
      this.countAllUser= total["CountUser"]
    }) 
    this.statisticService.BestUserOnYear(2021).subscribe(total => {
      this.bestUser = total
      this.totalYearOfCustomer =  this.bestUser.totalPrice
      if(this.bestUser.userID == 'not found'){
        this.bestUserName = ""
      }else{
        this.userService.getUserById(this.bestUser.userID).subscribe(res => {
          this.bestUserShow = res
          this.bestUserName = this.bestUserShow.username
        })
      }
    })
  }
  yearCheck: Date = new Date()
  arraydata = [{ "month": "Jan", "totalPrice": 0, "count": 0 },
  { "month": "Feb", "totalPrice": 0, "count": 0 },
  { "month": "Mar", "totalPrice": 0, "count": 0 },
  { "month": "Apr", "totalPrice": 0, "count": 0 },
  { "month": "May", "totalPrice": 0, "count": 0 },
  { "month": "Jun", "totalPrice": 0, "count": 0 },
  { "month": "Jul", "totalPrice": 0, "count": 0 },
  { "month": "Aug", "totalPrice": 0, "count": 0 },
  { "month": "Sep", "totalPrice": 0, "count": 0 },
  { "month": "Oct", "totalPrice": 0, "count": 0 },
  { "month": "Nov", "totalPrice": 0, "count": 0 },
  { "month": "Dec", "totalPrice": 0, "count": 0 },]
  TotalPriceByMonth=[]
  TotalCakeByMonth = []
  //totalMonth.yearCheck = "2021"
  TotalPriceOnEachMonth(){   
    this.statisticService.TotalPriceOnEachMonth(this.totalMonth).subscribe(res => {
      // this.TotalPriceByMonth = 
      //this.totalMonth.yearCheck = 
      console.log("res: "+this.totalMonth.yearCheck)
      this.barChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true
      };
      this.barChartLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
      this.barChartType = 'bar'
      this.barChartLegend = true
      for(let i in (res as [])){
        console.log(res[i])
        for(let index in this.arraydata){
          if(res[i].month == this.arraydata[index].month){
            this.arraydata[index].totalPrice = res[i].totalPrice
            this.arraydata[index].count = res[i].count
          }
        }        
      }
      for(let index in this.arraydata){
        this.TotalPriceByMonth.push(this.arraydata[index].totalPrice)
        this.TotalCakeByMonth.push(this.arraydata[index].count)
      }
      //console.log("totalprice: "+this.TotalPriceByMonth)
      //console.log("totalprice1: "+this.TotalPriceByMonth1)
      this.barChartData = [  {data: this.TotalCakeByMonth, label: 'Số lượng sản phẩm bán'},
                             {data: this.TotalPriceByMonth, label: 'Doanh thu'}  ]
    })
    
  }

  totalYear: any = 0.0
  countAllUser :any =0
  countCakeBuy : any =0
  bestUser: any
  bestUserShow: any
  bestUserName : any
  totalYearOfCustomer: any = 0.0
  onYear: boolean = false;
  onMonth: boolean = false;
  selectedYear: any
  selectedMonth: any
  
  clickMonth:any
  checkValue(event: any){
    if(event == true){
      this.clickMonth=true
      if(this.selectedMonth==null)
      {
        this.selectedMonth="Jan"
      }
    }else{
      this.clickMonth=false

    }
    console.log(this.selectedMonth)
    this.customCheckMonthAndYear()
 }
 
 changeYear(year){
  this.selectedYear = year
  this.customCheckMonthAndYear()
  this.totalMonth.yearCheck = year
  this.TotalPriceByMonth = []
  this.TotalCakeByMonth = []
  this.arraydata = [{ "month": "Jan", "totalPrice": 0, "count": 0 },
  { "month": "Feb", "totalPrice": 0, "count": 0 },
  { "month": "Mar", "totalPrice": 0, "count": 0 },
  { "month": "Apr", "totalPrice": 0, "count": 0 },
  { "month": "May", "totalPrice": 0, "count": 0 },
  { "month": "Jun", "totalPrice": 0, "count": 0 },
  { "month": "Jul", "totalPrice": 0, "count": 0 },
  { "month": "Aug", "totalPrice": 0, "count": 0 },
  { "month": "Sep", "totalPrice": 0, "count": 0 },
  { "month": "Oct", "totalPrice": 0, "count": 0 },
  { "month": "Nov", "totalPrice": 0, "count": 0 },
  { "month": "Dec", "totalPrice": 0, "count": 0 },]
  //this.barChartData = [];
  this.TotalPriceOnEachMonth()
}
 totalMonth: TotalMonth = new TotalMonth();
  changeMonth(month){
    this.selectedMonth = month
    this.customCheckMonthAndYear()
  }

  //tạo biến event
  customCheckMonthAndYear(){
    //nếu chỉ có năm 
    console.log("Check"+this.clickMonth )
    console.log("Mont"+this.selectedMonth )
    console.log("Year"+this.selectedYear )
  if(this.selectedMonth==null||this.clickMonth==false){
    console.log("vào chỉ có năm")
    this.statisticService.TotalPriceOnYear(this.selectedYear).subscribe(total => {
      console.log(total)
      this.totalYear = total["totalPriceOnYear"]
      this.countCakeBuy = total["CountCakeBuy"]
      this.countAllUser= total["CountUser"]
    })
    this.statisticService.BestUserOnYear(this.selectedYear).subscribe(total => {
      this.bestUser = total
      this.totalYearOfCustomer =  this.bestUser.totalPrice
      if(this.bestUser.userID == 'not found'){
        this.bestUserName = ""
      }else{
        this.userService.getUserById(this.bestUser.userID).subscribe(res => {
          this.bestUserShow = res
          this.bestUserName = this.bestUserShow.username
        })
        this.accountSocialService.getUserByID(this.bestUser.userID).subscribe(res => {
              this.bestUserShow = res
              this.bestUserName = this.bestUserShow.username
            })
      }
    })
} 
//nếu có cả tháng và năm
if(this.selectedMonth!=null && this.clickMonth==true){
  console.log("vào có năm và tháng")
  
  this.totalMonth.yearCheck = this.selectedYear
    this.totalMonth.monthCheck = this.selectedMonth
    console.log(this.totalMonth)
    //TotalMonth include yearCheck and monthCheck
    this.statisticService.TotalPriceOnMonth(this.totalMonth).subscribe(total => {
  
      this.totalYear = total["totalPriceOnMonth"]
      this.countCakeBuy = total["CountCakeBuy"]
      this.countAllUser= total["CountUser"]
    })
    this.statisticService.BestUserOnMonth(this.totalMonth).subscribe(total => {
      this.bestUser = total
      this.totalYearOfCustomer =  this.bestUser.totalPrice
      if(this.bestUser.userID == 'not found'){
        this.bestUserName = ""
      }else{
        this.userService.getUserById(this.bestUser.userID).subscribe(res => {

          this.bestUserShow = res
          this.bestUserName = this.bestUserShow.username
        })
         this.accountSocialService.getUserByID(this.bestUser.userID).subscribe(res => {
         
              this.bestUserShow = res
              this.bestUserName = this.bestUserShow.username
            })
      }
    })
}
  }
  moveToAdminProfile(){
    this._router.navigate(['/adminProfile']);
  }

}
