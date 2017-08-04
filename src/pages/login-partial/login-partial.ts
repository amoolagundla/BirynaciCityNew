
import {
    Component
} from '@angular/core';
import {
    NavController, NavParams
} from 'ionic-angular';
import {
    HomePage
} from "../home/home";
import {
    AuthenticationService
} from "../../services/login-service";
import {
    ValuesService
} from "../../services/ValuesService";
import {
    LoadingController
} from 'ionic-angular';
import {
    AlertController

} from 'ionic-angular';
import {
    RegisterPage
} from "../register/register";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

import {
    Storage
} from '@ionic/storage';

import { CartPage } from '../cart/cart';
import { OneSignal } from '@ionic-native/onesignal';
import { ModalController } from 'ionic-angular';

import { CartService } from '../../services/cart-service';
import { SharedDataService } from '../../services/sharedDataService';
import { ResetEmailPage } from '../../pages/reset-email/reset-email';
/*
  Generated class for the LoginPartial page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-login-partial',
    templateUrl: 'login-partial.html'
})
export class LoginPartialPage {

    /*private oauth: OauthCordova = new OauthCordova();
        private facebookProvider: Facebook = new Facebook({
          clientId: "172669669872080",
          appScope: ["email"]
        })*/
    public isCartPage: boolean = false;
    public username: string = '';
    public token: string;

    public loading: any = this.loadingCtrl.create({
        content: "",
        dismissOnPageChange: true
    });

    public password: string = '';
    constructor(public nav: NavController,
        private authenticationService: AuthenticationService,
        public loadingCtrl: LoadingController,
        public valuesService: ValuesService,
        public alertCtrl: AlertController,
        public storage: Storage,
        public modalCtrl: ModalController,
        private oneSignal: OneSignal,
        public _SharedDataService: SharedDataService,
        public navParams: NavParams,
        public cartService: CartService) {


        let cartPage = this.navParams.get('cartPage');
        if (cartPage != undefined) {
            this.isCartPage = cartPage;
        }


    }

    // go to register page
    register() {
        this.nav.setRoot(RegisterPage);
    }
    // login and go to home page
    login() {

        this.loading.present();
        this.authenticationService.login(this.username, this.password)
            .subscribe(
            data => {

                this.storage.remove('currentUser');
                this.storage.remove('userName');

                this.storage.set('currentUser', data.access_token).then(() => {


                    this.getUserInfo();

                }, (error: any) => {

                });

            }, (error: any) => {
                this.loading.dismiss();
                let er = error.json();
                let alert = this.alertCtrl.create({
                    title: 'Login Error ',
                    subTitle: er.error_description,
                    buttons: ['Dismiss']
                });
                alert.present();
                this.nav.setRoot(LoginPartialPage);
            });

    }



    getUserInfo() {
        this.valuesService.getAll()
            .subscribe(
            data => {

                this.storage.set('UserInfo', JSON.stringify(data)).then(() => {
                    //   this.getCatogories();
                    this.storage.remove('at');
                    this.loading.dismiss();
                    this.registerPushToken();
                        let cart = this.cartService.getCart();
                        if (cart.length == 0) {
                            this.nav.setRoot(HomePage, { email: data.Email });
                        }
                        else {
                            this.nav.setRoot(CartPage);
                        }
                     }, (error: any) => {

                });

            },
            error => {
                console.log(error);
                this.loading.dismiss();

            });

    }
    registerPushToken() {
        this.oneSignal.getIds().then((data: any) => {

            this.valuesService.SaveToken(JSON.stringify(data)).subscribe(() => {
            }, err => {
            });
        });
    }


    openPasssword() {
        let modal = this.modalCtrl.create(ResetEmailPage, { "resetEmail": true });
        modal.present();
    }
    verifyCodePasssword() {
        let modal = this.modalCtrl.create(ResetEmailPage, { "resetEmail": false });
        modal.present();
    }
}
