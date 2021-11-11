import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { TextbubbleComponent } from 'src/app/components/textbubble/textbubble.component';
import { TrainingbubbleComponent } from 'src/app/components/trainingbubble/trainingbubble.component';
import { TrainingDetailViewComponent } from 'src/app/components/training-detail-view/training-detail-view.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChatPageRoutingModule],
  declarations: [
    ChatPage,
    TextbubbleComponent,
    TrainingbubbleComponent,
    TrainingDetailViewComponent,
  ],
})
export class ChatPageModule {}
