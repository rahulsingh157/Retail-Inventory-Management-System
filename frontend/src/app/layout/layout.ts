import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

  private authService = inject(AuthService);

  get currentUser() {
    return this.authService.getUser();
  }

  get userInitial(): string {
    const user = this.currentUser;
    return user && user.name ? user.name.charAt(0).toUpperCase() : 'U';
  }

  logout(): void {
    this.authService.logout();
  }
}