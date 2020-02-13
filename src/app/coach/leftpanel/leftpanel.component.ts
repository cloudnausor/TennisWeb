import { Component, OnInit, AfterViewChecked, Input } from "@angular/core";
import { Location } from "@angular/common";
import { BrowserModule, Title, Meta } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AppService } from "../../shared/app.service";
import { CoachComponent } from "./../../model/coach/coach.component";
/* [ Spinner ] */
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from "jquery";
@Component({
  selector: "app-leftpanel",
  templateUrl: "./leftpanel.component.html",
  styleUrls: ["./leftpanel.component.scss"]
})
export class LeftpanelComponent extends CoachComponent implements OnInit {
  public navActiveIndex = 0;
  public username: any;
  public image = "https://www.w3schools.com/howto/img_avatar.png";
  public res = [];
  public resStage = [];
  tournList = [];
  stageList = [];
  animationList = [];
  message: string;

  constructor(
    activatedRoute: ActivatedRoute,
    router: Router,
    appService: AppService,
    location: Location,
    spinner: NgxSpinnerService
  ) {
    super(activatedRoute, router, appService, location, spinner);
  }

  ngOnInit() {
    // let url: string = this.router.url.substring(
    //   0,
    //   this.router.url.indexOf("?")
    // );
    // console.log(url);
    var coach = JSON.parse(localStorage.getItem("onmytennis"));
    if (coach) {
      var coach1 = JSON.parse(coach);
      if (coach1.roleId == 2) {
        this.spinner.show();
        var Coach_Email = {
          Coach_Email: coach1.email
        };
        var coachid = {
          coachId: coach1.id
        };
        this.appService
          .create("/coach/getcoachbyid", Coach_Email)
          .subscribe((data: any) => {
            //console.log("data", data);
            if (data.isSuccess == true) {
              this.appService
                .getAll("/course/gettournamentcourse", coachid)
                .subscribe(response => {
                  if ((response as any).data.course.length > 0) {
                    if (response && response["data"]) {
                      this.res = (response as any).data.course;
                      let tourData = this.res.map(value => {
                        return {
                          title: value.Tournamentname,
                          tourn_id: value.id,
                          coach_id: value.Coach_Id,
                          iclass: "fa fa-th-large",
                          style: false,
                          path: "/coach/Tounamentedit"
                        };
                      });
                      this.tournList = tourData;
                      //console.log("data1", tourData);
                    }
                  }
                });

              this.appService
                .getAll("/course/getstagecourse", coachid)
                .subscribe(response => {
                  if ((response as any).data.course.length > 0) {
                    if (response && response["data"]) {
                      this.resStage = (response as any).data.course;
                      let stageData = this.resStage.map(value => {
                        return {
                          title: value.Eventname,
                          stage_id: value.id,
                          coach_id: value.Coach_Id,
                          iclass: "fa fa-th-large",
                          style: false,
                          path: "/coach/Stage"
                        };
                      });
                      this.stageList = stageData;
                      //console.log("data1", this.stageList);
                    }
                  }
                });

              this.appService
                .getAll("/course/getAnimationCourseLeft", coachid)
                .subscribe(response => {
                  if ((response as any).data.course.length > 0) {
                    if (response && response["data"]) {
                      this.resStage = (response as any).data.course;
                      let animationData = this.resStage.map((value, key) => {
                        return {
                          title: "Animation-" + (key + 1),
                          stage_id: value.id,
                          coach_id: value.Coach_Id,
                          iclass: "fa fa-th-large",
                          style: false,
                          path: "/coach/Stage"
                        };
                      });
                      this.animationList = animationData;
                      //console.log("data1", this.animationList);
                    }
                  }
                });
              if (data.data.coach_list) {
                this.image = data.data.coach_list[0].Coach_Image;
                if (this.image == null) {
                  this.image =
                    "https://www.cmcaindia.org/wp-content/uploads/2015/11/default-profile-picture-gmail-2.png";
                }
              }
              this.spinner.hide();
            } else {
              this.spinner.hide();
            }
          });
      }
      if (coach1.firstName + " " + coach1.lastName)
        this.username = this.capitalizeFLetter(
          coach1.firstName + " " + coach1.lastName
        );
    }
  }

  editTournament(id, coachId) {
    event.preventDefault();
    this.spinner.show();
    this.router
      .navigateByUrl("/coach/Tounament", { skipLocationChange: true })
      .then(() => {
        this.router.navigate(["/coach/Tounamentedit/"], {
          queryParams: { tourn_id: id, coach_id: coachId }
        });
      });

    this.spinner.hide();
  }

  editStage(id, coachId) {
    event.preventDefault();
    this.spinner.show();
    this.router
      .navigateByUrl("/coach/Stage", { skipLocationChange: true })
      .then(() => {
        this.router.navigate(["/coach/Stageedit/"], {
          queryParams: { stage_id: id, coach_id: coachId }
        });
      });

    this.spinner.hide();
  }

  editAnimation(event: Event, id, coachId) {
    event.preventDefault();
    this.spinner.show();
    this.router
      .navigateByUrl("/coach/Animation", { skipLocationChange: true })
      .then(() => {
        this.router.navigate(["/coach/Animationedit/"], {
          queryParams: { animation_id: id, coach_id: coachId }
        });
      });

    this.spinner.hide();
  }

  capitalizeFLetter(name) {
    return name[0].toUpperCase() + name.slice(1);
  }

  redirectMenu(link: any) {
    console.log(link);
    alert(link);
  }

  leftPanel() {
    return [
      {
        title: "TABLEAUX DE BORD",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.DASHBOARD.SELF"),
        iclass: "fa fa-th-large",
        style: false
      },
      {
        title: "MON COMPTE",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.PROFILE.SELF"),
        iclass: "fa fa-user-o",
        style: false
      },
      {
        title: "MON CALENDRIER",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.MY_CALENDER.SELF"),
        iclass: "fa fa-calendar",
        style: false
      },
      {
        title: "MES RESERVATIONS",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.RESERVATION.SELF"),
        iclass: "fa fa-user-o",
        style: false
      },
      {
        title: "COURS INDIVIDUEL",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.INDIVIDUAL_COURSE.SELF"),
        iclass: "fa fa-calendar",
        style: false
      },
      {
        title: "COURS COLLECTIF <br>ONDEMAND",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.COURSECOLLECTION.SELF"),
        iclass: "fa fa-pencil-square-o",
        style: true
      },
      {
        title: "COURS COLLECTIF <br> CLUB",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.COURSECLUB.SELF"),
        iclass: "fa fa-building-o",
        style: true
      },
      {
        title: "STAGE",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.STAGE.SELF"),
        iclass: "fa fa-clock-o",
        style: false
      },
      {
        title: "TEAM BUILDING",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.TEAMBUILDING.SELF"),
        iclass: "fa fa-users",
        style: false
      },
      {
        title: "ANIMATIONS",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.ANIMATION.SELF"),
        iclass: "fa fa-cog",
        style: false
      },
      {
        title: "TOURNOI",
        path:
          "/" +
          this._const("PATH.COACH.SELF") +
          "/" +
          this._const("PATH.COACH.TOURNAMENT.SELF"),
        iclass: "fa fa-trophy",
        style: false
      },
      {
        title: "COMMENTAIRES",
        path: "/" + this._const("PATH.COACH.SELF"),
        iclass: "fa fa-user-o",
        style: false
      }
    ];
  }
}
