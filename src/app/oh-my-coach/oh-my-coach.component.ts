import { Component, OnInit, ɵConsole, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { AppService } from "../shared/app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AppComponent } from "../app.component";
import { Location } from "@angular/common";
//import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as _ from "underscore";
import * as $ from "jquery";
import * as L from "leaflet";

@Component({
  selector: "app-oh-my-coach",
  templateUrl: "./oh-my-coach.component.html",
  styleUrls: ["./oh-my-coach.component.scss"]
})
export class OhMyCoachComponent extends AppComponent implements OnInit {
  public min = new Date();
  public date: any = "";
  public respon: any;
  showMyMap: boolean = true;
  showMapCSS: string = "none";
  public search: any = {
    date: "",
    ville: "",
    rayon: "0",
    course: ""
  };
  //public latlongcurrent: any;
  map: any;
  mapvalues: any;
  lat: any;
  lang: any;
  curentlat: any;
  curentlang: any;
  co_or_gps: any;
  numbers = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20
  ];
  public service: any;

  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    appService: AppService,
    location: Location,
    spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer
  ) {
    super(activatedRoute, router, appService, location, spinner);
  }
  ngOnInit() {
    this.getcoach();
  }

  ngAfterViewInit(): void {
    var pcode = localStorage.getItem("onmytennis");
    if (!pcode) {
      this.getcurrentcordinates();
    }
    $(".mapsection")
      .delay(1000)
      .fadeIn(500);
  }

  getcoach() {
    this.spinner.show();
    //var date = sessionStorage.getItem("Date");
    // this.search.ville = sessionStorage.getItem("postalCode");

    // const ville = {
    //   ville: sessionStorage.getItem("Ville"),
    //   date: sessionStorage.getItem("Date")
    // };

    // if (ville == null) {
    //   var pcode = localStorage.getItem("onmytennis");
    //   if (pcode) {
    //     var postalCode = JSON.parse(JSON.parse(pcode));
    //     this.search.ville = postalCode.postalCode;
    //   }
    // } else {
    //   this.search.ville = sessionStorage.getItem("Ville");
    // }
    // //this.search.ville = sessionStorage.getItem('Ville');
    // this.search.date = sessionStorage.getItem("Date");
    // this.date = sessionStorage.getItem("Date");

    var pcode = localStorage.getItem("onmytennis");
    if (pcode) {
      var postalCode = JSON.parse(JSON.parse(pcode));
      this.search.ville = postalCode.postalCode;

      //Getting Gelocation based on POstal Code and Display the Map
      this.appService
        .getAll("/coach/geolocationByPostalCode/" + this.search.ville)
        .subscribe(data => {
          if (data && data["data"]) {
            this.co_or_gps = data["data"].coordonnees_gps;
            var splited_gps = this.co_or_gps.split(",");
            this.displayLoadedMap(splited_gps[0], splited_gps[1], 0);
          }
        });
    } // End of pcode if it is present
    this.appService
      .getAll("/coach/searchByCoach", this.search)
      .subscribe(data => {
        if (data && data["data"]) {
          this.allItems = (data as any).data.coach_list;
          //console.log(this.respon)
          this.spinner.hide();
          this.setPage(1);
        }
      });
  }

  findCoach(search) {
    this.spinner.show();
    localStorage.setItem("Course", search.course);
    if (this.date != "") search.date = this.formatDate(this.date);
    this.appService.getAll("/coach/findyourCoach", search).subscribe(data => {
      if (data && data["data"]) {
        this.respon = (data as any).data.coach_list;
        this.spinner.hide();
      }
    });
  }

  removeLastComma(str) {
    return str.replace(/,(\s+)?$/, "");
  }

  onFilterChange(eve: any) {
    console.log(eve);
    this.search.individual = !this.search.individual;
  }

  searchByCoach(search) {
    //event.preventDefault();
    console.log(search);
    this.spinner.show();

    if (search.ville != "") {
      let selectorVilleID = document.querySelector("#ville") as HTMLElement;
      selectorVilleID.style.border = "";
    } else {
      let villeID = document.getElementById("ville") as HTMLElement;
      villeID.setAttribute("tabIndex", "-1");
      villeID.focus();
      let selectorVilleID = document.querySelector("#ville") as HTMLElement;
      selectorVilleID.style.border = "1px solid red";

      // //Ryan Code Starts Here
      // console.log("Ryan ID - " +search.ryan);
      // console.log('Type OF TOP'+ typeof search.ryan);

      // if(parseInt(search.ryan)>=0 && parseInt(search.ryan)<=20)
      // {
      //     console.log("Ryan ID IF - " +search.ryan);
      //     console.log('Type OF IF'+ typeof search.ryan);
      //     let selectorRyanID = document.querySelector("#ryan") as HTMLElement;
      //     selectorRyanID.style.border = "";
      // }
      // else
      // {
      //     console.log('Type OF ELSE'+ typeof search.ryan);
      //     console.log("Ryan ID ELSE - " +search.ryan);
      //     //let ryanID = document.getElementById("ryan") as HTMLElement;
      //     //ryanID.setAttribute("tabIndex", "-2");
      //     //ryanID.focus();
      //     let selectorRyanID = document.querySelector("#ryan") as HTMLElement;
      //     selectorRyanID.style.border = "1px solid red";
      // }
      // //Ryan Code Ends Here

      this.spinner.hide();
      window.scroll({
        top: 400,
        left: 0,
        behavior: "smooth"
      });
      return;
    }

    //return;

    //Getting Gelocation based on POstal Code and Display the Map
    this.appService
      .getAll("/coach/geolocationByPostalCode/" + search.ville)
      .subscribe(data => {
        console.log(data);
        if (data && data["data"]) {
          if (data["data"].coordonnees_gps.length > 0) {
            this.co_or_gps = data["data"].coordonnees_gps;
            var splited_gps = this.co_or_gps.split(",");
            this.displayLoadedMap(splited_gps[0], splited_gps[1], search.rayon);
          } else {
            // If the Geo Co-Ordinates are available the load the Current Location Map
            this.getcurrentcordinates();
          }
        }
      });
    this.appService.getAll("/coach/searchByCoach", search).subscribe(data => {
      if ((data as any).isSuccess == true) {
        this.allItems = (data as any).data.coach_list;
        console.log("ohmytennisnew -- searchByCoach 217", this.allItems);
        this.spinner.hide();
        if (this.allItems.length > 0) {
          this.pager.totalPages = this.allItems.length;
          console.log(this.pager.totalPages);
          this.setPage(1);
        } else {
          this.pager.totalPages = this.allItems.length;
          this.pagedItems = [];
          this.setPage(1);
        }
        window.scroll({
          top: 400,
          left: 0,
          behavior: "smooth"
        });
      }
    });
    //this.showMyMap = !this.showMyMap;
  }

  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 4) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 1 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  setPage(page: number) {
    //console.log("page ", page);
    //console.log("this.pager.totalPages ", this.pager.totalPages);
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    console.log("ohmytennisnew -- setPage 284", page);
    // get pager object from service
    this.pager = this.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    window.scroll({
      top: 400,
      left: 0,
      behavior: "smooth"
    });
    //console.log("set page ", this.pagedItems);
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  gotoCouch(ser, res) {
    if (localStorage.getItem("onmytennis") !== null) {
      var data = JSON.stringify(res);
      localStorage.setItem("Coach", data);
      localStorage.setItem("Course", ser);
      this.router.navigate(["/coachdetail"]);
    } else {
      this.router.navigate(["/login"]);
    }
  }

  goToCouchDetail(id) {
    this.router.navigate(["coach-detail-new"], {
      queryParams: { id }
    });
  }

  async getcurrentcordinates() {
    const resp = await fetch("https://ipapi.co/json/");
    const data = await resp.json();
    this.curentlat = data.latitude.toFixed(3);
    this.curentlang = data.longitude.toFixed(3);
    console.log(this.curentlat, " ", this.curentlang);
    //return
    this.displayLoadedMap(this.curentlat, this.curentlang, 0);
  }

  displayLoadedMap(latitude, longitude, radius) {
    console.log("latitude - " + latitude);
    console.log("longitude - " + longitude);
    if (this.map) {
      console.log("Got longitude - " + longitude);
      this.map.remove();
      $("#map").html("");
      $(".map-frame").empty();
      $('<div id="map" style="height: 385px;"></div>').appendTo(".map-frame");
    }

    this.mapvalues = eval("[" + latitude + "," + longitude + "]");
    this.lat = latitude;
    this.lang = longitude;
    console.log("Map Values" + this.mapvalues);

    this.map = L.map("map", {
      center: this.mapvalues,
      zoom: 15
    });
    //return;

    //Adding the Circle to the Map

    L.circle([this.lat, this.lang], {
      color: "orange",
      fillColor: "#FFA500",
      fillOpacity: 0.5,
      radius: radius * 10
    }).addTo(this.map);

    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 25
      }
    );

    tiles.addTo(this.map);
    var greenIcon = L.icon({
      iconUrl: "../assets/images/marker-icon.png",
      iconSize: [38, 95],
      iconAnchor: [22, 94]
    });

    L.marker([this.lat, this.lang], { icon: greenIcon }).addTo(this.map);
    //.openPopup();
  }

  toogleData() {
    this.showMyMap = !this.showMyMap;
    if (this.showMyMap == false) {
      $(".mapsection").hide();
    } else {
      //$(".mapsection").load(location.href + " .mapsection");
      $(".mapsection")
        .delay(500)
        .fadeIn(1000);
    }
  }
}
