import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../shared/service/requests/user.service';
import { User } from '../../shared/model/user.model';
import { CommonModule, NgForOf } from '@angular/common';
import { SearchPipe } from '../../shared/pipe/searchItem.pipe';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FavoriteUserService } from '../../shared/service/favorite-user.service';

@Component({
  selector: 'app-collegues',
  standalone: true,
  imports: [
    SearchPipe,
    FormsModule,
    RouterLink,
    NgForOf,
    FontAwesomeModule,
    CommonModule,
  ],
  templateUrl: './colleagues.component.html',
  styleUrl: './colleagues.component.scss',
})

export class ColleguesComponent implements OnInit {
  @Input()
  public favoriteColleagues!: User[];

  public faHeart = faHeart;

  public searchText: string = '';
  public allUsers: User[] = [];

  public favoriteListSelected: boolean = true;

  constructor(
    private userService: UserService,
    private favoriteUserService: FavoriteUserService
  ) {}

  ngOnInit() {
    this.getAllUsers();
  }

  private getAllUsers(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.userService.getCurrentSignedInUser().subscribe((response) => {
        let currentUser: User = response.payload;
        let allUsersExceptForCurrentUser = users.filter(
          (user) => user.id !== currentUser.id
        );
        this.allUsers = allUsersExceptForCurrentUser;
      });
    });
  }

  public toggleFavorite(user: User): void {
    if (this.favoriteColleagues.includes(user)) {
      this.favoriteUserService.removeFavoriteUser(user).subscribe(
        (response) => {
          this.favoriteColleagues = this.favoriteColleagues.filter((u) => u !== user);
        },
        (error) => {
          console.error('Error removing favorite colleague: ', error);
        }
      );
    } else {
      this.favoriteUserService.addFavoriteUser(user).then(
        (response) => {
          this.favoriteColleagues.push(user);
        },
        (error) => {
          console.error('Error adding favorite colleague: ', error);
        }
      );
    }
  }

  public isUserFavorite(user: User): boolean {
    let isFavorite = false;

    this.favoriteColleagues.forEach((favoriteUser: User) => {
      if (favoriteUser.id === user.id) {
        isFavorite = true;
      }
    });

    return isFavorite;
  }
}
