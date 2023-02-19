import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchBike } from 'src/app/model/searchBike';
import { OrderBikeService } from 'src/app/services/order-bike.service';
import { LoadingComponent } from 'src/app/constant/loading';
import { DialogService } from 'src/app/services/dialog.service';
import { Constant } from 'src/app/constant/constant';
import { TitleMessage } from 'src/app/model/titleMessage.type';

@Component({
  selector: 'app-bicycle-payment',
  templateUrl: './bicycle-payment.component.html',
  styleUrls: ['./bicycle-payment.component.css'],
})
export class BicyclePaymentComponent implements OnInit {
  objectConfirm: any;
  customerID: any;
  customerInformation: any;
  typeBikeID: any;
  dateRent: any;
  hoursGetBike: any;
  timeHire: any;
  numberOfBike: any;
  typeBikeName: any;
  price: any;
  totalPrice: any;
  responPaymentStatus: any;
  searchBike: any;
  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private orderBikeService: OrderBikeService
  ) {}

  ngOnInit(): void {
    this.customerID = localStorage.getItem('idUser');
    this.getCustomerInformationByID();
    this.route.queryParams.subscribe((res) => {
      this.typeBikeID = res.typeBikeID;
      this.dateRent = res.dateRent;
      this.hoursGetBike = res.hoursGetBike;
      this.timeHire = res.timeHire;
      this.numberOfBike = res.numberOfBike;
      this.typeBikeName = res.typeBikeName;
      this.price = res.price;
    });
    this.caculateTotalPrice();
  }
  caculateTotalPrice() {
    this.totalPrice =
      Number(this.price) * Number(this.timeHire) * Number(this.numberOfBike);
    this.loadSnipper();
  }
  loadSnipper(): void {
    this.isLoading = true;
    setTimeout(() => (this.isLoading = false), LoadingComponent.timeLoad);
  }
  getCustomerInformationByID() {
    this.orderBikeService
      .getCustomerInformationByID(this.customerID)
      .subscribe((res) => {
        this.customerInformation = res.data;
      });
  }
  createLinkPayment() {
    var titleMessage: TitleMessage = {
      title: Constant.textNotice.title,
      titleMessageContent: Constant.payment.paymentContent,
    };
    this.objectConfirm = this.dialogService.openConfirmDialog(titleMessage);
    this.objectConfirm.afterClosed().subscribe((result: any) => {
      if (result) {
        this.orderBikeService
          .paymentBikeOrder(
            this.totalPrice,
            this.timeHire,
            this.typeBikeName,
            this.numberOfBike
          )
          .subscribe((res) => {
            this.searchBike = new SearchBike(
              this.dateRent,
              this.hoursGetBike,
              this.numberOfBike,
              this.timeHire,
              this.customerInformation[0].customerID,
              this.typeBikeID
            );
            localStorage.setItem('searchBike', JSON.stringify(this.searchBike));
            this.responPaymentStatus = res.url;
            window.location.href = this.responPaymentStatus;
          });
      }
    });
  }
}
