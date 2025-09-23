import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface BudgetItem {
  title: string;
  budget: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private budgetSubject = new BehaviorSubject<BudgetItem[]>([]);
  public budget$ = this.budgetSubject.asObservable();

  constructor(private http: HttpClient) {}

  //get data from api only no cache data
  loadBudget(): Observable<BudgetItem[]> {
    if (this.budgetSubject.value.length > 0) {
      return of(this.budgetSubject.value);
    }

    return this.http.get<{ myBudget: BudgetItem[] }>('http://localhost:3000/budget').pipe(
      map(res => res.myBudget), 
      tap(myBudget => this.budgetSubject.next(myBudget))
    );
  }

  //get cached data
  getBudget(): BudgetItem[] {
    return this.budgetSubject.value;
  }
}
