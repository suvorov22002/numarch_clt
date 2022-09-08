import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';

import { OverlayService } from './overlay.service';
//import { RouteStrategyComponent } from './helper/route-strategy/route-strategy.component';
//import { SafeHtmlPipe } from './helper/safe-html.pipe';
export { OverlayService, AppOverlayConfig } from './overlay.service';

@NgModule({
  imports: [CommonModule, OverlayModule],
  providers: [OverlayService]
  //declarations: [RouteStrategyComponent],
  //declarations: [SafeHtmlPipe]
})
export class AppOverlayModule {}
