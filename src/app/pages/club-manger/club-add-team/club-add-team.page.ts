import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Team, TeamData } from 'src/app/classes/team';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-club-add-team',
  templateUrl: './club-add-team.page.html',
  styleUrls: ['./club-add-team.page.scss'],
})
export class ClubAddTeamPage implements OnInit {
  constructor(
    private drs: DataRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  clubId: string;

  teamCreateForm: FormGroup;

  ngOnInit() {
    this.teamCreateForm = this.fb.group({
      teamName: ['', Validators.required],
    });

    this.clubId = this.route.snapshot.paramMap.get('clubId');
  }

  async createTeam() {
    let user = this.drs.currentUser.getValue();
    const roles = {};
    const team = new Team('', undefined, this.teamName.value);
    const teamData = new TeamData(roles);

    team.uid = await (await this.drs.addTeam(team, this.clubId)).ref.id;

    await this.drs.setTeamData(team.uid, this.clubId, teamData);

    user.memberships.push({
      role: 'owner',
      displayName: team.name,
      name: user.username,
      club: this.clubId,
      team: team.uid,
      type: 'team',
    });
    console.log('user now is:          ', user);

    this.drs.currentUser.next(user);
    await this.drs.updateUser();

    await new Promise((resolve) => setTimeout(resolve, 100));
    await this.drs.resync();
    this.drs.needsUpdateUserData.next(true);
    this.router.navigate(['/my-clubs/detail', this.clubId]);
  }
  get teamName() {
    return this.teamCreateForm.get('teamName');
  }
}
