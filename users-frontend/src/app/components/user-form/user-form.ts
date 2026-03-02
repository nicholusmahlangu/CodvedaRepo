import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../services/user';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-form',
  imports: [FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {

  name = '';
  email = '';
  
  @Output() userCreated = new EventEmitter<User>();
  // onSubmit() {
  //   console.log('User created:', { name: this.name, email: this.email });
  //   // Here you would typically call a service to save the user
  // }
  onSubmit() {
    this.userCreated.emit({ 
      name: this.name, 
      email: this.email });
  
      this.name = '';
      this.email = '';
    }
}
