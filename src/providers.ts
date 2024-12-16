import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ShortcutService } from './shortcut.service';
import { Story } from '../types';
import ShortcutClient from '@shortcut/client';

// export class NodeDependenciesProvider implements vscode.TreeDataProvider<any> {
  
//   private scToken: string;
//   private shortcutService: any;
//   constructor(token:string) {
//     this.scToken = token;
//     this.shortcutService = new ShortcutService(token);
//     console.log('SCToken:', this.scToken);
//   }
//   getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
//    return {label: 'Hello World', collapsibleState: 1};
//   }
//   getChildren(element?: any): vscode.ProviderResult<any[]> {
//     return this.shortcutService.getStory('46832').then((story:Story) => {
//       console.log('Story:', story); 
//       return [{
//         collapsibleState: 1,
//         label: story.name,
//         iconPath: new vscode.ThemeIcon('close-dirty', new vscode.ThemeColor('charts.yellow')),
//         tooltip: story.description,
//         description: story.description,
//       }];
//      });
//   }


  
// }

export class TasksProvider implements vscode.TreeDataProvider<any> {

  private _shortcut: ShortcutClient;
  private _onDidChangeTreeData: vscode.EventEmitter<any | undefined | null | void> = new vscode.EventEmitter<any | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<any | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
  constructor(token:string) {
    this._shortcut = new ShortcutClient(token);
  }
  getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: any): vscode.ProviderResult<any[]> {
    if(element) {
      return this._shortcut.searchStories({query:`state:${element.stateId}`}).then((stories) => {
        return stories.data.data.map((story) => {
          let icon = "issues";
          if(story.story_type === 'bug'){
            icon = 'bug';
          }else if(story.story_type === 'chore'){
            icon = 'wrench';
          }

          let color;
          if(story.story_type === 'bug'){
            color = 'charts.red';
          }else if(story.story_type === 'chore'){
            color = 'charts.gray';
          }else{
            color = 'charts.yellow';
          }
          const severity = story.custom_fields?.find((field) => field.value.includes("Severity"));
          return {
            label: story.name,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            iconPath: new vscode.ThemeIcon(icon, new vscode.ThemeColor(color)),
            tooltip: severity?.value ? `(${severity?.value}) ${story.description}`: story.description,
            description: severity?.value||story.description,
          };
        });
      });
    }
      else{

        return  this._shortcut.getWorkflow(500000029).then((workflow) => {
         return workflow.data.states.map((state) => {
          let color =  'charts.yellow';
          if(state.type === 'done'){
            color = 'charts.green';
          }else if(state.type === 'unstarted'){
            color = 'charts.gray';
          }
           return {
             label: state.name,
             collapsibleState: 1,
             iconPath: new vscode.ThemeIcon('close-dirty', new vscode.ThemeColor(color)),
             tooltip: state.description,
             description: state.description,
             stateId: state.id,
           };
         });
       });
      }
  }

}
