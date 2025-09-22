import { Component } from '@angular/core';
import { ArticlesComponent } from '../articles/articles.component';
import { HttpClient } from '@angular/common/http';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend);


@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticlesComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  public dataSource:any = {
                datasets: [
                    {
                        data: [],
                        backgroundColor: [
                            '#ffcd56',
                            '#ff6384',
                            '#36a2eb',
                            '#fd6b19',
                        ]
                    }
                ],
                labels: []
            };

  private chart: Chart | null = null; 
  myBudget = [];
  domainLabels:any = [];   

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget').subscribe({
      next: (data: any) => {
        console.log('Budget data:', data);
        this.myBudget = data.myBudget;

        this.domainLabels = data.myBudget.map((item: any) => item.title);
        this.dataSource.datasets[0].data = data.myBudget.map((item: any) => item.budget);
        this.dataSource.labels = data.myBudget.map((item: any) => item.title);
        this.createChart();  
      },
      error: (err) => {
        console.error('Error fetching budget data', err);
      }
    });
  }

  createChart() {
            const canvas = document.getElementById('myChart') as HTMLCanvasElement;
            const ctx = canvas.getContext('2d')!;  
            
            if (this.chart) {
              this.chart.destroy();
            }
            var myPieChart = new Chart(ctx, {
                type: 'pie',
                data: this.dataSource
            });
        }
}
