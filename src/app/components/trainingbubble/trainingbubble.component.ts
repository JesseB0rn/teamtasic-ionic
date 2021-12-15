import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { TrainingDetailViewComponent } from '../training-detail-view/training-detail-view.component';

@Component({
  selector: 'trainingbubble',
  templateUrl: './trainingbubble.component.html',
  styleUrls: ['./trainingbubble.component.scss'],
})
export class TrainingbubbleComponent implements OnInit {
  @Input() meet: Meet;
  @Input() sessionId: string;
  @Input() teamId: string;
  @Input() clubId: string;
  @Input() isArchive: boolean | undefined;

  options = {
    weekday: undefined,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  optionsTime = {
    weekday: undefined,
    year: undefined,
    month: undefined,
    day: undefined,
    hour: 'numeric',
    minute: 'numeric',
  };

  buttonColor: 'primary' | 'danger' | 'success' = 'primary';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (!this.isArchive) {
      this.buttonColor = this.meet.acceptedUsers.includes(this.sessionId) ? 'success' : 'primary';
      this.buttonColor = this.meet.declinedUsers.includes(this.sessionId)
        ? 'danger'
        : this.buttonColor;
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: TrainingDetailViewComponent,
      componentProps: {
        meet: this.meet,
        sessionId: this.sessionId,
        teamId: this.teamId,
        clubId: this.clubId,
      },
    });

    await modal.present();
  }
}
