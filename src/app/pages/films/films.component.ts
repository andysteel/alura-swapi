import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageableResponse } from 'src/app/types/pageable-response';
import { Film } from 'src/app/types/films-response';
import { PageEvent } from '@angular/material/paginator';
import { FilmsService } from 'src/app/services/films.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, catchError, debounceTime, distinctUntilChanged, map, of, switchMap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { stringOrNull } from 'src/app/types/util-types';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss']
})
export class FilmsComponent implements OnInit, OnDestroy {

  filmsResponse!: PageableResponse<Film>;
  isLoading = false;
  searchForm!: FormGroup<{search: FormControl<string | null>}>;
  subs: Subscription[] = [];
  pageIndex = 0;
  searchValue: stringOrNull = null;

  constructor(
    private filmsService: FilmsService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getFilms(this.pageIndex, null);
    this.buildForm();
    this.setFormSubscriber();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  handlePageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.getFilms($event.pageIndex, this.searchValue);
  }

  getFilms(page: number, search: stringOrNull) {
    this.isLoading = true;
    this.filmsService.getAllFilms(page + 1, search)
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
    const sub = this.searchForm.controls
      .search
      .valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          this.isLoading = true;
          this.searchValue = value;
          this.pageIndex = 0;
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
      });
      this.subs.push(sub);
  }

}
