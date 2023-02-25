import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  websiteURL: string = ''

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openWebsite(){
    this.router.navigate(['/proxy', this.websiteURL]);
  }
}
