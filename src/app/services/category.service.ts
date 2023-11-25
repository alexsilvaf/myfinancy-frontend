import { Injectable } from '@angular/core';
import { CategoryType } from 'app/enums/category-type';
import { CategoryChartModel } from 'app/models/category-chart.model';
import { ClassType } from 'app/enums/class-type';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  getAll(): CategoryChartModel[] {
    const receiveCount = this.randomInt(3, 10);
    const expenseCount = this.randomInt(30, 120);
    const receives = this.generateCategoryItems(receiveCount, CategoryType.RECEIVE);
    const totalReceiveThisMonth = receives
    .filter(item => this.isCurrentMonth(item.date))
    .reduce((acc, item) => acc + item.totalValue, 0);

    let expenses = this.generateCategoryItems(expenseCount, CategoryType.EXPENSE, totalReceiveThisMonth);

    return [...receives, ...expenses];
  }

  private isCurrentMonth(date: Date): boolean {
    const currentDate = new Date();
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  }

  private generateCategoryItems(count: number, type: CategoryType, maxReceiveValue?: number): CategoryChartModel[] {
    const items = [];
    if(maxReceiveValue){
      maxReceiveValue = this.randomInt(maxReceiveValue/5, maxReceiveValue)
    }
    for (let i = 0; i < count; i++) {
      const classType = this.getClassTypeForCategory(type);
      const date = type === CategoryType.RECEIVE ? this.currentDateThisMonth() : this.randomDateLastYear();
      let totalValue = 0;
      const installments = classType === ClassType.SALARY || classType === ClassType.INVESTMENT ? null : this.randomInt(1, 12);
      if(type === CategoryType.EXPENSE && date.getMonth() + installments >= this.currentDateThisMonth().getMonth()){
        if(maxReceiveValue == 0){
          continue;
        }
        totalValue = this.randomInt(maxReceiveValue/(maxReceiveValue / 10), maxReceiveValue);
        if(totalValue > maxReceiveValue){
         continue;
        }
        maxReceiveValue -= totalValue;
      } else {
        totalValue = this.randomInt(100, 5000);
      }

      items.push({
        type: type,
        date:  date,
        name: classType,
        class: classType,
        installments: installments,
        totalValue: totalValue
      });
    }
    return items;
  }

  private randomDateLastYear(): Date {
    const currentDate = new Date();
    const pastYearDate = new Date();
    pastYearDate.setFullYear(currentDate.getFullYear() - 1);
    pastYearDate.setMonth(currentDate.getMonth() + 1);

    return new Date(pastYearDate.getTime() + Math.random() * (currentDate.getTime() - pastYearDate.getTime()));
  }

  private currentDateThisMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), Math.floor(Math.random() * currentDate.getDate()) + 1)
  }

  private getClassTypeForCategory(type: CategoryType): ClassType {
    const receiveClasses = [ClassType.SALARY, ClassType.LOAN, ClassType.INVESTMENT, ClassType.OTHER];
    const expenseClasses = [ClassType.LOAN, ClassType.INVESTMENT, ClassType.CREDIT_CARD, ClassType.OTHER];
    const classes = type === CategoryType.RECEIVE ? receiveClasses : expenseClasses;
    return classes[this.randomInt(0, classes.length - 1)];
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
}
