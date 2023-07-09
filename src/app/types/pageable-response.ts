export class PageableResponse<T> {

  constructor(
    public count: number,
    public next: string | null,
    public previous: string | null,
    public results: T[]
  ) {}
}
