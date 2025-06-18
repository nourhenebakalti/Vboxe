import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Notification } from "src/app/utils/Notification";

@Component({
  selector: "app-paginator",
  templateUrl: "./paginator.component.html",
  styleUrls: ["./paginator.component.scss"],
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() userTab: Notification[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() pagedUserTabEmitter: EventEmitter<Notification[]> =
    new EventEmitter<Notification[]>();

  pageSize: number = 2; // Taille de la page par défaut
  pagedUserTab: Notification[] = [];
  dataSource: any;
  //dataSource = new MatTableDataSource<Notification>(this.userTab);
  currentPage: number = 0;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userTab && changes.userTab.currentValue) {
      this.dataSource = new MatTableDataSource<Notification>(
        changes.userTab.currentValue
      );
      this.dataSource.paginator = this.paginator;
      this.updateDisplayedItems();
    }
    this.pagedUserTabEmitter.emit(this.userTab.slice(0, this.pageSize));
  }

  ngOnInit(): void {
    if (this.userTab) {
      this.dataSource = new MatTableDataSource<Notification>(this.userTab);
      this.dataSource.paginator = this.paginator;
      this.updateDisplayedItems();
    }
    // this.pagedUserTab = this.userTab.slice(0, this.pageSize);
  }
  onPageChange(event: PageEvent): void {
    // Mettez à jour le numéro de page actuel
    this.currentPage = event.pageIndex;
    // Mettez à jour les éléments affichés en fonction de la page actuelle
    this.updateDisplayedItems();
  }

  // Méthode pour mettre à jour les éléments affichés en fonction de la page actuelle
  updateDisplayedItems(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.userTab.length);
    this.pagedUserTab = this.userTab.slice(startIndex, endIndex);
    this.pagedUserTabEmitter.emit(this.pagedUserTab);
  }
}
