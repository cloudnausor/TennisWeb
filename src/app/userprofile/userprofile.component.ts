import { Component, OnInit } from '@angular/core';
import { UserComponent } from '../model/user/user.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../shared/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as $ from 'jquery';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent extends UserComponent implements OnInit {

  public res = {
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    postalCode: "",
    User_Level: "",
    User_Team: "",
    address: "",
    User_Image: "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png",
    
  }

  public team_error = false;
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
    this.getUser();
    var titile = document.getElementsByClassName("brand");
    if (titile)
      titile[0].innerHTML = 'MON COMPTE';
  }

  getUser() {
    var team = [];
    var users = JSON.parse(localStorage.getItem("onmytennis"));
    var user = JSON.parse(users);
    var useremail = {
      "User_Email": user.email
    }
    this.spinner.show();
    this.appService.create("/user/getuserbyid", useremail).subscribe((data: any) => {
      if (data.isSuccess == true) {
        this.spinner.hide();
      }
      else {
        this.spinner.hide();
      }
      this.res = data.data.User_list[0];
      if (this.res.User_Image == null) {
        this.res.User_Image = "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png"
      }
      team = data.data.User_list[0].User_Team.split(",");
      if (team.length > 0) {
        for (var i = 0; i < team.length; i++) {
          if (team[i] !== "") {
            var element = <HTMLInputElement>document.getElementById(team[i]);
            element.checked = true;
          }
        }
      }
    });
  }

  onSubmit(res) {
    $('#trans_error').hide();
    $('#cheque_error').hide();
    this.team_error = false;
    var team = "";
    let formInputItem = document.querySelectorAll(".tab-content")[0].querySelectorAll("input");
    formInputItem.forEach(function (inputElement) {
      let mode = inputElement as HTMLInputElement;
      if (mode.type == "checkbox") {
        if (mode.checked == true) {
          let modechild = mode.nextSibling as HTMLElement;
          if (team !== "") {
            team = team + "," + modechild.nodeValue.trim();
          }
          else {
            team = modechild.nodeValue.trim();
          }
        }
      }
    })
    res.User_Team = team;

    if (res.User_Team == "") {
      this.team_error = true;
      $('#team_error').show();
    }

    if (this.team_error == false) {
      this.appService.create('/user/updateprofile', res).subscribe((response) => {
        if (response && response.isSuccess == true) {
          this._showAlertMessage('alert-success', 'Mis à jour avec succés');
        }
        else {
          this._showAlertMessage('alert-danger', 'Échec de la mise à jour');
        }
      })
    }
    else {
      this.spinner.hide()
    }
  }

  makeEnable() {
    $(".form-group :input").prop("readonly", false);
    $(".form-group :input").prop("required", true);
    $("#email").prop("disabled", true);
    $("#submit").prop("readonly", false);
    // this.buttonDisabled = false;
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.propagateChange(reader.result, file, file.type);
    };
    reader.onerror = function (error) {
    };
  }

  propagateChange = (result, file, type) => {
    this.res.User_Image = result;
  };

}
