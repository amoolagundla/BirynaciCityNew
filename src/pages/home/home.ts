
import { Component, OnInit } from '@angular/core';
import {
    NavController,
    AlertController,
    NavParams
} from 'ionic-angular';
import {
    LoadingController
} from 'ionic-angular';
import {
    CartPage
} from '../../pages/cart/cart';
import {
    ValuesService
} from '../../services/ValuesService';
import {
    CategoryPage
} from "../category/category";
import {
    CartService
} from '../../services/cart-service';
import {ItemPage} from "../item/item";
import {
    Storage
} from '@ionic/storage';
import { Http } from '@angular/http';
import {  UserInfo } from '../../app/app.module';
import { SharedDataService } from '../../services/sharedDataService';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import {model } from '../../app/app.module';
declare var $: any;
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage implements OnInit {

    // list of categories
public userInfo:UserInfo;
    public loading: any = this.loadingCtrl.create({
        content: "",
        dismissOnPageChange: true
    });
    private showList: boolean;
    public myVar: boolean = true;
    public categories: any;
    public cartCount: any = 0;
    public abc: any;
    public email: any = 'sys';
    public product: any = '';
    public products: any = [];
    public filteredProducts: any = [];
    

    ngOnInit() {

         

        this.showList = false;
        this.cartService
            .statusChanged
            .subscribe((data:any) => {
                this.cartCount = data.totalCount;


            }, (err:any) => {

            });


        let cart = this.cartService.getCart();
        this.cartCount = cart.length;


        this.getCatogories();

        this.email = this.navParams.get('email');

        this._SharedDataService.UserInfo.subscribe((data)=>
			{
				
				this.userInfo=data;
			});
        // subscribe to cart changes

    }
    constructor(public loadingCtrl: LoadingController,
        public nav: NavController,
        private valuesService: ValuesService,
        private cartService: CartService,
        public storage: Storage,
        public alertController: AlertController,
         public navParams: NavParams,
        public _SharedDataService: SharedDataService,
        private http: Http,
         public geolocation: Geolocation) { 
         //    this.CheckLocation();
           this.getCategoriesInBackGround();
             this._SharedDataService.getUserInfo();

        }

    CheckLocation()
    {
         this.loading.present();

          this.getlocation().then((resp) => {
      this.valuesService.CheckLocation(resp.coords.latitude , resp.coords.longitude).subscribe((data:any)=>
      {
          if(data ==" ")
          {
              this.myVar=true;
          }
            
        
      });
    }).catch((error) => {
        this.loading.dismiss();
    }); 
    }

 getlocation() {
    return this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
  }
    // add item to cart
    addCart(item: any) {
        let order = new model.OrderDetail();
        order.Product= item;
        order.Quantity=1;
             this.nav.push(ItemPage, {item: JSON.stringify(order)});
    }

    public postfbTokens(token: any) {
        this.loading.present();
        this.valuesService.PostFacebookTokens(token)
            .subscribe(
            data => {

                this.loading.dismiss();

            },
            error => {
                this.loading.dismiss();

            });
    }
    getCatogories() {
         this.loading.present();
        this.http.get("categories.json") .subscribe(res => 
        {
            this.categories = res.json();
            this.initializeItems();
            this.loading.dismiss();
        });
    }
    initializeItems() {
        this.products = [];
        this.categories.forEach((element:any) => {
            element.Items.forEach((item:any) => {
                this.products.push(item);
            });
        });


    }
    getCategoriesInBackGround()
    {
       
            this.valuesService.getAllCategories()
                .subscribe(
                data => {
                    this.categories = data;
                   
                },
                error => {
                });
      
    }
    getCatogoriesProductName(ev:any) {

        // Show the results
        this.showList = true;

        this.myVar = false;
        // set val to the value of the searchbar
        let val = ev.target.value;

        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.filteredProducts = this.products.filter(
                (book:any) => book.ProdcutName.toLowerCase().indexOf(val.toLowerCase()) > -1);

        }
        else {
            this.filteredProducts = this.products;
        }


    }
    onCancel(ev:any) {
        this.myVar = true;
        // Show the results
        this.showList = false;

        // Reset the field
        ev.target.value = '';
        console.log("cancelled clicked");
    }
    doRefresh(refresher:any) {

        this.valuesService.getAllCategories()
            .subscribe(
            data => {
                refresher.complete();
                this.storage.set('categories', JSON.stringify(data)).then((categories:any) => {
                    this.categories = data;
                }, (error:any) => {

                });
            }, error => {
                refresher.complete();
                this.loading.dismiss();
            });
    }

    GoToCart() {
        if (this.cartCount != 0)
            this.nav.push(CartPage);
        else {
            let alert = this.alertController.create({
                title: 'Cart ',
                subTitle: 'Cart Empty',
                buttons: ['Dismiss']
            });
            alert.present();
        }
    }
    // view a category
    ViewCategory(categoryId:any, name:any) {

        this.nav.push(CategoryPage, {
            Id: JSON.stringify(categoryId),
            Name: JSON.stringify(name)
        });
    }
}