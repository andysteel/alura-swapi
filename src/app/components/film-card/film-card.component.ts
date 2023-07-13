import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { CharactersService } from 'src/app/services/characters.service';
import { Film, FilmDataEnum } from 'src/app/types/films-response';
import { DataNode } from 'src/app/types/tree-data-film';

@Component({
  selector: 'app-film-card',
  templateUrl: './film-card.component.html',
  styleUrls: ['./film-card.component.scss']
})
export class FilmCardComponent implements OnInit {

  @Input({required: true})
  film!: Film;

  isLoading = false;

  treeData: DataNode[] = [];
  treeControl = new NestedTreeControl<DataNode>(node => node.children);
  treeDataSource = new MatTreeNestedDataSource<DataNode>();
  hasChild = (_: number, node: DataNode) => !!node.children && node.children.length > 0;
  dataChange = new BehaviorSubject<DataNode[]>([]);

  constructor(
    private characterService: CharactersService,
    private snackBar: MatSnackBar) {}


  ngOnInit(): void {
    this.createFirstLevelTreeData(this.film);
    this.treeDataSource.data = this.treeData;
    this.dataChange.subscribe(data => {
      this.treeData = data;
      this.treeDataSource.data = this.treeData;
    })
  }

  createFirstLevelTreeData(film: Film) {
    if(film.characters && film.characters.length > 0) {

      const characterNode: DataNode = {name: FilmDataEnum.CHARACTERS, children: [{name: ''}]};
      this.treeData.push(characterNode);
      this.dataChange.next(this.treeData);
    }
  }

  createTreeData(film: Film, isExpanded: boolean) {
    const firstLi = document.querySelector<HTMLUListElement>(`#film-${film.episode_id} #children > ul > li`);
    if(firstLi?.textContent === '' && isExpanded && film.characters && film.characters.length > 0) {
      const nodes: DataNode[] = [];
      film.characters.forEach( charact => {
        this.isLoading = true;
        this.characterService.getCharacterByUrl(charact)
        .subscribe({
          next: response => {
            const node: DataNode = {name: response.name};
            this.isLoading = false;
            nodes.push(node);
          },
          error: error => {
            this.isLoading = false;
            this.snackBar.open(error.message, 'Error', {verticalPosition: 'top', duration: 5000})
          },
          complete: () => {
            this.treeData.forEach(node => {
              if(node.name === FilmDataEnum.CHARACTERS) {
                node.children = [...nodes];
              }
            });
            this.isLoading = false;
            this.dataChange.next(this.treeData);
          }
        });
      });
    }
  }
}
