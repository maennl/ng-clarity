/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { UNIQUE_ID, UNIQUE_ID_PROVIDER } from '../../utils/id-generator/id-generator.service';
import { ClrAlignment } from '../../utils/popover/enums/alignment.enum';
import { ClrAxis } from '../../utils/popover/enums/axis.enum';
import { ClrSide } from '../../utils/popover/enums/side.enum';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';

/**
 * Custom filter that can be added in any column to override the default object property string filter.
 * The reason this is not just an input on DatagridColumn is because we need the filter's template to be projected,
 * since it can be anything (not just a text input).
 */
@Component({
  selector: 'clr-dg-column-settings',
  template: `
    <button
      class="datagrid-settings-toggle"
      type="button"
      #anchor
      [attr.aria-label]="commonStrings.keys.datagridColumnSettingsAriaLabel"
      [attr.aria-expanded]="ariaExpanded"
      [attr.aria-controls]="popoverId"
      clrPopoverAnchor
      clrPopoverOpenCloseButton
      [class.datagrid-settings-open]="open"
    >
      <cds-icon shape="wrench" solid></cds-icon>
    </button>

    <div
      class="datagrid-settings"
      [id]="popoverId"
      clrFocusTrap
      *clrPopoverContent="open; at: smartPosition; outsideClickToClose: true; scrollToClose: true"
      role="dialog"
      [attr.aria-label]="commonStrings.keys.datagridSettingsDialogAriaLabel"
    >
      <div class="datagrid-settings-close-wrapper" *ngIf="showCloseButton">
        <button type="button" class="close" clrPopoverCloseButton>
          <cds-icon shape="window-close" [attr.title]="commonStrings.keys.close"></cds-icon>
        </button>
      </div>

      <ng-content></ng-content>
    </div>
  `,
  providers: [UNIQUE_ID_PROVIDER],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrDatagridColumnSettings implements OnDestroy {
  private subs: Subscription[] = [];
  public ariaExpanded = false;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private smartToggleService: ClrPopoverToggleService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(UNIQUE_ID) public popoverId: string,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    this.subs.push(
      smartToggleService.openChange.subscribe(change => {
        this.open = change;
        this.ariaExpanded = change;
      })
    );
  }

  @ViewChild('anchor', { read: ElementRef })
  anchor: ElementRef;

  // Smart Popover
  public smartPosition: ClrPopoverPosition = {
    axis: ClrAxis.VERTICAL,
    side: ClrSide.AFTER,
    anchor: ClrAlignment.END,
    content: ClrAlignment.END,
  };

  private _open = false;
  public get open() {
    return this._open;
  }

  @Input('clrDgSettingsOpen')
  public set open(open: boolean) {
    open = !!open;
    if (this.open !== open) {
      this.smartToggleService.open = open;
      this.openChange.emit(open);
      if (!open && isPlatformBrowser(this.platformId)) {
        this.anchor.nativeElement.focus();
      }
      // keep track of the state
      this._open = open;
      this.changeDetectorRef.markForCheck();
    }
  }

  @Output('clrDgSettingsOpenChange') public openChange = new EventEmitter<boolean>(false);

  private _showCloseButton = false;

  get showCloseButton(): boolean {
    return this._showCloseButton;
  }

  @Input()
  set showCloseButton(value: boolean) {
    value = !!value;
    if (this._showCloseButton !== value) {
      this._showCloseButton = value;
      this.changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
