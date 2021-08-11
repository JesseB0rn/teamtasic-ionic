import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClubEditTeamPageRoutingModule } from './club-edit-team-routing.module';

import { ClubEditTeamPage } from './club-edit-team.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClubEditTeamPageRoutingModule
  ],
  declarations: [ClubEditTeamPage]
})
export class ClubEditTeamPageModule {}
