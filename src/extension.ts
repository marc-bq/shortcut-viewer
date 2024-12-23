// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {  TasksProvider } from './providers';
import { todo } from 'node:test';
import { commitStory, copyGitMessage } from './commands';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const rootPath =
	vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
	  ? vscode.workspace.workspaceFolders[0].uri.fsPath
	  : undefined;

  const token:string = vscode.workspace.getConfiguration('shortcutViewer').get('token')||'';
  const workspaceId:number|undefined = vscode.workspace.getConfiguration('shortcutViewer').get('workspaceid');

  console.log('Token:', token);
  if(!token ) {
	vscode.window.showErrorMessage('Please provide a valid token');
	return;
}	
	if(!workspaceId) {
		vscode.window.showErrorMessage('Please provide a valid workspace id');
		return;
	}
  const tasksProvider = new TasksProvider(token,workspaceId);
  vscode.window.registerTreeDataProvider('shortcut-tasks', tasksProvider);

	console.log('Congratulations, your extension "shortcut-viewer" is now active!');
	const disposable = vscode.commands.registerCommand('shortcut-viewer.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Shortcut viewer!');
	});
	
	const reload = vscode.commands.registerCommand('shortcut-viewer.reloadShortcutTasks', () => tasksProvider.refresh());
	vscode.commands.registerCommand('shortcut-viewer.openStory', (task) => {
		vscode.env.openExternal(vscode.Uri.parse(task.url));
	});

	vscode.commands.registerCommand('shortcut-viewer.commitStory',commitStory);
	vscode.commands.registerCommand('shortcut-viewer.copyGitMessage',copyGitMessage);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
