import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CategoryPage} from "../category/category";
import {ValuesService} from "../../services/ValuesService";
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  // list of categories
  public categories: any;
public catId:any;

  constructor(public nav: NavController,
	public valuesService: ValuesService) {
    // set sample data
		
    this.valuesService.getAllProducts(this.catId).subscribe(data=> {this.categories=data;},err=>{});
  }

  // view a category
  viewCategory(categoryId:any) {
    this.nav.push(CategoryPage, {id: categoryId});
  }
}
