import {
    EventEmitter,
    Injectable
} from '@angular/core';

import {model } from '../app/app.module';
@Injectable()
export class CartService {
    private cart: model.OrderDetail[] = [];
    public statusChanged = new EventEmitter < {
        type: string;totalCount: number
    } > ();


    getCart(): model.OrderDetail[] {

        return this.cart;
    };

    addCartItem(pizza: model.OrderDetail): void {
        let count:number =0;
    this.cart.forEach((cart:model.OrderDetail)=>
    {
        if(cart.Product.ProdcutName== pizza.Product.ProdcutName)
        {
            cart.Quantity =pizza.Quantity;
            count=1;
        }

    });
    if(count==0)
    {
            this.cart.push(pizza);
    }
	this.statusChanged.emit({
            type: 'add',
            totalCount: this.cart.length
        });
    };
    ClearCart() {
        this.cart = [];
        this.statusChanged.emit({
            type: 'remove',
            totalCount: this.cart && this.cart.length ? this.cart.length : 0
        });
    }
    removeCartItem(index:any): void {
        this.cart.splice(index, 1);
        this.statusChanged.emit({
            type: 'remove',
            totalCount: this.cart && this.cart.length ? this.cart.length : 0
        });
        //	return this.cart;
    };

    calcTotalSum(): number {
        let sum = 0;

        if(!this.cart || !this.cart.length) {
            return sum;
        }
this.cart.forEach((cat:model.OrderDetail)=>
{
     sum = sum + (cat.Product.Price * cat.Quantity);

});
       

        return sum;
    }
}