import {Component} from '@angular/core';
import {NavController, AlertController,NavParams} from 'ionic-angular';
import { CartService} from '../../services/cart-service';
import {model } from '../../app/app.module';

/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage {
  // item object
  public item: model.OrderDetail=new model.OrderDetail();
 public spicylevel:number=0;
 public total :number=0;
 public instructions:string='';
  constructor(public nav: NavController, public cartService:CartService, public alertController: AlertController,public navParams: NavParams) {
    // get sample data for item
		 this.item = 	JSON.parse(this.navParams.get('item'));
		   this.total = this.item.Quantity * this.item.Product.Price;
        }

 plusQty()
 {
  this.item.Quantity ++;
    this.total = this.item.Quantity * this.item.Product.Price;
 }

 minusQty()
 {
   if(this.item.Quantity!=0)
   this.item.Quantity --;
     this.total = this.item.Quantity * this.item.Product.Price;
 }

 	// add item to cart
  addCart(product:any) {
	
   this.cartService.addCartItem(this.item);
               this.nav.pop();
  }
}
