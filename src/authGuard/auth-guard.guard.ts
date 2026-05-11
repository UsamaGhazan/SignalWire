import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { global_pointer } from '../assets/js/global_config';
import {Router} from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { DataService } from '../service/data.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor( private router: Router, private api:DataService, private http: HttpClient,private toastr: ToastrService)
  {}
  async canActivate (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  Promise<boolean | UrlTree>  {
     var verify:any= localStorage.getItem("username");
      if(verify)
      {
        return true;
      }
      else {
        localStorage.removeItem("token");
        localStorage.removeItem("userinfo");
        this.toastr.info("Please login");
        this.router.navigate(['signin']);
        //  setTimeout(function () {
        //   window.location.reload();
        //  },1)
        //  window.location.href="login";
        return false;
      }
     
  }
  
}