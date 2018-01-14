import {
    Platform
} from 'ionic-angular';
import { Component, OnInit } from '@angular/core';;
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
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal } from '@ionic-native/onesignal';
import {
    Storage
} from '@ionic/storage';
import { LoginPartialPage } from '../login-partial/login-partial';

declare const facebookConnectPlugin: any;
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage implements OnInit {

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
    FB_APP_ID: number = 1835538836698571;
    public password: string = '';

    ngOnInit() {
        this.initializeApp();

        this.valuesService.logOut();
        this.storage.remove('google');
        this.storage.remove('at');
        this.storage.remove('products');
        this.storage.remove('categories');
        this.storage.remove('currentUser');
        this.storage.remove('userName');
        this.storage.remove('UserInfo');





    };
    constructor(public nav: NavController,
        private authenticationService: AuthenticationService,
        public loadingCtrl: LoadingController,
        public valuesService: ValuesService,
        public alertCtrl: AlertController,
        public platform: Platform,
        public storage: Storage,
        private oneSignal: OneSignal,
        private fb: Facebook,
        private googlePlus: GooglePlus, public navParams: NavParams) {
        let cartPage = this.navParams.get('cartPage');
        if (cartPage != undefined) {
            this.isCartPage = cartPage;
        }
        this.platform.ready().then(() => {

            this.initializeApp();
        });

    }

    // go to register page
    register() {
        this.nav.push(RegisterPage);
    }
    // login and go to home page
    login() {

        this.nav.push(LoginPartialPage, { cartPage: true });

    }



    initializeApp() {
        // if (!this.platform.is('core')) {
        //     this.oneSignal.startInit('19e74911-eb39-4e13-83dd-1c11cb3cba1e', '695358309253');
        //     this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        //     this.oneSignal.setSubscription(true);
        //     this.oneSignal.handleNotificationReceived().subscribe(() => {
        //         // do something when the notification is received.
        //     });
        //     this.oneSignal.handleNotificationOpened().subscribe(() => {
        //         // do something when the notification is opened.
        //     });
        //     this.oneSignal.endInit();
        // }
    }


    Googlelogin(acesstoken: any) {



        this.loading.present();

        this.authenticationService.Googlelogin(acesstoken)
            .subscribe(
            data => {



                this.storage.set('currentUser', data.access_token).then(() => {


                    this.getUserInfo();

                }, (error: any) => {

                });

            },
            error => {
                this.loading.dismiss();
                let er = error.json();
                let alert = this.alertCtrl.create({
                    title: 'Login Error ',
                    subTitle: er.error_description,
                    buttons: ['Dismiss']
                });
                alert.present();
                this.nav.setRoot(LoginPage);
            });

    }
    facebooklogin(acesstoken: any) {

        this.loading.present();
        this.storage.remove('at');



        this.authenticationService.Facebooklogin(acesstoken)
            .subscribe(
            data => {

                this.storage.set('currentUser', data.access_token).then(() => {


                    this.getUserInfo();

                }, (error: any) => {

                });

            },
            error => {
                this.loading.dismiss();
                let er = error.json();
                let alert = this.alertCtrl.create({
                    title: 'Login Error Api',
                    subTitle: er,
                    buttons: ['Dismiss']
                });
                alert.present();
                this.nav.setRoot(LoginPage);
            });



    }
    googlelog() {

        let navv = this.nav;
        let glog = this;


        this.googlePlus.login({

            'webClientId': '695358309253-rg8nla5ip1bqs1sk7qlt1imlh7fsatco.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
            'offline': true
        })
            .then(function (user) {
                let at = JSON.stringify(user);



                glog.Googlelogin(at);

            }, function (error) {
                let er = error;
                let alert = glog.alertCtrl.create({
                    title: 'Login Error ',
                    subTitle: er,
                    buttons: ['Dismiss']
                });
                alert.present();
                navv.setRoot(LoginPage);
            });

    }

    public postfbTokens(token: any) {
        this.loading.present();
        this.valuesService.PostFacebookTokens(token)
            .subscribe(
            data => {



            },
            error => {


            });
    }


    ioniclog() {
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
                    if (this.isCartPage) {
                        this.nav.pop();
                    }
                    else {
                        this.nav.setRoot(HomePage, { email: data.Email });
                    }

                }, (error: any) => {
                });

            }, (error: any) => {
                this.loading.dismiss();

            });

    }

    registerPushToken() {

        this.oneSignal.getIds().then(data => {

            this.valuesService.SaveToken(JSON.stringify(data)).subscribe(() => {
            }, (error: any) => {
            });
            // this gives you back the new userId and pushToken associated with the device. Helpful.
        });

    }

    getCatogories() {
        this.valuesService.getAllCategories()
            .subscribe(
            data => {
                this.storage.set('categories', JSON.stringify(data)).then(() => {
                    this.loading.dismiss();
                    this.nav.setRoot(HomePage);

                }, (error: any) => {
                    this.loading.dismiss();
                });

            }, (error: any) => {
                this.loading.dismiss();
            });
    }

    loginFB() {

        let permissions = new Array();
        let navv = this.nav;
        let platform = this;
        this.fb.logout()
            .then(function () {

            }, function (error: any) {
                console.log(error);
            });
        //the permissions your facebook app needs from the user
        permissions = ["public_profile,email"];
        this.fb.login(['public_profile', 'email'])
            .then((response: FacebookLoginResponse) => {
                let userId = response.authResponse.userID;
                let at = response.authResponse.accessToken;
                // alert(at)
                platform.facebooklogin(at);

                //now we have the users info, let's save it in the NativeStorage

                let userDetails = {
                    url: "https://graph.facebook.com/" + userId + "/picture?type=large",
                    name: ''
                };


                this.storage.set('userDetails', userDetails)
                    .then(function () {

                    }, function (error: any) {
                        console.log(error);
                    });
            })
            .catch((err: any) => {
                let er = err.json();
                let alert = this.alertCtrl.create({
                    title: 'Login Error ',
                    subTitle: er,
                    buttons: ['Dismiss']
                });
                alert.present();
                navv.setRoot(LoginPage);
            });

    }


    logout() {
        facebookConnectPlugin.logout((response: any) => {
            alert(JSON.stringify(response));
        })
    }
}