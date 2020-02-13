import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppService } from '../../shared/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminComponent } from '../../model/admin/admin.component';


@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent extends AdminComponent implements OnInit {

  public hash: string;
  public newAdmin = {
    admin_email: '',
    password: '',
    newpassword: '',
    hash: ''
  }

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
    const hash = this.activatedRoute.snapshot.queryParamMap.get('hash');
    if (hash) {
      var hashkey = hash.replace(/'/g, "").toString()
      this.newAdmin.hash = hashkey;
    }
  }

  onSubmitReset(){
    this.spinner.show();
    console.log(this.newAdmin);
    if (this.newAdmin.password == this.newAdmin.newpassword) {
      this.appService.create('/admin/resetPassword', this.newAdmin).subscribe((val) => {
        if (val.isSuccess == true) {
          this.spinner.hide();
          this._showAlertMessage('alert-success', 'Réinitialisation réussie, vérifiez votre courrier');
        }
        else {
          this.spinner.hide();
          this._showAlertMessage('alert-danger', 'La réinitialisation a échoué');
        }
      })
    } else {
      this._showAlertMessage('alert-danger', 'Le mot de passe ne correspond pas, veuillez réessayer.');
      this.spinner.hide();
    }
    
  }
}
