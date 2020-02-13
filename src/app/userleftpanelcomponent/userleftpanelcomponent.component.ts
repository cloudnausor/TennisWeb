import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
/* [ Spinner ] */
import { NgxSpinnerService } from 'ngx-spinner';
import { UserComponent } from '../model/user/user.component';
import { AppService } from '../shared/app.service';

@Component({
  selector: 'app-userleftpanelcomponent',
  templateUrl: './userleftpanelcomponent.component.html',
  styleUrls: ['./userleftpanelcomponent.component.scss']
})
export class UserleftpanelcomponentComponent extends UserComponent implements OnInit {

 
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

  public username: any;
  public image = "https://www.w3schools.com/howto/img_avatar.png";

  capitalizeFLetter(name) { 
    return name[0].toUpperCase() +  
    name.slice(1); 
  } 
  ngOnInit() {
    var coach = JSON.parse(localStorage.getItem("onmytennis"));
    if (coach) {
      var coach1 = JSON.parse(coach);
      if (coach1.roleId == 1) {
        this.spinner.show();
        var useremail = {
          User_Email: coach1.email
        }
        this.appService.create("/user/getuserbyid", useremail).subscribe((data: any) => {
          if (data.isSuccess == true) {
            this.image = data.data.User_list[0].User_Image;
            if(this.image==null) {
             
              this.image="https://www.w3schools.com/howto/img_avatar.png"
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
            this.image = data.data.coach_list[0].Coach_Image;
            if(this.image == null)
            this.image = "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png";
            console.log(this.image)
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

  leftPanel() {
    return [{
      title : 'TABLEAUX DE BORD',
      path: '/' + this._const('PATH.USERS.SELF') + '/' + this._const('PATH.USERS.DASHBOARD.SELF'),
      iclass: 'fa fa-th-large',
      style: false,
    }, {
      title : 'MON COMPTE',
      path: '/' + this._const('PATH.USERS.SELF') + '/' + this._const('PATH.USERS.PROFILE.SELF'),
      iclass: 'fa fa-user-o',
      style: false,
    }, {
      title : 'MES RESERVATION',
      path: '/' + this._const('PATH.USERS.SELF') + '/' + this._const('PATH.USERS.RESERVATION.SELF'),
      iclass: 'fa fa-ticket',
      style: false,
    }, {
      title : 'NOTIFICATIONS',
      path: '/' + this._const('PATH.USERS.SELF') + '/' + this._const('PATH.USERS.NOTIFICATION.SELF'),
      iclass: 'fa fa-bell',
      style: false,
    }, {
      title : 'AVIS ET COMMENTAIRES',
      path: '/' + this._const('PATH.USERS.SELF') + '/' + this._const('PATH.USERS.REVIEWS.SELF'),
      iclass: 'fa fa-comments',
      style: false,
    }, {
      title : 'PARTENAIRE',
      path: '/' + this._const('PATH.USERS.SELF') + '/' + this._const('PATH.USERS.PARTNER.SELF'),
      iclass: 'fa fa-handshake-o',
      style: true,
    }, {
      title : 'SPARRING',
      path: '/' + this._const('PATH.USERS.SELF') + '/' + this._const('PATH.USERS.SPARRING.SELF'),
      iclass: 'fa fa-cogs',
      style: true,
    }, {
      title : 'CHANGER LE MOT DE PASSE',
      path: '/' + this._const('PATH.USERS.SELF') + '/' + this._const('PATH.USERS.CHANGEPASSWORD.SELF'),
      iclass: 'fa fa-key',
      style: false,
    }, {
      title : 'DÉCONNEXION',
      path: '/' + this._const('PATH.USERS.SELF') + '/' + this._const('PATH.USERS.SINOUT.SELF'),
      iclass: 'fa fa-sign-out',
      style: false,
    }];
  }
}