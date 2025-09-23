import { Component } from '@angular/core';
import { ArticlesComponent } from '../articles/articles.component';
import { HttpClient } from '@angular/common/http';
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
Chart.register(PieController, ArcElement, Tooltip, Legend);

import * as d3 from 'd3';
import { BudgetItem, DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticlesComponent, BreadcrumbsComponent],
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

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
  this.dataService.loadBudget().subscribe({
    next: (myBudget: BudgetItem[]) => {
      this.dataSource.datasets[0].data = myBudget.map(item => item.budget);
      this.dataSource.labels = myBudget.map(item => item.title);

      this.createChart();
      this.createD3Chart(myBudget);
    },
    error: (err) => console.error('Error fetching budget data', err)
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

 private createD3Chart(myBudget: any[]) {
  const width = 960;
  const height = 450;
  const radius = Math.min(width, height) / 2;

  d3.select("body").selectAll("svg").remove();

  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  svg.append("g").attr("class", "slices");
  svg.append("g").attr("class", "labels");
  svg.append("g").attr("class", "lines");

  const color = d3.scaleOrdinal<string>()
    .domain(myBudget.map(d => d.title))
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  const pie = d3.pie<any>()
    .sort(null)
    .value((d: any) => d.value);

  const arc = d3.arc<d3.PieArcDatum<any>>()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

  const outerArc = d3.arc<d3.PieArcDatum<any>>()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  const key = (d: any) => d.data.label;

  const budgetData = () => myBudget.map(item => ({
    label: item.title,
    value: item.budget
  }));

  const randomData = () =>
    myBudget.map(item => ({
      label: item.title,
      value: Math.floor(Math.random() * 100)
    }));

  const change = (data: any[]) => {
    // PIE SLICES
    const slice = svg.select(".slices").selectAll("path.slice")
      .data(pie(data), key as any);

    slice.enter()
      .append("path")
      .attr("class", "slice")
      .style("fill", (d: any) => color(d.data.label))
      .merge(slice as any)
      .transition().duration(1000)
      .attrTween("d", function(d: any) {
        const self = this as any; 
        self._current = self._current || d;
        const interpolate = d3.interpolate(self._current, d);
        self._current = interpolate(0);
        return (t: any) => arc(interpolate(t))!;
      });

    slice.exit().remove();

    // TEXT LABELS
    const text = svg.select(".labels").selectAll("text")
      .data(pie(data), key as any);

    text.enter()
      .append("text")
      .attr("dy", ".35em")
      .text((d: any) => d.data.label)
      .merge(text as any)
      .transition().duration(1000)
      .attrTween("transform", function(d: any) {
        const self = this as any; 
        self._current = self._current || d;
        const interpolate = d3.interpolate(self._current, d);
        self._current = interpolate(0);
        return (t: any) => {
          const d2 = interpolate(t);
          const pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        };
      })
      .styleTween("text-anchor", function(d: any) {
        const self = this as any; 
        self._current = self._current || d;
        const interpolate = d3.interpolate(self._current, d);
        self._current = interpolate(0);
        return (t: any) => {
          const d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start" : "end";
        };
      });

    text.exit().remove();

    // POLYLINES
    const polyline = svg.select(".lines").selectAll("polyline")
      .data(pie(data), key as any);

    polyline.enter()
      .append("polyline")
      .merge(polyline as any)
      .transition().duration(1000)
      .attrTween("points", function(d: any) {
        const self = this as any; 
        self._current = self._current || d;
        const interpolate = d3.interpolate(self._current, d);
        self._current = interpolate(0);
        return (t: any) => {
          const d2 = interpolate(t);
          const pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);

          return [arc.centroid(d2)!, outerArc.centroid(d2)!, pos]
      .map(p => p.join(","))
      .join(" ");
        };
      });

    polyline.exit().remove();
  };

  const midAngle = (d: any) => d.startAngle + (d.endAngle - d.startAngle) / 2;

  // First draw
  change(budgetData());

  // Randomize button
  d3.select(".randomize").on("click", () => {
    change(randomData());
  });
}


}
