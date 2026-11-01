import { Component, signal } from '@angular/core';

interface Task {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  readonly tasks = signal<Task[]>([]);
  newTaskTitle = '';
  newTaskDescription = '';

  addTask(): void {
    const title = this.newTaskTitle.trim();

    if (!title) {
      return;
    }

    this.tasks.update((tasks) => [
      ...tasks,
      {
        title,
        description: this.newTaskDescription.trim(),
      },
    ]);

    this.newTaskTitle = '';
    this.newTaskDescription = '';
  }

  removeTask(taskIndex: number): void {
    this.tasks.update((tasks) => tasks.filter((_, index) => index !== taskIndex));
  }
}
