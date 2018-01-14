import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { ValuesService } from '../../services/ValuesService';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
declare var google: any;

/*
  Generated class for the Tracking page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tracking',
  templateUrl: 'tracking.html'
})
export class TrackingPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any; addreddId: any;
  public orderViewModel: any[];
  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  public currentAddress: any = '';
  public distance: number = 0;
  public trackingItem: any = [];
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private googleMaps: GoogleMaps,
    public platform: Platform,
    public geolocation: Geolocation,
    private launchNavigator: LaunchNavigator,
    public backgroundGeolocation: BackgroundGeolocation,
    public zone: NgZone,
    public valService: ValuesService,

    private nativeGeocoder: NativeGeocoder) {
    this.getlocation().then((resp) => {
      this.currentAddress = resp.coords.latitude + ',' + resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
    
    this.valService.getUserOrders(null).subscribe((data: any[]) => {
      this.orderViewModel = data.filter
        ((item: any) => item.OrderAddress != null && item.OrderStatus!=4);

    });


  }

  getDistance(item: any) {
    this.valService.googleDistanceMatrix(this.currentAddress, item.OrderAddress,item.OrderId).subscribe((data: any) => {

      if (data== 'near') {
         this.stopTracking();
      }
    });
  }
  launch(address: any) {  


      this.getDistance(address);
      this.startTracking();
      this.trackingItem = address;
      let options: LaunchNavigatorOptions = {
        start: this.currentAddress,
        app: this.launchNavigator.APP.GoogleMaps
      };

      this.launchNavigator.navigate(address.OrderAddress, options)
        .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
        );

   
  }

  getlocation() {
    return this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
  }


  startTracking() {

    // Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 10000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      this.getlocation().then((resp) => {
        this.currentAddress = resp.coords.latitude + ',' + resp.coords.longitude;

        this.getDistance(this.trackingItem);
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

      });

    });

  }

  stopTracking() {

    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();

  }
}
