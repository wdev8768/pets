import { OnDestroy, Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable()
export class Destroyable implements OnDestroy {
  protected destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy();
  }

  public destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
