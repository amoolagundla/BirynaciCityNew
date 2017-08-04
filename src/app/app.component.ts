import { Component, ViewChild } from '@angular/core';

import { Nav, } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { CartPage } from '../pages/cart/cart';
import { UserPage } from '../pages/user/user';
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';
import { CartService } from '../services/cart-service';
import { UserInfo } from './app.module';
import { SharedDataService } from '../services/sharedDataService';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;
  public userInfo: UserInfo = null;
  public url: string = '';
  public name: string = 'Biryani City';
  public rootPage: any;
  public cartItemCount: any = 0;
  // public nav: any;
  public pages: any = [];
  public loggedInPages: any = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    }, {
      title: 'My Cart',
      icon: 'ios-cart-outline',
      count: this.cartItemCount,
      component: CartPage
    },
    {
      title: 'Profile',
      icon: 'ios-person-outline',
      count: 0,
      component: UserPage
    }, {
      title: 'Orders',
      icon: 'ios-basket-outline',
      count: 0,
      component: MyOrdersPage
    },
    {
      title: 'About us',
      icon: 'ios-information-circle-outline',
      count: 0,
      component: AboutPage
    },
    {
      title: 'Logout/Login',
      icon: 'ios-log-out-outline',
      count: 0,
      component: LoginPage
    }
  ];
  public loggedOutPages: any = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    }, {
      title: 'My Cart',
      icon: 'ios-cart-outline',
      count: this.cartItemCount,
      component: CartPage
    },
    {
      title: 'About us',
      icon: 'ios-information-circle-outline',
      count: 0,
      component: AboutPage
    },
    {
      title: 'Logout/Login',
      icon: 'ios-log-out-outline',
      count: 0,
      component: LoginPage
    }
    // import menu


  ];

  constructor(public platform: Platform, private cartService: CartService, public _SharedDataService: SharedDataService, private statusBar: StatusBar, public splashScreen: SplashScreen,
  ) {
    this.rootPage = HomePage;
    this.showPages();


    this.platform.ready().then(() => {
      this.splashScreen.hide();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.initializeApp();
    });
  }

  openPage(page: any) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  initializeApp() {

    this._SharedDataService.UserInfo.subscribe((data: any) => {

      this.userInfo = data;
      this.showPages();
    });
    this.cartService
      .statusChanged.subscribe((data: any) => {
        this.pages[1].count = data.totalCount;


      });

  }
  showPages() {
    if (this.userInfo == null) {
      this.pages = this.loggedOutPages;
    }
    else {

      this.pages = this.loggedInPages;
    }
  }
  // view my profile
  viewMyProfile() {
    this.nav.setRoot(UserPage);
  }
}


