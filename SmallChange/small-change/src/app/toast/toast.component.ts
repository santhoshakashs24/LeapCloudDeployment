import { Component, OnInit } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  template: `
  <ngb-toast
    *ngFor="let toast of toastService.toasts"
    [class]="toast.classname"
    [autohide]="true"
    [delay]="toast.delay || 50000"
    (hidden)="toastService.remove(toast)"
    class="border-0"
  >
  <div class="d-flex">
    <div class="toast-body" style="padding:0; margin:0 ;">
    {{ toast.textOrTpl }}
    </div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  </ngb-toast>
`,
host: {'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 1200'}
})
export class ToastComponent implements OnInit {

  constructor(public toastService:ToastService) { }

  ngOnInit(): void {
  }

}
