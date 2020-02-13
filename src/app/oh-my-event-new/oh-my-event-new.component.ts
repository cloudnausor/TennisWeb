import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../shared/app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AppComponent } from "../app.component";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: "app-oh-my-event-new",
  templateUrl: "./oh-my-event-new.component.html",
  styleUrls: ["./oh-my-event-new.component.scss"]
})
export class OhMyEventNewComponent extends AppComponent implements OnInit {
  public min = new Date();
  public date: any = "";
  public respon: any;
  public search = {
    course: "",
    date: "",
    session: "",
    ville: "",
    rayon: ""
    
  };
  registerForm: FormGroup;
    submitted = false;
  public service: any;
  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    appService: AppService,
    location: Location,
    spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) {
    super(activatedRoute, router, appService, location, spinner);
  }
  ngOnInit() {
    this.getcoach();
    //this.findCoach();
    this.registerForm = this.formBuilder.group({
      CodePostal: ['', Validators.required],
   
   
   
    })
  }

  getcoach() {
    this.spinner.show();
    var date = sessionStorage.getItem("Date");
    const ville = {
      ville: sessionStorage.getItem("Ville"),
      date: sessionStorage.getItem("Date")
    };
    this.search.ville = sessionStorage.getItem("Ville");
    this.search.date = sessionStorage.getItem("Date");
    this.date = sessionStorage.getItem("Date");
    this.appService
      .getAll("/coach/getcoachbycity", this.search)
      .subscribe(data => {
        if (data && data["data"]) {
          this.respon = (data as any).data.coach_list;
          //console.log(this.respon)
          this.spinner.hide();
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
  onSubmit() {
    this.submitted = true;
  
    // stop the process here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
  
    alert('SUCCESS!!');
  }
  
}

