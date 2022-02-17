import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { ActionSheetController, AlertController } from '@ionic/angular';
import {
  map,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
  catchError,
} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from 'src/app/services/notification-service.service';
import { Team } from 'src/app/classes/team';

import { Clipboard } from '@capacitor/clipboard';
import { LoadingController } from '@ionic/angular';
import { MembershipsService } from 'src/app/services/memberships.service';
import { LogService } from 'src/app/services/log-service.service';
@Component({
  selector: 'app-club-edit-team',
  templateUrl: './club-edit-team.page.html',
  styleUrls: ['./club-edit-team.page.scss'],
})
export class ClubEditTeamPage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private drs: DataRepositoryService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public ns: NotificationService,
    public mms: MembershipsService,
    public loadingController: LoadingController,
    private logger: LogService
  ) {}

  codePrefix: string = 'https://teamtasic.app/join/';

  editGroup: FormGroup = this.fb.group({});
  addGroup: FormGroup = this.fb.group({});

  clubId: string = '';
  teamId: string = '';

  team: Team | undefined;
  roles: {
    [key: string]: 'athlete' | 'trainer' | 'headTrainer' | 'admin';
  } = {};

  membercode: string = '';
  trainercode: string = '';
  headtrainercode: string = '';
  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.clubId = params.get('clubId') || '';
      this.teamId = params.get('teamId') || '';
      this.team = this.drs.teams.value.find((t) => t.uid == this.teamId);
      this.teamChanged(this.team as Team);
    });
    this.drs.teams.subscribe((teams) => {
      this.team = teams.find((t) => t.uid == this.teamId);
      this.teamChanged(this.team as Team);
    });

    this.editGroup = this.fb.group({
      name: [this.team?.name, [Validators.required]],
      athlete: [this.team?.roleNames['athlete'], [Validators.required]],
      trainer: [this.team?.roleNames['trainer'], [Validators.required]],
      athletes: [this.team?.roleNames['athletes'], [Validators.required]],
      trainers: [this.team?.roleNames['trainers'], [Validators.required]],
    });
  }
  async teamChanged(team: Team) {
    this.roles = {};
    team.users.forEach((userId) => {
      this.roles[userId] = 'athlete';
    });
    team.trainers.forEach((userId) => {
      this.roles[userId] = 'trainer';
    });
    team.headTrainers.forEach((userId) => {
      this.roles[userId] = 'headTrainer';
    });
    team.admins.forEach((userId) => {
      this.roles[userId] = 'admin';
    });
    this.logger.debug(this.roles);
    this.membercode =
      this.codePrefix + (await this.drs.getJoinCodeForTeam(this.teamId, this.clubId, 'member'));
    this.trainercode =
      this.codePrefix + (await this.drs.getJoinCodeForTeam(this.teamId, this.clubId, 'coach'));
    this.headtrainercode =
      this.codePrefix + (await this.drs.getJoinCodeForTeam(this.teamId, this.clubId, 'headcoach'));
  }

  roleStrings = {
    trainer: 'Trainer',
    athlete: 'Athlet',
    headTrainer: 'Cheftrainer',
    admin: 'Admin',
  };

  async addMember() {
    try {
      await Clipboard.write({
        string: this.membercode,
      });
      this.ns.showToast('Code in die Zwischenablage kopiert');
    } catch (e) {
      this.ns.showToast('Fehler beim Erstellen des Codes');
      this.logger.warn(e);
    }
  }
  async addTrainer() {
    try {
      await Clipboard.write({
        string: this.trainercode,
      });
      this.ns.showToast('Code in die Zwischenablage kopiert');
    } catch (e) {
      this.ns.showToast('Fehler beim Erstellen des Codes');
      this.logger.warn(e);
    }
  }
  async addHeadcoach() {
    try {
      await Clipboard.write({
        string: this.headtrainercode,
      });
      this.ns.showToast('Code in die Zwischenablage kopiert');
    } catch (e) {
      this.ns.showToast('Fehler beim Erstellen des Codes');
      this.logger.warn(e);
    }
  }

  async presentActionSheet(userId: string) {
    const actionSheet = await this.actionSheetController.create({
      header: this.team?.names[userId] || '',
      buttons: [
        {
          text: 'Entfernen',
          role: 'destructive',
          icon: 'trash',
          handler: this.removeMember.bind(this, userId),
        },
        {
          text: 'Verstecken',
          role: 'destructive',
          icon: 'eye-off-outline',
          handler: this.hideMember.bind(this, userId),
        },
        {
          text: 'Zeigen',
          icon: 'eye-outline',
          handler: this.showMember.bind(this, userId),
        },

        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
    await actionSheet.onDidDismiss();
  }

  async removeMember(userId: string) {
    if (this.team?.admins.indexOf(userId) == -1) {
      this.mms
        .leaveFromTeam(userId, this.teamId, this.clubId)
        .then(async () => {
          const loading = await this.loadingController.create({
            message: 'Please wait...',
            duration: 200,
          });
          await loading.present();
          await loading.onDidDismiss();
          this.team = this.drs.teams.value.find((t) => t.uid == this.teamId) as Team;
          this.teamChanged(this.team);

          this.ns.showToast('Mitglied entfernt');
        })
        .catch((e) => {
          this.ns.showToast('Fehler beim Entfernen des Mitglieds');
          this.logger.warn(e);
        });
    } else {
      this.ns.showToast(
        'Du kannst keine Admins entfernen. (Momentan. Bitte kontaktiere den Support)'
      );
    }
  }
  async hideMember(userId: string) {
    if (this.team?.hiddenMembers.indexOf(userId) == -1) {
      this.team?.hiddenMembers.push(userId);
      this.drs.updateTeam(
        this.team || new Team('', '', {}, [], [], [], [], '', {}, Team.roleNamesDefault, []),
        this.clubId,
        this.teamId
      );
    }
  }
  async showMember(userId: string) {
    if (this.team?.hiddenMembers.indexOf(userId) != -1) {
      this.team?.hiddenMembers.splice(this.team?.hiddenMembers.indexOf(userId), 1);
      this.drs.updateTeam(
        this.team || new Team('', '', {}, [], [], [], [], '', {}, Team.roleNamesDefault, []),
        this.clubId,
        this.teamId
      );
    }
  }

  async saveChanges() {
    if (this.team) {
      [
        this.team.name,
        this.team.roleNames['athlete'],
        this.team.roleNames['athletes'],
        this.team.roleNames['trainer'],
        this.team.roleNames['trainers'],
      ] = [
        this.editGroup.value.name,
        this.editGroup.value.athlete,
        this.editGroup.value.athletes,
        this.editGroup.value.trainer,
        this.editGroup.value.trainers,
      ];

      this.drs.updateTeam(
        this.team || new Team('', '', {}, [], [], [], [], '', {}, Team.roleNamesDefault, []),
        this.clubId,
        this.teamId
      );
    }
  }
}
