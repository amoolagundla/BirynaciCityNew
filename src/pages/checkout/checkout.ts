import {
    Component, ViewChild, ElementRef
} from '@angular/core';
import {
    NavController,
    AlertController,
    NavParams, Platform
} from 'ionic-angular';
import {
    HomePage
} from "../home/home";

import {
    UserInfo
} from '../../app/app.module';
import {
    CartService
} from '../../services/cart-service';
import {
    ValuesService
} from '../../services/ValuesService';
import {
    LoadingController
} from 'ionic-angular';
import {model } from '../../app/app.module';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage'; import { ModalController } from 'ionic-angular';
import { ModalContentPage } from './ModalContentPage';
import { SharedDataService } from '../../services/sharedDataService';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
declare var google: any;
declare const RazorpayCheckout: any;

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html'
})
export class CheckoutPage {
    public duration: number = 0;
    public currentAddress: any;
    public DeliveyTime: any = '12PM';
    public DeliveyDate: string = new Date().toISOString();
    public userInfo: UserInfo;
    public addressId: any = 0;
    public paymentMethod: any = 0;
    public myVar: boolean = false;
    public totalAddress: any;
    public total: any;
    public cart: model.OrderDetail[] = [];
    public checkouts: any = {
        DeliveryTime: '',
        DeliveryDate: ''

    };
    public carryout: boolean = false;
    public te: Geolocation;
    public delivery: boolean = false;
    public address: any = {
        Address1: '',
        Address2: '',
        State: '',
        City: '',
        Country: 'India',
        Address3: '',
        UserName: '',
        Id: 0,
        IsDefault: false,
        PostalCode: ''
    };
    public loading: any = this.loadingCtrl.create({
        content: "",
        dismissOnPageChange: true
    });

    // slides for slider 
    @ViewChild('map') mapElement: ElementRef;
    map: any;


    loadMap() {


        this.geolocation.getCurrentPosition().then((resp) => {
            this.getlocation(resp.coords.latitude, resp.coords.longitude);
        }).catch((error) => {
            console.log('Error getting location', error);
        });


    }


    getlocation(lat: any, long: any) {
        this.nativeGeocoder.reverseGeocode(lat, long)
            .then((result: NativeGeocoderReverseResult) => {
                this.currentAddress = result.street + " " + result.houseNumber + "," + result.city + "," + result.countryName + "," + result.countryCode + "," + result.postalCode;

            })
            .catch((error: any) => console.log(error));
    }

    constructor(public nav: NavController,
        public alertController: AlertController,
        public navParams: NavParams,
        public cartService: CartService,
        private valuesService: ValuesService,
        public loadingCtrl: LoadingController, public platform: Platform, public storage: Storage,
         private nativeGeocoder: NativeGeocoder,
        public modalCtrl: ModalController,
         public _SharedDataService: SharedDataService,
          private geolocation: Geolocation) {

        this._SharedDataService.UserInfo.subscribe((data) => {
            this.userInfo = data;

        });

        this.cart = cartService.getCart();
        this.total = this.navParams.get('total');
        this.platform = platform; this.loadMap();
        this.myVar = true;
        this.GetPayMent(2);

    }
    addNewAddress() {
        let modal = this.modalCtrl.create(ModalContentPage);
        modal.present();
    }
    deliverydetail() {
        this.delivery = true;
        this.carryout = false;

    }
    carryoutdetail() {
        this.carryout = true;
        this.delivery = false;
    }
    // edit address
    editAddress() {
        let prompt = this.alertController.create({
            title: 'Address',
            message: "",
            inputs: [{
                name: 'address',
                value: ''
            },],
            buttons: [{
                text: 'Cancel',
                handler: (data: any) => {
                    console.log('Cancel clicked');
                }
            }, {
                text: 'Save',
                handler: (data: any) => {
                    console.log('Saved clicked');
                }
            }]
        });

        prompt.present();
    }
    GetPayMent(id: any) {
        this.paymentMethod = id;
    }
    GetAddressId(Id: any) {
        this.addressId = Id;
    }

    addAddress() {
        this.loading.present();
        let add = document.getElementById("p1").innerText;

        if (add != undefined) {
            console.log('oside')
            let addd: string[] = add.split(',');
            console.log(add);
            this.address.Address1 = addd[0];
            this.address.State = addd[3];
            this.address.City = addd[2];
            this.address.PostalCode = addd[4];

        }
        this.valuesService.InsertAddress(this.address)
            .subscribe(
            da => {
                this.valuesService.getAll().subscribe(data => {
                    this.loading.dismiss();
                }, err => {
                        this.loading.dismiss();
                    });

            });

    }

