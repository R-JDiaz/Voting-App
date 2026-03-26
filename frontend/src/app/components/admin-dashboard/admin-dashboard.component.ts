import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';
import { User, ApiResponse, DashboardStats } from '../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  loading = true;
  error = '';
  dashboardStats: DashboardStats | null = null;
  users: User[] = [];
  currentUser: any;

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadDashboard();
    this.loadUsers();
  }

  loadDashboard(): void {
  this.adminService.getDashboard().subscribe({
    next: (res: ApiResponse<DashboardStats>) => {
      if (res.success) {
        // Assign the whole data object, not just statistics
        this.dashboardStats = res.data;
      }
      this.loading = false;
    },
    error: () => {
      this.error = 'Failed to load dashboard statistics';
      this.loading = false;
    }
  });
}

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (res: ApiResponse<User[]>) => {
        if (res.success) {
          this.users = res.data;
        }
        console.log(this.users);
      },
      error: () => this.error = 'Failed to load users'
    });
  }

  toggleElectionPermission(user: User): void {
    const allow = (user.can_create_election === 1) ? false : true;
    this.adminService.toggleElectionPermission(user.id, allow).subscribe({
      next: () => user.can_create_election = allow,
      error: () => alert('Failed to update permission')
    });
  }

  blockUnblockUser(user: User): void {
    const block = !user.blocked;
    this.adminService.toggleBlockUser(user.id, block).subscribe({
      next: () => user.blocked = block,
      error: () => alert('Failed to update user status')
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Are you sure you want to delete ${user.username}?`)) return;
    this.adminService.deleteUser(user.id).subscribe({
      next: () => this.users = this.users.filter(u => u.id !== user.id),
      error: () => alert('Failed to delete user')
    });
  }

  createAdminUser(): void {
    const username = prompt('Enter username for new admin:');
    if (!username) return;
    const email = prompt('Enter email:');
    if (!email) return;
    const password = prompt('Enter password:');
    if (!password) return;

    this.adminService.createAdminUser({ username, email, password }).subscribe({
      next: (res) => {
        if (res.success) {
          this.users.unshift(res.data);
        }
      },
      error: () => alert('Failed to create admin user')
    });
  }

   // Getter for recent users
  get recentUsers(): User[] {
    return this.dashboardStats?.recentUsers || [];
  }

  // Toggle permission to create election
  toggleCanCreateElection(user: User): void {
    const allow = !(user as any).can_create_election; // toggle boolean
    this.adminService.toggleElectionPermission(user.id, allow).subscribe({
      next: () => {
        // Update locally for instant UI feedback
        (user as any).can_create_election = allow;
      },
      error: () => {
        alert('Failed to update permission');
      }
    });
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }
}