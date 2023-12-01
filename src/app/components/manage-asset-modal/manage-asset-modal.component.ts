import { Component, Inject, Input, OnInit } from '@angular/core';
import { ActionType } from 'app/enums/action-type';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryType } from 'app/enums/category-type';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClassType } from 'app/enums/class-type';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-manage-asset-modal',
  templateUrl: './manage-asset-modal.component.html',
  styleUrls: ['./manage-asset-modal.component.scss'],
})
export class ManageAssetModalComponent implements OnInit {
  title: string;

  private _actionType: ActionType;
  private asset: any;
  assetForm: FormGroup;
  categoryTypeList: CategoryType[];
  classTypeList: ClassType[];

  constructor(public dialogRef: MatDialogRef<ManageAssetModalComponent>, 
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.actionType = this.data.actionType;
    this.asset = this.data.asset;
    this.assetForm = this.fb.group({
      name: [this.asset?.name],
      type: [this.asset?.type],
      class: [this.asset?.class],
      date: [new Date()],
      installments: [this.asset?.installments],
      amount: [this.asset?.amount],
    });

    this.categoryTypeList = Object.values(CategoryType);
    this.classTypeList = Object.values(ClassType);

    this.setTitle();
  }

  @Input()
  set actionType(value: ActionType) {
    this._actionType = value;
    this.setTitle();
  }

  get actionType(): ActionType {
    return this._actionType;
  }

  private setTitle(): void {
    switch (this.actionType) {
      case ActionType.CREATE:
        this.title = "Cadastrar";
        break;
      case ActionType.EDIT:
        this.title = "Editar";
        break;
      case ActionType.INFO:
        this.title = "Informações de";
        break;
      default:
        this.title = "";
    }

    if (this.asset?.type == CategoryType.RECEIVE) {
      this.title += " Recebimento";
    } else {
      this.title += " Despesa";
    }
  }

  get isDetailModal(): boolean {
    return this.actionType == ActionType.INFO;
  }

  onSubmit() {
    //Função não implementada
    this.snackBar.open("Função ainda não implementada", "Fechar", {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
    });
    this.dialogRef.close(this.assetForm.value);
  }
}
