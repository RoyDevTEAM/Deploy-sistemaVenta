import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isSeller: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserName().subscribe(name => this.userName = name);
    this.authService.isLoggedIn().subscribe(loggedIn => this.isLoggedIn = loggedIn);
    this.authService.isAdmin().subscribe(admin => this.isAdmin = admin);
    this.authService.isSeller().subscribe(seller => this.isSeller = seller);
  }

  logout(): void {
    this.authService.logout();
  }
}
