// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {  TasksProvider } from './providers';
import { todo } from 'node:test';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const rootPath =
	vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
	  ? vscode.workspace.workspaceFolders[0].uri.fsPath
	  : undefined;

  const token:string = vscode.workspace.getConfiguration('shortcutViewer').get('token')||'';
  console.log('Token:', token);

  const tasksProvider = new TasksProvider(token);
  vscode.window.registerTreeDataProvider('shortcut-tasks', tasksProvider);

	console.log('Congratulations, your extension "shortcut-viewer" is now active!');
	const disposable = vscode.commands.registerCommand('shortcut-viewer.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Shortcut viewer!');
	});
	
	const reload = vscode.commands.registerCommand('shortcut-viewer.reloadShortcutTasks', () => {
		// vscode.window.showInformationMessage('Reload hola ke ase!');
		tasksProvider.refresh();

	});
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
