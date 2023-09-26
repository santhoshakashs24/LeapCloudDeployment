import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];

  constructor() { }

  showError(message:string){
    this.show(message, { classname: 'bg-danger text-light', delay: 10000 });
  }

  showSuccess(message:string){
    this.show(message, { classname: 'bg-success text-light', delay: 10000 });
  }

  showInformation(message:string){
    this.show(message, { classname: 'bg-warning', delay: 10000 });

  }


  show(textOrTpl: string , options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast:any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
