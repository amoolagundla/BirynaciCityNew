import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {
    ValuesService
} from '../../services/ValuesService';
import {
    
    AlertController,
    NavParams
    
} from 'ionic-angular';


import {  UserInfo } from '../../app/app.module';

import { SharedDataService } from '../../services/sharedDataService';

/*
  Generated class for the OrderDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html'
})
export class OrderDetailsPage {

 public orderViewModel:any[];
    public orderInfo:any;
    public ifsys:boolean=false;
    public userInfo:UserInfo=null;
  constructor(public nav: NavController, public navCtrl: NavController,public storage: Storage,public valService:ValuesService,public alrt:AlertController,public navParams:NavParams
  , public _SharedDataService: SharedDataService) {
	
	this.orderInfo = this.navParams.get('id');

   this._SharedDataService.UserInfo.subscribe((data)=>
			{
				
				this.userInfo=data;
        if(this.userInfo.Email =='sys@gmail.com')
          {
            this.ifsys=true;
          }
			});
        
   this.valService.getUserOrderDetails(this.orderInfo.OrderId).subscribe((data:any) => 
   {
          this.orderViewModel=data;
          
      
   },(err:any) =>
   {
             this.nav.pop();
   });


           
		
	
	}
OrderPicked()
{
  this.valService.UpdateOrder(this.orderInfo.OrderId,"4").subscribe((data:any) => 
   {
           let alert = this.alrt.create({
                            title: 'Order ',
                            subTitle: 'Notified',
                            buttons: ['Dismiss']
                        });
                        alert.present();
   },err=>
   {
             
   })
}
  NotifyUser()
  {
    this.valService.UpdateOrder(this.orderInfo.OrderId,"1").subscribe((data:any) => 
   {
           let alert = this.alrt.create({
                            title: 'Order ',
                            subTitle: 'Notified',
                            buttons: ['Dismiss']
                        });
                        alert.present();
   },err=>
   {
             
   });
  }

}
