import { CategoryType } from "app/enums/category-type";
import { ClassType } from "app/enums/class-type";

export class CategoryChartModel {
    type: CategoryType;
    date: Date;
    name: string;
    class: ClassType;
    installments?: number;
    totalValue: number;
}
  