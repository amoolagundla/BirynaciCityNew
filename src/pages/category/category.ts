import {Component} from '@angular/core';
import {NavController, AlertController,NavParams} from 'ionic-angular';
import {CartPage} from '../../pages/cart/cart';
import { CartService} from '../../services/cart-service';
import {ItemPage} from "../item/item";
import {model } from '../../app/app.module';
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {
  // category object
  public category: any;
    private showList: boolean;
public catId:any;
public cartCount:any;
public productName:any='';
 public product: any = '';
    public products: any=[];
     public filteredProducts: any=[];
  constructor(public nav: NavController,public navParams: NavParams
	, public alertController: AlertController,
  public cartService:CartService) {
    // get first category as sample data
			this.category =JSON.parse(this.navParams.get('Id'));	
      this.productName=JSON.parse(this.navParams.get('Name'));	
this.initializeItems();
 let cart = this.cartService.getCart();
            this.cartCount=cart.length;
this.cartService
        .statusChanged
        .subscribe((data:any) => {
					this.cartCount =data.totalCount;		
              
        });
				
  }

  // view item detail
  viewItem(item:any) {
   
  }

  initializeItems() {
    this.products=[];
    this.products= this.category;
    
  }
    getCatogoriesProductName(ev:any) {
     
      // Show the results
    this.showList = true;
      

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
        this.filteredProducts = this.products.filter(
          (book:any) => book.ProdcutName.toLowerCase().indexOf(val.toLowerCase()) > -1);
    
    }
    else
    {
        this.filteredProducts = this.products;
    }
       

    }
    onCancel(ev:any) {
       
         // Show the results
    this.showList = false;
    
     // Reset the field
    ev.target.value = '';
  
    }

	// add item to cart
  addCart(item:any) {
    let order = new model.OrderDetail();
        order.Product= item;
        order.Quantity=1;
             this.nav.push(ItemPage, {item: JSON.stringify(order)});
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
}
