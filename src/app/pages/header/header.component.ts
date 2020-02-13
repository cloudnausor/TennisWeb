import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppService } from '../../shared/app.service';
import { AppComponent } from '../../app.component';
/* [ Spinner ] */
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends AppComponent implements OnInit {

  public username: any;
  public image = 'https://www.w3schools.com/howto/img_avatar.png';
  public roleid :any =1;
  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    appService: AppService,
    location: Location,
    spinner: NgxSpinnerService
  ) {
    super(
      activatedRoute,
      router,
      appService,
      location,
      spinner
    );
  }

  ngOnInit() {
    var coach = JSON.parse(localStorage.getItem("onmytennis"));
    if (coach) {
      var coach1 = JSON.parse(coach);
      this.roleid = coach1.roleId;
      if (coach1.roleId == 1) {

        this.spinner.show();
        var useremail = {
          User_Email: coach1.email
        }
        this.appService.create("/user/getuserbyid", useremail).subscribe((data: any) => {
          if (data.isSuccess == true) {
            this.image = data.data.User_list[0].User_Image;
            if (this.image == "" || this.image == null) {
              this.image = 'https://www.w3schools.com/howto/img_avatar.png';
            }
            this.spinner.hide();
          }
          else {
            this.spinner.hide();
          }
        })
      } else if (coach1.roleId == 2) {
        this.spinner.show();
        var Coach_Email = {
          Coach_Email: coach1.Coach_Email
        }
        this.appService.create("/coach/getcoachbyid", Coach_Email).subscribe((data: any) => {
          if (data.isSuccess == true) {
            if(data.data.coach_list)
            this.image = data.data.coach_list[0].Coach_Image;
            if (this.image == "" || this.image == null) {
              this.image = 'https://www.w3schools.com/howto/img_avatar.png';
            }
            this.spinner.hide();
          }
          else {
            this.spinner.hide();
          }
        })
      }
      if (coach1.firstName + " " + coach1.lastName)
        this.username = this.capitalizeFLetter(coach1.firstName + " " + coach1.lastName);
    }
  }

  capitalizeFLetter(name) {
    return name[0].toUpperCase() +
      name.slice(1);
  }

}
