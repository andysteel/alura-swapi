import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, catchError, debounceTime, distinctUntilChanged, switchMap, throwError } from 'rxjs';
import { StarshipsService } from 'src/app/services/starships.service';
import { PageableResponse } from 'src/app/types/pageable-response';
import { Starship } from 'src/app/types/starships-response';
import { stringOrNull } from 'src/app/types/util-types';

@Component({
  selector: 'app-starships',
  templateUrl: './starships.component.html',
  styleUrls: ['./starships.component.scss']
})
export class StarshipsComponent implements OnInit, OnDestroy {

  starshipsResponse!: PageableResponse<Starship>;
  isLoading = false;
  searchForm!: FormGroup<{search: FormControl<string | null>}>;
  subs: Subscription[] = [];
  pageIndex = 0;
  searchValue: stringOrNull = null;

  constructor(
    private starshipsService: StarshipsService,
    private snackBar: MatSnackBar) {}

    ngOnInit(): void {
      this.getStarships(this.pageIndex, null);
      this.buildForm();
      this.setFormSubscriber();
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    handlePageEvent($event: PageEvent) {
      this.pageIndex = $event.pageIndex;
      this.getStarships($event.pageIndex, this.searchValue);
    }

    getStarships(page: number, search: stringOrNull) {
      this.isLoading = true;
      this.starshipsService.getAllStarships(page + 1, search)
      .subscribe({
        next: response => {
          this.starshipsResponse = response;
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
            return this.starshipsService.getAllStarships(1, value)
          }),
          catchError((error) => {
            this.snackBar.open(error.message, 'Error', {verticalPosition: 'top', duration: 5000})
            this.isLoading = false;
            return throwError(() => error);
          })
        )
        .subscribe(value => {
          this.starshipsResponse = value;
          this.isLoading = false;
        });
       this.subs.push(sub);
    }
}
