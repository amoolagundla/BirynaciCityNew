import { NgModule } from '@angular/core';

import { IonicApp, IonicModule } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { FormsModule } from '@angular/forms';
// import services
import { AuthenticationService } from '../services/login-service';
import { ValuesService } from '../services/ValuesService';
import { HttpClient } from '../services/HttpClient';
import { CartService } from '../services/cart-service';
// end import services
// end import services
// import pages
import { ModalContentPage } from '../pages/checkout/ModalContentPage';
import { AboutPage } from '../pages/about/about';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { MyOrdersPage } from '../pages/my-orders/my-orders';
import { AddressPage } from '../pages/address/address';
import { CartPage } from '../pages/cart/cart';
import { HttpModule } from '@angular/http';
import { CartIndicatorComponent } from '../pages/cart/CartIndicator';
import { CategoriesPage } from '../pages/categories/categories';
import { CategoryPage } from '../pages/category/category';
import { CheckoutPage } from '../pages/checkout/checkout';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { SettingPage } from '../pages/setting/setting';
import { UserPage } from '../pages/user/user';
import { OrderDetailsPage } from '../pages/order-details/order-details';
import { ResetEmailPage } from '../pages/reset-email/reset-email';
import { LoginPartialPage } from '../pages/login-partial/login-partial';
import { SharedDataService } from '../services/sharedDataService';
import { OneSignal } from '@ionic-native/onesignal';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import {
 GoogleMaps

 
} from '@ionic-native/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { ItemPage } from '../pages/item/item';
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    AddressPage,
    CartPage,
    CategoriesPage,
    CategoryPage,
    ItemPage,
    CheckoutPage,

    HomePage,
    LoginPage,

    RegisterPage,
    SettingPage,
    UserPage,
    MyOrdersPage,
    ChangePasswordPage,
    OrderDetailsPage,
    ModalContentPage,
    LoginPartialPage,
    ResetEmailPage,
    CartIndicatorComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'top' }),
    FormsModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    AddressPage,
    CartPage,
    CategoriesPage,
    CategoryPage,
    ItemPage,
    CheckoutPage,
    HomePage,
    LoginPage,
    RegisterPage,
    SettingPage,
    UserPage,
    MyOrdersPage,
    ChangePasswordPage,
    OrderDetailsPage,
    ModalContentPage,
    LoginPartialPage,
    ResetEmailPage,
    CartIndicatorComponent
  ],
  providers: [
    Storage,
    AuthenticationService,
    HttpClient,
    ValuesService,
    CartService,
    SharedDataService,
    OneSignal,
    Facebook, GooglePlus, StatusBar, Geolocation, NativeGeocoder, GoogleMaps, SplashScreen

  ]
})
export class AppModule { }

export module model {


   export interface OrderViewModel {
        ProductName?: any;
        Quantity: number;
        UnitPrice: number;
        ProductAmount: number;
        AddressId?: any;
        pic?: any;
        SpicyLevel: number;
        Instructions?: any;
        distance:any;
    }
   export interface Distance {
        text: string;
        value: number;
    }

    export interface Duration {
        text: string;
        value: number;
    }

    export interface Element {
        distance: Distance;
        duration: Duration;
        status: string;
    }

    export interface Row {
        elements: Element[];
    }

    export interface distanceMatrix {
        destination_addresses: string[];
        origin_addresses: string[];
        rows: Row[];
        status: string;
    }
  export class Product {
    constructor() {
    }
    public Id: number;
    public ProdcutName: string
    public ProductDesc: string
    public IsProductActive: boolean;
    public Price: number;
    public thumb: string;
    public Offer: string;
    public spicylevel: number;
    public instructions: string;
 public Amount: number; 
  public  UnitPrice: number;
  }

  export class OrderDetail {
   public Id: string;
   public Amount: number;
   public Quantity: number;
  public  UnitPrice: number;
  public  Product: Product;
   public total: number;
    constructor() {
      
      this.Product= new Product();
    }
  }
}
  export class OrderViewModel {
    public Id: number;
    public ProdcutName: string;
    public OrderDate: string;
    public DeliveryTime: string;
    public AddressId: string;
    public OrderTotal: string;
    public UserId: string;
    public OrderStatus: string;
    public thumb: string;
    constructor() {
    }
  }
  export class category {
    constructor() {
    }
    public Id: number;
    public Name: string
    public CategoryDescription: string;
    public thumb: string;
    public Items: Product[];
  }
  export class Product {
    constructor() {
    }
    public Id: number;
    public ProdcutName: string
    public ProductDesc: string
    public IsProductActive: boolean;
    public Price: string;
    public thumb: string;
    public Offer: string;
    public spicylevel: number;
    public instructions: string;
  public  UnitPrice: number;public Amount: number;
  }

  export class OrderDetail {
   public Id: string;
   public Amount: number;
   public Quantity: string;
  public  UnitPrice: number;
  public  Product: Product;
   public total: number;
    constructor() {
      this.Product= new Product();
    }
  }
  export class Address {
    public Id: number;
    public Address1: string;
    public Address2: string;
    public Address3: string;
    public City: string;
    public State: string;
    public Country: string;
    public PostalCode: string;
    public UserName: string;
    public IsDefault: boolean;
    constructor() {
    }

  }

  export class Order {
    public Id: number;
    public ProductId: number;
    public UserId: string;
    public Email: string;
    public OrderDate: Date;
    public DeliveryTime: Date;
    constructor() {
    }
  }

  export class UserInfo {
    public Id: string;
    public Email: string;
    public HasRegistered: boolean;
    public LoginProvider: any;
    public PhoneNumber: any;
    public FirstName: string;
    public LastName: string;
    public Addresses: Address[];
    public Orders: OrderViewModel[];
    public minOrder: number;
    public Roles:string[];
    constructor(
    ) {

    }
  }



