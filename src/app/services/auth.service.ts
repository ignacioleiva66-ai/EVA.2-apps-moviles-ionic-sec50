import { Injectable, signal } from '@angular/core';
import { User } from '../models/task.model';
import { StorageService } from './storage.service';

const AUTH_USER_KEY = 'current_auth_user_eva2';
const USERS_LIST_KEY = 'registered_users_eva2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private defaultUsers: User[] = [
    { id: 'usr-1', name: 'Ignacio Leiva', email: 'ignacio.leiva@ipss.cl' },
    { id: 'usr-2', name: 'Usuario Invitado', email: 'invitado@ipss.cl' },
  ];

  readonly currentUser = signal<User>(this.defaultUsers[0]);
  readonly usersList = signal<User[]>(this.defaultUsers);

  constructor(private storageService: StorageService) {
    this.initAuth();
  }

  private async initAuth(): Promise<void> {
    const savedUser = await this.storageService.getItem<User>(AUTH_USER_KEY);
    const savedUsersList = await this.storageService.getItem<User[]>(USERS_LIST_KEY);

    if (savedUsersList && savedUsersList.length > 0) {
      this.usersList.set(savedUsersList);
    } else {
      await this.storageService.setItem(USERS_LIST_KEY, this.defaultUsers);
    }

    if (savedUser) {
      this.currentUser.set(savedUser);
    } else {
      await this.storageService.setItem(AUTH_USER_KEY, this.defaultUsers[0]);
    }
  }

  getCurrentUser(): User {
    return this.currentUser();
  }

  /**
   * Cambia el usuario activo
   */
  async switchUser(user: User): Promise<void> {
    this.currentUser.set(user);
    await this.storageService.setItem(AUTH_USER_KEY, user);
  }

  /**
   * Registra dinámicamente un nuevo usuario
   */
  async registerUser(name: string, email: string): Promise<User> {
    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    const updatedList = [...this.usersList(), newUser];
    this.usersList.set(updatedList);
    await this.storageService.setItem(USERS_LIST_KEY, updatedList);

    await this.switchUser(newUser);
    return newUser;
  }
}
