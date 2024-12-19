import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ShortcutService } from './shortcut.service';
import { Story } from '../types';
import ShortcutClient, { MemberInfo, StorySlim } from '@shortcut/client';

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
  private _user: MemberInfo|undefined;
  private _shortcut: ShortcutClient;
  private _workspaceId: number;
  private _startedIteration: any;
  private _stories: StorySlim[]= [];
  private _onDidChangeTreeData: vscode.EventEmitter<any | undefined | null | void> = new vscode.EventEmitter<any | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<any | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
   constructor(token:string, workspaceId:number) {

    this._shortcut = new ShortcutClient(token);
    this._workspaceId = workspaceId;
    this.initialize();
  }
 private async searchStories(query:string) {
    let result = await this._shortcut.searchStories({query, page_size: 25});
    let stories= result.data.data;
    while (result.data.next) {
        const nextCursor = new URLSearchParams(result.data.next).get('next')||undefined;
        result = await this._shortcut.searchStories({ query, page_size:25,next: nextCursor });
        stories = stories.concat(result.data.data);
    }
    return stories;
}
  private async initialize() {
    this._user = (await this._shortcut.getCurrentMemberInfo()).data;
    this._startedIteration = (await this._shortcut.listIterations()).data.find((iteration) => iteration.status === 'started')?.id;
    this._stories = (await this._shortcut.listIterationStories(this._startedIteration,{includes_description: true})).data;
  }
  getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: any): vscode.ProviderResult<any[]> {
    if(element) {
      return this._stories
        .filter(story=>story.workflow_state_id===element.stateId)
        .filter((story) => story.owner_ids.some((ownerId)=> ownerId === this._user?.id))
        .map((story) => {
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
            description: severity?.value || story.description,
            url: story.app_url,
          };
        });
      // return this.searchStories(`state:${element.stateId} and owner:${this._user}`).then((stories) => {
      //   return stories
      // });
    }
      else{
        return  this._shortcut.getWorkflow(this._workspaceId).then((workflow) => {
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
