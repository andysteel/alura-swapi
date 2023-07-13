import { Component, OnInit } from '@angular/core';
import { PageableResponse } from 'src/app/types/pageable-response';
import { Film } from 'src/app/types/films-response';
import { PageEvent } from '@angular/material/paginator';
import { FilmsService, stringOrNull } from 'src/app/services/films.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-filmes',
  templateUrl: './filmes.component.html',
  styleUrls: ['./filmes.component.scss']
})
export class FilmesComponent implements OnInit {

  filmsResponse!: PageableResponse<Film>;
  isLoading = false;
  searchForm!: FormGroup<{search: FormControl<string | null>}>;

  constructor(
    private filmsService: FilmsService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getFilms(1, null);
    this.buildForm();
    this.setFormSubscriber();
  }

  handlePageEvent($event: PageEvent) {
    this.getFilms($event.pageIndex, null);
  }

  getFilms(page: number, search: stringOrNull) {
    this.isLoading = true;
    this.filmsService.getAllFilms(page, search)
    .subscribe({
      next: response => {
        this.filmsResponse = response;
        this.isLoading = false;
      },
      error: error => {
        this.snackBar.open(error.message, 'Error', {verticalPosition: 'top', duration: 5000})
        this.isLoading = false;
      }
    })
  }

  private buildForm() {
   this.searchForm = new FormGroup({
    search: new FormControl<string | null>(null, [Validators.minLength(2)])
   });
  }

  private setFormSubscriber() {
    this.searchForm.controls
      .search
      .valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          this.isLoading = true;
          return this.filmsService.getAllFilms(1, value)
        }),
        catchError((error) => {
          this.snackBar.open(error.message, 'Error', {verticalPosition: 'top', duration: 5000})
          this.isLoading = false;
          return throwError(() => error);
        })
      )
      .subscribe(value => {
        this.filmsResponse = value;
        this.isLoading = false;
      })
  }

}
