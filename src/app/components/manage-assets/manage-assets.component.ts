import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { CategoryType } from 'app/enums/category-type';
import { ClassType } from 'app/enums/class-type';
import { AssetService } from 'app/services/asset.service';
import { Chart, registerables } from 'chart.js';
import { ManageAssetModalComponent } from '../manage-asset-modal/manage-asset-modal.component';
import { ActionType } from 'app/enums/action-type';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-assets',
  templateUrl: './manage-assets.component.html',
  styleUrls: ['./manage-assets.component.scss'],
})
export class ManageAssetsComponent implements OnInit, AfterViewInit {
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('assetTypeChart') assetTypeChart: ElementRef;

  classTypeList = Object.values(ClassType);
  categoryTypeList = Object.values(CategoryType);
  selectedCategoryType: CategoryType;
  totalValuesByCategory: number[] = [];
  
  range: FormGroup;

  filterGroup: FormGroup;

  totalAreaChart: any;
  colors = [];

  edittedAsset: any;

  assets = [];
  selectedValues: string[] = [];

  constructor(private router: Router,
    private assetService: AssetService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) { }

  ngOnInit() {
    const savedState = sessionStorage.getItem('savedState');
    const state = savedState ? JSON.parse(savedState) : history.state;

    if (state && state.type) {
      history.state.type = state.type;
      this.selectedCategoryType = state.type;
    } else {
      this.selectedCategoryType = CategoryType.RECEIVE;
    }

    this.assets = this.assetService.getAll();

    this.filterGroup = this.fb.group({
      name: [''],
      category: [''],
      class: [''],
      minValue: [''],
      maxValue: [''],
      dateRange: this.range
    });

    let lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    this.range = new FormGroup({
      start: new FormControl<Date | null>(lastMonth),
      end: new FormControl<Date | null>(new Date())
    });

    this.updateAssetTypes();
    sessionStorage.removeItem('savedState');
  }

  ngAfterViewInit() {
    this.createChart();
    this.updateChartData();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    const savedState = sessionStorage.getItem('savedState');
    const state = savedState ? JSON.parse(savedState) : history.state;

    if (state && state.type || this.selectedCategoryType) {
      sessionStorage.setItem('savedState', JSON.stringify(state));
    }
  }

  get activeCategoryType() {
    return this.categoryTypeList[this.getSelectedIndex];
  }

  get assetsInCategory() {
    return this.assets.filter(asset => asset.type === this.selectedCategoryType);
  }

  get getSelectedIndex() {
    return this.categoryTypeList.indexOf(this.selectedCategoryType);
  }

  get isMobile() {
    return window.innerWidth <= 991;
  }

  get tableColumns() {
    if(this.isMobile){
      return ['date', 'name', 'amount', 'star'];
    } else {
      return ['date', 'name', 'class', 'installments', 'amount', 'star'];
    }
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedCategoryType = this.categoryTypeList[event.index];
    this.updateChartData();
    this.updateAssetTypes();
    this.assets?.map(asset => asset.editMode = false);
  }

