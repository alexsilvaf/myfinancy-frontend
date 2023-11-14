import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CategoryType } from 'app/enums/category-type';
import { CategoryChartModel } from 'app/models/category-chart.model';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'app/services/category.service';
import { CategoryHistoryModel } from 'app/models/category-history.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('receiveExpenseChart') receiveExpenseChart: ElementRef;
  @ViewChild('historyChart') historyChart: ElementRef;
  @ViewChild('scrollDiv1') scrollDiv1: ElementRef;
  @ViewChild('scrollDiv2') scrollDiv2: ElementRef;

  receiveList: CategoryChartModel[] = [];
  categoryHistoryModelList: CategoryHistoryModel[] = [];

  colors = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router) { }

  ngAfterViewInit() {
    this.receiveList = this.categoryService.getAllReceive();
    this.categoryHistoryModelList = this.categoryService.getHistoryExpenseChartModel();

    
  }
  checkForScrollbar(scrollDivs: ElementRef[]) {
    scrollDivs.forEach(scrollDiv => {
      const parentElement = scrollDiv?.nativeElement;
      const children = parentElement?.children;
      let totalChildrenWidth = 0;

      for (let i = 0; i < children?.length; i++) {
        const child = children[i];
        const style = window.getComputedStyle(child);
        const marginLeft = parseFloat(style.marginLeft || '0');
        const marginRight = parseFloat(style.marginRight || '0');

        totalChildrenWidth += child.offsetWidth + marginLeft + marginRight;
      }

      if (totalChildrenWidth > parentElement?.offsetWidth) {
        // A largura total dos elementos filhos (incluindo margens) é maior que a largura do elemento pai
        parentElement.classList.add('has-scrollbar');
      } else {
        parentElement?.classList.remove('has-scrollbar');
      }
    });
  }

  navigateToManagment(type: 'receive' | 'expense') {
    let categotyType = type == 'receive' ? CategoryType.RECEIVE : CategoryType.EXPENSE;
    this.router.navigate(['/management'], { state: { type: categotyType } });
  }

  get hasReceiveExpenseChartData(): boolean {
    return this.receiveList && this.receiveList.length > 0;
  }

  get hasHistoryData(): boolean {
    return this.categoryHistoryModelList && this.categoryHistoryModelList.length > 0;
  }

  get totalValue(): number {
    return (this.totalReceive - this.totalExpense);
  }

  get totalExpense(): number {
    return this.categoryHistoryModelList[this.categoryHistoryModelList.length - 1]?.totalValue || 0;
  }

  get totalReceive(): number {
    return this.receiveList.reduce((acc, category) => acc + category.totalValue, 0);
  }
}
