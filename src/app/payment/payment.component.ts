import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../constant/loading';
import { ActivityEmployee } from '../model/activityEmployee';
import { OrderBikeInformation } from '../model/orderBikeInformation';
import { OrderFoodInformation } from '../model/orderFoodInformation';
import { OrderRoomInformation } from '../model/orderRoomInformation';
import { ManageActivityEmployeeService } from '../services/manage-activity-employee.service';
import { OrderBikeService } from '../services/order-bike.service';
import { OrderFoodService } from '../services/order-food.service';
import { OrderRoomService } from '../services/order-room.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  isLoading = false
  codeOrder: any;
  price: any;
  contentPayment: any;
  resultPayment: any;
  activityEmployee:any;
  contentResultPayment: any;
  bankTransactionNumber: any;
  vnpTransactionNumber: any;
  typePayment: any;
  bankCode: any;
  timePayment: any;
  searchInformationString: any
  searchInformationJason: any
  customerInformationString: any
  customerInformationJason: any
  days: any;
  orderInformation: any;
  statusMessage: any;
  accountID: any;
  role: any;
  orderFood: Array<{ orderFoodInformation: OrderFoodInformation }> = [];
  constructor(private route: ActivatedRoute, private orderRoomService: OrderRoomService, private orderBikeService: OrderBikeService, private orderFoodService: OrderFoodService,private manageActivityEmployeeService:ManageActivityEmployeeService) { }

  ngOnInit(): void {
    this.loadSnipper()
    this.accountID = localStorage.getItem("idUser");
    this.role = localStorage.getItem("Role");
    this.route.queryParams.subscribe(res => {
      this.vnpTransactionNumber = res.vnp_TransactionNo;
      this.codeOrder = res.vnp_TxnRef
      this.price = Number(res.vnp_Amount) / 100;
      this.contentPayment = res.vnp_OrderInfo;
      this.resultPayment = res.vnp_ResponseCode;
      if (this.resultPayment == "00") {
        this.contentResultPayment = "Giao d???ch th??nh c??ng"
      }
      else if (this.resultPayment == "07") {
        this.contentResultPayment = "Tr??? ti???n th??nh c??ng. Giao d???ch b??? nghi ng??? (li??n quan t???i l???a ?????o, giao d???ch b???t th?????ng)."
      }
      else if (this.resultPayment == "09") {
        this.contentResultPayment = "Giao d???ch kh??ng th??nh c??ng do: Th???/T??i kho???n c???a kh??ch h??ng ch??a ????ng k?? d???ch v??? InternetBanking t???i ng??n h??ng."
      }
      else if (this.resultPayment == "10") {
        this.contentResultPayment = "Giao d???ch kh??ng th??nh c??ng do: Kh??ch h??ng x??c th???c th??ng tin th???/t??i kho???n kh??ng ????ng qu?? 3 l???n"
      }
      else if (this.resultPayment == "11") {
        this.contentResultPayment = "Giao d???ch kh??ng th??nh c??ng do: ???? h???t h???n ch??? thanh to??n. Xin qu?? kh??ch vui l??ng th???c hi???n l???i giao d???ch."
      }
      else if (this.resultPayment == "12") {
        this.contentResultPayment = "Giao d???ch kh??ng th??nh c??ng do: Th???/T??i kho???n c???a kh??ch h??ng b??? kh??a."
      }
      else if (this.resultPayment == "13") {
        this.contentResultPayment = "Giao d???ch kh??ng th??nh c??ng do Qu?? kh??ch nh???p sai m???t kh???u x??c th???c giao d???ch (OTP). Xin qu?? kh??ch vui l??ng th???c hi???n l???i giao d???ch."
      }
      else if (this.resultPayment == "24") {
        this.contentResultPayment = "Giao d???ch kh??ng th??nh c??ng do: Kh??ch h??ng h???y giao d???ch"
      }
      else if (this.resultPayment == "51") {
        this.contentResultPayment = "Giao d???ch kh??ng th??nh c??ng do: T??i kho???n c???a qu?? kh??ch kh??ng ????? s??? d?? ????? th???c hi???n giao d???ch."
      }
      else if (this.resultPayment == "65") {
        this.contentResultPayment = "Giao d???ch kh??ng th??nh c??ng do: T??i kho???n c???a qu?? kh??ch kh??ng ????? s??? d?? ????? th???c hi???n giao d???ch."
      }
      else if (this.resultPayment == "75") {
        this.contentResultPayment = "Ng??n h??ng thanh to??n ??ang b???o tr??."
      }
      else if (this.resultPayment == "79") {
        this.contentResultPayment = "Giao d???ch kh??ng th??nh c??ng do: KH nh???p sai m???t kh???u thanh to??n qu?? s??? l???n quy ?????nh. Xin qu?? kh??ch vui l??ng th???c hi???n l???i giao d???ch"
      }
      else if (this.resultPayment == "99") {
        this.contentResultPayment = "l???i Kh??ng x??c ?????nh."
      }
      this.bankTransactionNumber = res.vnp_BankTranNo;
      this.bankCode = res.vnp_BankCode;
      this.timePayment = res.vnp_PayDate;
      this.typePayment = res.vnp_CardType;
    })
    if (this.codeOrder.substring(0, 1) == 'R') {
      this.searchInformationString = localStorage.getItem("searchInformation");
      if (this.searchInformationString != null) {
        this.searchInformationJason = JSON.parse(this.searchInformationString)
      }
      this.customerInformationString = localStorage.getItem("customerInformation");
      if (this.customerInformationString != null) {
        this.customerInformationJason = JSON.parse(this.customerInformationString)
      }
      this.caculateDate();
    } else if (this.codeOrder.substring(0, 1) == 'B') {
      this.searchInformationString = localStorage.getItem("searchBike");
      if (this.searchInformationString != null) {
        this.searchInformationJason = JSON.parse(this.searchInformationString)
      }
    } else if (this.codeOrder.substring(0, 1) == 'F') {
      this.searchInformationString = localStorage.getItem("foodInformation");
      if (this.searchInformationString != null) {
        this.searchInformationJason = JSON.parse(this.searchInformationString)
      }
      this.customerInformationString = localStorage.getItem("customerOrderFood");
      if (this.customerInformationString != null) {
        this.customerInformationJason = JSON.parse(this.customerInformationString)
      }
    }
    this.createOrder();
  }
  caculateDate() {
    let dateCheckOut = new Date(this.searchInformationJason.checkOutDate);
    let dateCheckIn = new Date(this.searchInformationJason.checkInDate);
    this.days = Math.floor((dateCheckOut.getTime() - dateCheckIn.getTime()) / 1000 / 60 / 60 / 24);
  }
  createOrder() {
    if (this.resultPayment == "00") {
      if (this.codeOrder.substring(0, 1) == 'R') {
        if (this.role == "LT") {
          if (this.customerInformationJason.customerID == null) {
            this.activityEmployee = new ActivityEmployee(0,"???? t???o ????n ?????t ph??ng c?? m?? h??a ????n "+ this.codeOrder +" v?? thanh to??n ?????y ????? c???a kh??ch h??ng t??n "+this.customerInformationJason.fullName + " qua h??? th???ng vnpay",this.accountID,"");
            this.manageActivityEmployeeService.createActivityEmployee(this.activityEmployee).subscribe((res)=>{

            })
            this.orderInformation = new OrderRoomInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment, this.bankTransactionNumber, this.vnpTransactionNumber, this.typePayment, this.bankCode, this.timePayment, this.days, this.customerInformationJason.fullName, this.customerInformationJason.phoneNumber, this.customerInformationJason.dateOfBirth, this.customerInformationJason.identifyNumber, this.searchInformationJason.checkInDate, this.searchInformationJason.checkOutDate, this.searchInformationJason.numberOfRoom, this.searchInformationJason.typeRoomID, this.customerInformationJason.email);
            this.orderRoomService.createOrderRoomReceptionist(this.orderInformation).subscribe(res => {
              localStorage.removeItem('searchInformation');
              localStorage.removeItem('customerInformation');
            })
          }
          else {
            this.activityEmployee = new ActivityEmployee(0,"???? t???o ????n ?????t ph??ng c?? m?? h??a ????n "+ this.codeOrder +" v?? thanh to??n ?????y ????? c???a kh??ch h??ng t??n "+this.customerInformationJason.fullName + " qua h??? th???ng vnpay",this.accountID,"");
            this.manageActivityEmployeeService.createActivityEmployee(this.activityEmployee).subscribe((res)=>{

            })
            this.orderInformation = new OrderRoomInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment, this.bankTransactionNumber, this.vnpTransactionNumber, this.typePayment, this.bankCode, this.timePayment, this.days, "", "", new Date(), "", this.searchInformationJason.checkInDate, this.searchInformationJason.checkOutDate, this.searchInformationJason.numberOfRoom, this.searchInformationJason.typeRoomID, "", this.customerInformationJason.customerID);
            this.orderRoomService.createOrderRoomForCustomer(this.orderInformation).subscribe(res => {
              localStorage.removeItem('searchInformation');
              localStorage.removeItem('customerInformation');
            })
          }
        }
        else if (this.role == "CS") {
          this.orderInformation = new OrderRoomInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment, this.bankTransactionNumber, this.vnpTransactionNumber, this.typePayment, this.bankCode, this.timePayment, this.days, "", "", new Date(), "", this.searchInformationJason.checkInDate, this.searchInformationJason.checkOutDate, this.searchInformationJason.numberOfRoom, this.searchInformationJason.typeRoomID, "", this.customerInformationJason[0].customerID);
          this.orderRoomService.createOrderRoomForCustomer(this.orderInformation).subscribe(res => {
            localStorage.removeItem('searchInformation');
            localStorage.removeItem('customerInformation');
          })
        }
      }
      else if (this.codeOrder.substring(0, 1) == 'B') {
        if (this.role == "LT") {
          this.activityEmployee = new ActivityEmployee(0,"???? t???o ????n ?????t xe ?????p c?? m?? h??a ????n "+ this.codeOrder +" v?? nh???n thanh to??n ?????y ????? c???a kh??ch h??ng qua h??? th???ng vnpay",this.accountID,"");
          this.manageActivityEmployeeService.createActivityEmployee(this.activityEmployee).subscribe((res)=>{

          })
          this.orderInformation = new OrderBikeInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment, this.bankTransactionNumber, this.vnpTransactionNumber, this.typePayment, this.bankCode, this.timePayment, this.searchInformationJason.dateRent, this.searchInformationJason.timeHire, this.searchInformationJason.hoursGetBike, this.searchInformationJason.customerID, this.searchInformationJason.typeBikeID, this.searchInformationJason.numberOfBike);
          this.orderBikeService.createOrderBike(this.orderInformation).subscribe(res => {
            localStorage.removeItem('searchBike');
          })
        }
        else
        {
        this.orderInformation = new OrderBikeInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment, this.bankTransactionNumber, this.vnpTransactionNumber, this.typePayment, this.bankCode, this.timePayment, this.searchInformationJason.dateRent, this.searchInformationJason.timeHire, this.searchInformationJason.hoursGetBike, this.searchInformationJason.customerID, this.searchInformationJason.typeBikeID, this.searchInformationJason.numberOfBike);
        this.orderBikeService.createOrderBike(this.orderInformation).subscribe(res => {
          localStorage.removeItem('searchBike');
        })
      }
      }
      else if (this.codeOrder.substring(0, 1) == 'F') {
        if (this.role == "CS") {
          for (var item of this.searchInformationJason) {
            this.orderInformation = new OrderFoodInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment, this.bankTransactionNumber, this.vnpTransactionNumber, this.typePayment, this.bankCode, this.timePayment, item.quantity, item.foodID, this.customerInformationJason[0].customerID, item.foodName);
            this.orderFood.push(this.orderInformation);
          }
          this.orderFoodService.createOrderFood(this.orderFood).subscribe(res => {
            localStorage.removeItem('foodInformation');
            localStorage.removeItem('customerOrderFood');
          })
        }
        else {
          this.activityEmployee = new ActivityEmployee(0,"???? t???o ????n ?????t ????? ??n c?? m?? h??a ????n "+ this.codeOrder +" v?? nh???n thanh to??n ?????y ????? c???a kh??ch h??ng qua h??? th???ng vnpay",this.accountID,"");
          this.manageActivityEmployeeService.createActivityEmployee(this.activityEmployee).subscribe((res)=>{

          })
          for (var item of this.searchInformationJason) {
            this.orderInformation = new OrderFoodInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment, this.bankTransactionNumber, this.vnpTransactionNumber, this.typePayment, this.bankCode, this.timePayment, item.quantity, item.foodID, this.customerInformationJason[0].customerID, item.foodName);
            this.orderFood.push(this.orderInformation);
          }
          this.orderFoodService.createOrderFood(this.orderFood).subscribe(res => {
            localStorage.removeItem('foodInformation');
            localStorage.removeItem('customerOrderFood');
          })
        }
      }
    }
    /*else
    {
      if (this.codeOrder.substring(0, 1) == 'R') {
        if (this.accountID == null) {
          this.orderInformation = new OrderRoomInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment,"0", "0", this.typePayment, this.bankCode, this.timePayment, this.days, this.customerInformationJason.fullName, this.customerInformationJason.phoneNumber, this.customerInformationJason.dateOfBirth, this.customerInformationJason.identifyNumber, this.searchInformationJason.checkInDate, this.searchInformationJason.checkOutDate, this.searchInformationJason.numberOfRoom, this.searchInformationJason.typeRoomID,this.customerInformationJason.email);
          this.orderRoomService.createOrderRoom(this.orderInformation).subscribe(res => {
            localStorage.removeItem('searchInformation');
            localStorage.removeItem('customerInformation');
          })
        }
        else
        {
          this.orderInformation = new OrderRoomInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment,"0", "0", this.typePayment, this.bankCode, this.timePayment, this.days,"", "",new Date(), "", this.searchInformationJason.checkInDate, this.searchInformationJason.checkOutDate, this.searchInformationJason.numberOfRoom, this.searchInformationJason.typeRoomID,"",this.customerInformationJason[0].customerID);
          this.orderRoomService.createOrderRoomForCustomer(this.orderInformation).subscribe(res => {
            localStorage.removeItem('searchInformation');
            localStorage.removeItem('customerInformation');
          })
        }
      }
      else if (this.codeOrder.substring(0, 1) == 'B') {
        this.orderInformation = new OrderBikeInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment,"0","0", this.typePayment, this.bankCode, this.timePayment, this.searchInformationJason.dateRent, this.searchInformationJason.timeHire, this.searchInformationJason.hoursGetBike, this.searchInformationJason.customerID, this.searchInformationJason.typeBikeID, this.searchInformationJason.numberOfBike);
        this.orderBikeService.createOrderBike(this.orderInformation).subscribe(res => {
          localStorage.removeItem('searchBike');
        })
      }
      else if (this.codeOrder.substring(0, 1) == 'F') {
        for (var item of this.searchInformationJason) {
          this.orderInformation = new OrderFoodInformation(this.codeOrder, this.price, this.contentPayment, this.resultPayment, this.contentResultPayment,"0", "0", this.typePayment, this.bankCode, this.timePayment, item.quantity, item.foodID, this.customerInformationJason[0].customerID);
          this.orderFood.push(this.orderInformation);
        }
        this.orderFoodService.createOrderFood(this.orderFood).subscribe(res => {
          localStorage.removeItem('foodInformation');
        })
      }
    }*/
  }
  loadSnipper(): void {
    this.isLoading = true;
    setTimeout(() => (this.isLoading = false), LoadingComponent.timeLoad);
  }
}