  createChart() {
    if (this.assetTypeChart) {
      const canvas = this.assetTypeChart.nativeElement as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
  
      if (this.totalAreaChart) {
        this.totalAreaChart.destroy(); // Destruir a instância anterior do gráfico
      }
  
      this.totalAreaChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: this.totalValuesByCategory,
            backgroundColor: this.getBackgroundColor(),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false // Remove a legenda do gráfico
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  // Você pode modificar o que é mostrado na tooltip aqui se necessário
                  let label = context.dataIndex == 0 ? 'Despesas' : 'Receitas';
                  if (label) {
                    label += ': ';
                  }
                  label += context.formattedValue;
                  return label;
                }
              }
            }
          }
        }
      });
    }
  }

  getBackgroundColor() {
    if(this.selectedCategoryType === CategoryType.RECEIVE) {
        return ['rgba(0, 0, 0, 0)', 'rgb(10, 200, 144)'];
    } else {
        return ['rgb(200, 9, 9)', 'rgba(0, 0, 0, 0)'];
    }
  }

  getTotalValueByClass(classType: ClassType) {
    const total = this.assets
      .filter(asset => asset.type === this.selectedCategoryType && asset.class === classType)
      .reduce((acc, asset) => acc + asset.amount, 0);
    return total;
  }

  isSelected(type: string): boolean {
    return this.selectedValues.includes(type);
  }
  
  updateChartData() {
    // Calcula o total geral
    const totalGeral = this.assets.reduce((acc, asset) => acc + asset.amount, 0);
  
    // Calcula o total para a categoria selecionada (e.g., "Receitas")
    const totalPorCategoriaSelecionada = this.assets
      .filter(asset => asset.type === this.selectedCategoryType)
      .reduce((acc, asset) => acc + asset.amount, 0);
  
    let totalSelecionado = 0;
    if (this.selectedValues.length > 0) {
      // Soma dos ativos selecionados dentro da categoria selecionada
      totalSelecionado = this.assets
        .filter(asset => asset.type === this.selectedCategoryType && this.selectedValues.includes(asset.class))
        .reduce((acc, asset) => acc + asset.amount, 0);
    } else {
      // Usa o total da categoria se nenhuma classe específica estiver selecionada
      totalSelecionado = totalPorCategoriaSelecionada;
    }
  
    // Calcula a porcentagem que o total selecionado representa do total geral
    const quantiaRestante = totalGeral - totalSelecionado;
  
    if(this.selectedCategoryType === CategoryType.RECEIVE) {
    // Atualiza o gráfico com a porcentagem calculada
    this.totalValuesByCategory = [quantiaRestante, totalSelecionado];
    } else {
      this.totalValuesByCategory = [totalSelecionado, quantiaRestante];
    }

    if(this.totalAreaChart) {
      this.totalAreaChart.data.datasets[0].data = this.totalValuesByCategory;
      this.totalAreaChart.data.datasets.forEach((dataset) => {
        dataset.backgroundColor = this.getBackgroundColor();
      });
      this.totalAreaChart.update();
    }
  }

  updateAssetTypes() {
    this.classTypeList = Object.values(ClassType);
    if(this.selectedCategoryType === CategoryType.RECEIVE) {
      this.classTypeList = this.classTypeList.filter(type => type !== ClassType.CREDIT_CARD);
    } else {
      this.classTypeList = this.classTypeList.filter(type => type !== ClassType.SALARY);
    }
  }
 

  toggleSelection(type: string) {
    const index = this.selectedValues.indexOf(type);
    if (index > -1) {
      this.selectedValues.splice(index, 1); // Remova se já estiver selecionado
    } else {
      this.selectedValues.push(type); // Adicione se não estiver selecionado
    }
    this.updateChartData();
  }

  addRow() {
    const newAsset = {
      editMode: true,
      type: this.selectedCategoryType,
      name: '',
      class: '',
      amount: 0,
      installments: 0,
      date: new Date()
    };
    this.openModal(newAsset, ActionType.CREATE);
  }

  detailsRow(row) {
    this.openModal(row, ActionType.INFO);
  }

  editRow(row) {
    this.openModal(row, ActionType.EDIT);
  }

  deleteRow(row) {
    const index = this.assets.indexOf(row);
    if (index > -1) {
      this.assets.splice(index, 1);
      this.snackBar.open('Ativo excluído com sucesso.', 'Desfazer', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['custom-snackbar']
      }).onAction().subscribe(() => {
        this.assets.splice(index, 0, row);
      });
    }
  }

  saveRow(row) {
    if (this.validateEditForm()) {
      return;
    }

    row = Object.assign(row, this.edittedAsset);
    row.id = row.id || this.assets.length + 1;
    row.editMode = false;
  }

  cancelEdit(row) {
    const index = this.assets.indexOf(row);
    if (index > -1) {
      if (row.id) {
        row.editMode = false;
      } else {
        this.assets.splice(index, 1);
      }
    }
  }

  openModal(row: any, type: ActionType){
    this.dialog.open(ManageAssetModalComponent, {
      width: '500px',
      data: { actionType: type, asset: row }
    });
  }

  onSubmit(form, isValid) {
    if (isValid) {
      this.router.navigate(['/dashboard']);
    }
  }

  validateEditForm(): boolean {
    let isEditMode = this.assets.find(asset => asset.editMode);
    if (isEditMode && (!this.edittedAsset?.name || !this.edittedAsset?.type || !this.edittedAsset?.class)) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios.', 'Fechar', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['custom-snackbar']
      });
      return true;
    }
    return false;
  }

}
