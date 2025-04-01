import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})

export class LoaderComponent implements OnInit {
  @Input() isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}

