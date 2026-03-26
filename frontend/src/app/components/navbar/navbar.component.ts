import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/models';
import { UserService } from '../../services/user.service';
import { ElectionService } from '../../services/election.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userId?: number;
  currentUser: User | null = null;
  isMenuOpen = false;

  // For join election
  joinElectionId: string = '';
  joinMessage: string = '';
  joinSuccess: boolean | null = null; // null = no attempt yet

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private electionService: ElectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(authUser => {
      if (!authUser?.id) return;

      this.userId = authUser.id;

      this.userService.getUserById(this.userId).subscribe({
        next: (response) => {
          this.currentUser = response.data;
          console.log('Current User:', this.currentUser);
        },
        error: (err) => {
          console.error('Failed to fetch user', err);
        }
      });
    });
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  // ----------------------------
  // Join election method
  // ----------------------------
// Only the join-related part is added/updated


joinElection(): void {
  if (!this.joinElectionId.trim()) {
    this.joinMessage = 'Please enter an election ID';
    this.joinSuccess = false;
    this.clearJoinMessageAfterDelay();
    return;
  }

  const id = Number(this.joinElectionId);
  if (isNaN(id)) {
    this.joinMessage = 'Election ID must be a number';
    this.joinSuccess = false;
    this.clearJoinMessageAfterDelay();
    return;
  }

  this.electionService.joinElection(id).subscribe({
    next: (res) => {
      if (res.success) {
        this.joinMessage = 'Successfully joined the election!';
        this.joinSuccess = true;
        this.clearJoinMessageAfterDelay();

        // Optionally navigate
        this.router.navigate(['/elections', id]);
      } else {
        this.joinMessage = res.message || 'Failed to join the election';
        this.joinSuccess = false;
        this.clearJoinMessageAfterDelay();
      }
    },
    error: (err) => {
      this.joinMessage = err.error?.message || 'Error joining election';
      this.joinSuccess = false;
      this.clearJoinMessageAfterDelay();
    }
  });
}


// Helper method to auto-clear message after 3 seconds
clearJoinMessageAfterDelay(): void {
  setTimeout(() => {
    this.joinMessage = '';
    this.joinSuccess = null;
  }, 2500);
}
}