import { Component } from '@angular/core';
import { User, UserService } from '../../services/user';
import { UserForm } from "../user-form/user-form";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [UserForm, CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {

  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  addUser(user: User) {
    this.userService.createUser(user).subscribe(newUser => {
      this.users.push(newUser);
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user.id !== id);
    });
  }


}
