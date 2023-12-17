import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { TodoModel, filterType } from '../../models/todo';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit{
 todoList = signal<TodoModel[]>([]);

 filter = signal<filterType>('all');

 todoListFiltered = computed(() => {
  const filter = this.filter();
  const todos = this.todoList();

  switch(filter){
    case 'active':
      return todos.filter((todo) => !todo.completed);
    
    case 'completed':
      return todos.filter((todo) => todo.completed);
    
    default:
      return todos;
  }
 })

 newTodo = new FormControl('', {
  nonNullable:true,
  validators:[Validators.required, Validators.minLength(3)]
 });

 constructor(){
  effect(() => {
    localStorage.setItem('todos', JSON.stringify(this.todoList()))
  });
 }

 ngOnInit(): void {
  const storage = localStorage.getItem('todos');
  if(storage){
    this.todoList.set(JSON.parse(storage));
  }
 }

 changeFilter(filterString: filterType){
  this.filter.set(filterString);
 }

 addTodo(){
  const newTodoTitle = this.newTodo.value.trim();
  if (this.newTodo.valid && newTodoTitle !== '') {
    this.todoList.update((prevTodos) => {
      return [
        ...prevTodos,
        {id: Date.now(),title: newTodoTitle, completed:false}
      ]
    });
    this.newTodo.reset();
  } else {
    this.newTodo.reset();
  }
 }

 toggleTodo(todoId: number) {
  this.todoList.update((prevTodos)=> prevTodos.map((todo) => {
   return todo.id === todoId ? {...todo, completed: !todo.completed}
   : todo;
  }))
 }

 removeTodo(todoId: number) {
  this.todoList.update((prevTodos) => prevTodos.filter((todo) => {
    return todo.id !== todoId;
  }))
 }

 updateTodo(todoId: number) {
  return this.todoList.update((prevTodos) => 
  prevTodos.map((todo) => {
    return todo.id === todoId ? {...todo, editing:true}
    : {...todo, editing:false};
  }))
 }

 saveTitleTodo(todoId: number, event: Event) {
  const title = (event.target as HTMLInputElement).value;
  return this.todoList.update((prevTodos) => prevTodos.map((todo) => {
    return todo.id === todoId ? {...todo, title:title, editing:false}
    : todo
  }))
 }
}
