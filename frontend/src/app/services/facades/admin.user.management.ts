import { BehaviorSubject } from "rxjs";
import { User } from "../../models/models";
import { UserService } from "../apis/user";
import { Injectable } from "@angular/core";
import { USERS } from "../../mock_datas/users";

@Injectable({
  providedIn: 'root'
})

export class AdminUserManagementFacade {
    private readonly usersSubject = new BehaviorSubject<User[]>([]);
    readonly users$ = this.usersSubject.asObservable();

    private readonly selectedUserSubject = new BehaviorSubject<User | null>(null);
    selectedUser$ = this.selectedUserSubject.asObservable();

    constructor(
        private userService: UserService
    ) {}

    init() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getAll().subscribe((users) => {
               this.usersSubject.next(users);
        });
    }
    
    getUserById(id: number): User | undefined {
        return this.usersSubject.value.find(user => user.id === id);
    }

    selectUser(user: User) {
        this.selectedUserSubject.next(user);
    }

    updateUser(user: User) {
        if ( this.getUserById(user.id) ) {
            this.userService.update(user.id.toString(), user).subscribe((updatedUser) => {
                const users = this.usersSubject.value.map(u => u.id === updatedUser.id ? updatedUser : u);
                this.usersSubject.next(users);
                this.selectedUserSubject.next(updatedUser);
            });
        }
    }


    //CHANGE THIS TO USE THE API INSTEAD OF THE MOCK DATA
    updateuserCCEPermission(user: User, canCreate: boolean) {
        USERS.forEach(u => {
            if (u.id === user.id) {
                u.can_create_election = canCreate;
            }
        });
        this.loadUsers();
        console.log('Updated user permissions:', user);
    }
}