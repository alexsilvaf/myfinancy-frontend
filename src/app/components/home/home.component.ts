import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CategoryType } from 'app/enums/category-type';
import { CategoryChartModel } from 'app/models/category-chart.model';
import { CategoryService } from 'app/services/category.service';
import { CategoryHistoryModel } from 'app/models/category-history.model';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('receiveExpenseChart') receiveExpenseChart: ElementRef;
  @ViewChild('historyChart') historyChart: ElementRef;

  receiveList: CategoryChartModel[] = [];
  expenseList: CategoryChartModel[] = [];
  assets: CategoryChartModel[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router) { }

  ngOnInit() {
    this.assets = this.categoryService.getAll().sort((a, b) => b.date.getTime() - a.date.getTime());
    this.receiveList = this.assets?.filter(asset => asset.type == CategoryType.RECEIVE);
    this.expenseList = this.assets?.filter(asset => asset.type == CategoryType.EXPENSE);
  }

  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    var receiveExpenseChart = this.receiveExpenseChart?.nativeElement?.getContext('2d');
    var historyChart = this.historyChart?.nativeElement?.getContext('2d');
    if(this.expenseList && historyChart && receiveExpenseChart) {
      let expenseToChartList = [];
      let currentDate = new Date(); // System date
      currentDate.setMonth(currentDate.getMonth() - 1); //  Start from the previous month to the current one
      let currentMonth = currentDate.getMonth();
      let currentYear = currentDate.getFullYear();

      for(let index = 0; index < 12; index++) {
        let expenseToChart = new CategoryHistoryModel();
        let year = currentYear;
        let month = currentMonth - index;
        
        if (month < 0) {
          month += 12; // Adjust the month to the previous year
          year--; // Subtract 1 from the year
        }

        let date = new Date(year, month, 1);

        let value = this.expenseList?.filter(expense => expense.date.getMonth() == month && expense.date.getFullYear() == date.getFullYear());
        let totalValue = value?.reduce((acc, expense) => acc + expense.totalValue, 0);
        totalValue = totalValue ? totalValue : 0;
        expenseToChart.month = date;
        expenseToChart.totalValue = totalValue;
        expenseToChartList.push(expenseToChart);
      }

      expenseToChartList.sort((a, b) => a.month.getTime() - b.month.getTime());
      var myHistoryChart = new Chart(historyChart, {
        type: 'bar',
        data: {
          labels: expenseToChartList.map(category => category.month?.toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })), // Asumindo que 'month' já está no formato 'mm/aa'
          datasets: [{
            data: expenseToChartList.map(category => category.totalValue),
            backgroundColor: 'rgba(10, 238, 144, 0.4)', // Background color of the bars (light green transparent)
            borderColor: 'rgba(10, 238, 144, 1)', // Background color of the border of the bars (light green opaque)
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Remove the legend
            }
          },
          scales: {
            y: {
              display: false, // Remove the y axis labels
              beginAtZero: true // Start the y axis at 0
            },
            x: {
              // Configure the x axis
              grid: {
                display: false // This removes the horizontal lines
              }
            }
          }
        }
      });
    }

    if (this.receiveList && this.receiveList.length > 0) {
      var myReceiveExpenseChart = new Chart(receiveExpenseChart, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [this.totalExpense, this.totalReceive],
            backgroundColor: ['rgb(200, 9, 9)', 'rgb(10, 200, 144)'],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              position: 'left'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataIndex == 0 ? 'Despesas' : 'Receitas';
                  const valor = typeof context.raw === 'number' ? context.raw : 0;
                  return label + ': ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
                }
              }
            }
          },
          onHover: (event, chartElement) => {
            const canvas = myReceiveExpenseChart.canvas;
            canvas.style.cursor = chartElement.length ? 'pointer' : 'default';
          },
          onClick: (evt, element) => {
            if (element.length > 0) {
              var index = element[0].index;
              // Verify if the user clicked on the expense or receive chart
              if (index === 0) {
                this.navigateToManagment('expense');
              } else if (index === 1) {
                this.navigateToManagment('receive');
              }
            }
          }
        }
      });

    } else {
      // If the chart just has one value, remove the chart
      if (myReceiveExpenseChart) {
        myReceiveExpenseChart.destroy();
      }
      if (myHistoryChart) {
        myHistoryChart.destroy();
      }

      if (this.receiveExpenseChart?.nativeElement) {
        this.receiveExpenseChart.nativeElement.style.height = '0px';
      }
      if (this.historyChart?.nativeElement) {
        this.historyChart.nativeElement.style.height = '0px';
      }
    }
  }

  navigateToManagment(type: 'receive' | 'expense') {
    let categotyType = type == 'receive' ? CategoryType.RECEIVE : CategoryType.EXPENSE;
    this.router.navigate(['/management'], { state: { type: categotyType } });
  }

  get expenseListFiltered(): CategoryChartModel[] {
    let now = new Date();
    return this.expenseList.filter(asset => asset.date.getMonth() + asset.installments >= now.getMonth() && asset.date.getFullYear() == now.getFullYear());
  }

  get hasReceiveExpenseChartData(): boolean {
    return this.receiveList && this.receiveList.length > 0;
  }

  get hasHistoryData(): boolean {
    return this.expenseList && this.expenseList.length > 0;
  }

  get totalValue(): number {
    let value = (this.totalReceive - this.totalExpense);
    return value ? value : 0;
  }

  get totalExpense(): number {
    let now = new Date();
    let value = this.expenseList.filter(asset => asset.date.getMonth() + asset.installments >= now.getMonth() && asset.date.getFullYear() == now.getFullYear()).reduce((acc, asset) => acc + asset.totalValue, 0);
    return value ? value : 0;
  }

  get totalReceive(): number {
    let value =  this.receiveList.reduce((acc, category) => acc + category.totalValue, 0);
    return value ? value : 0;
  }
}
