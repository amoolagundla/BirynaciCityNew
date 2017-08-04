import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ValuesService } from '../../services/ValuesService';


import {  UserInfo } from '../../app/app.module';
import { SharedDataService } from '../../services/sharedDataService';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {
  public url: string = 'assets/img/4.jpg';
  public name: string = '';
  public userInfo: UserInfo= new UserInfo();
 
  constructor(public nav: NavController, public valService: ValuesService, 
    public _SharedDataService: SharedDataService) {


    this._SharedDataService.UserInfo.subscribe((data) => {

      this.userInfo = data;
       console.log(this.userInfo);
    });   
    

  }

  saveProfile() {
   
    this.valService.UpdateProfile(this.userInfo).subscribe(
      data => {
      
        this.valService.UpdateUserInfo(this.userInfo);
        localStorage.setItem('UserInfo', JSON.stringify(this.userInfo));
        this.nav.pop();
        this.nav.setRoot(SettingPage);
      },
      error => {
       
        this.nav.pop(); 
        this.nav.setRoot(SettingPage);
      });
  }
}