    // place order button click
    buy() {
        if (this.delivery == false && this.carryout == false) {
            let alert = this.alertController.create({
                title: '',
                subTitle: 'Please select Carryout/Delivery',
                buttons: [
                    {
                        text: 'OK',
                        handler: (data: any) => {


                        }
                    }
                ]
            });

            alert.present();
        }
        else {
            // show alert this.valuesService.PostOrder(OrdDetail).subscribe(
            if (this.delivery == false) {
                if (this.paymentMethod == 1) {
                    this.onSubmit();
                }
                else if (this.paymentMethod == 2) {
                    let OrderDetail = {
                        DeliveryTime: this.DeliveyTime,
                        DeliveryDate: this.DeliveyDate,
                        cart: this.cartService.getCart(),
                        AddressId: this.addressId,
                        PaymentMethod: this.paymentMethod,
                        Amount:this.total
                    };

                    this.loading.present();
                    this.PlaceOrder(OrderDetail);
                }
                else if (this.paymentMethod == 0) {
                    this.showLoginAlert("Please select a payment option");
                }
            }
            else {
                if (this.paymentMethod == 1 && this.addressId > 0) {
                    this.onSubmit();
                }
                else if (this.paymentMethod == 2 && this.addressId > 0) {
                    let OrderDetail = {
                        DeliveryTime: this.DeliveyTime,
                        DeliveryDate: this.DeliveyDate,
                        cart: this.cartService.getCart(),
                        AddressId: this.addressId,
                        PaymentMethod: this.paymentMethod,
                        Amount:this.total
                    };
                    // alert(this.addressId)
                    this.loading.present();
                    this.PlaceOrder(OrderDetail);
                }
                else {
                    let msg = 'please select ';
                    if (this.delivery == true) {
                        if (this.addressId <= 0 || this.addressId == undefined)
                            msg += ' address,';
                    }
                    else {
                        this.addressId = 0;
                    }


                    if (this.paymentMethod == 0)
                        msg += 'payment method';

                    if (msg != 'please select ')
                        this.showLoginAlert(msg);
                }
            }
        }
    }
    public showLoginAlert(msg: any) {
        let alert = this.alertController.create({
            title: '',
            subTitle: msg,
            buttons: [
                {
                    text: 'OK',
                    handler: (data: any) => {


                    }
                }
            ]
        });

        alert.present();
    }
    public onSubmit() {
        // var amt = this.total * 100;
        // var options = {
        //     description: 'Credits towards consultation',
        //     image: 'https://i.imgur.com/3g7nmJC.png',
        //     currency: 'INR',
        //     key: 'rzp_test_TXWGPmvIG46GTp',
        //     amount: amt,
        //     name: '99Meat',
        //     prefill: {
        //         email: '',
        //         contact: '',
        //         name: ''
        //     },
        //     theme: {
        //         color: '#F37254'
        //     },
        //     modal: {
        //         ondismiss: function () {
        //             alert('dismissed');
        //             this.loading.dismiss();
        //         }
        //     }
        // };

        // var successCallback = function (payment_id) {
        //     alert('payment_id: ' + payment_id);
        //     this.loading.dismiss();
        // };

        // var cancelCallback = function (error) {
        //     alert(error.description + ' (Error ' + error.code + ')');
        //     this.loading.dismiss();
        // };

        // this.platform.ready().then(() => {
        //     RazorpayCheckout.open(options, successCallback, cancelCallback);
        // })


    }

    public showAlert() {
        let alert = this.alertController.create({
            title: 'Info',
            subTitle: 'Your order has been sent. We will notify when your order is ready',
            buttons: [{
                text: 'OK',
                handler: (data: any) => {

                    this.cartService.ClearCart();
                    this.nav.setRoot(HomePage);
                }
            }]
        });

        alert.present();
    }

    public PlaceOrder(OrdDetail: any) {
        if (this.paymentMethod == 1) {
            this.onSubmit();
        }
        else {
            this.placeOrder(OrdDetail);
        }
    }
    public placeOrder(orderDetail: any) {

        this.valuesService.PostOrder(orderDetail).subscribe(
            data => {
                this.getUserInfo();
            },
            error => {
                this.loading.dismiss();
            });
    }
    public getUserInfo() {
        this.valuesService.getAll().subscribe(
            data => {
                localStorage.removeItem("UserInfo");
                localStorage.setItem('UserInfo', JSON.stringify(data));
                this.loading.dismiss();
                this.showAlert();
            }, error => {
                this.loading.dismiss();
            });
    }
}
