import ShortcutClient, { StorySlim } from '@shortcut/client';
import { exec } from 'child_process';
import * as vscode from 'vscode';

export const commitStory = (task:any) => {
    const commitMessage = task.label;
    const options = { cwd: vscode.workspace.workspaceFolders? vscode.workspace.workspaceFolders[0].uri.path:undefined };
    const packageJson = require(`${options.cwd}/package.json`);
    const token:string = vscode.workspace.getConfiguration('shortcutViewer').get('token')||'';
    const closedState:number|undefined = vscode.workspace.getConfiguration('shortcutViewer').get('closedStage');
    exec('git add .',options, (addError, addStdout, addStderr) => {
        if (addError) {
            vscode.window.showErrorMessage(`Git add failed: ${addStderr}`);
            return;
        }
        exec(`git commit -m "${commitMessage}"`,options, (commitError, commitStdout, commitStderr) => {
            if (commitError) {
                vscode.window.showErrorMessage(`Git commit failed: ${commitStderr}`);
                return;
            }
            const commitUrl = `https://your-repo-url/commit/${commitStdout.trim()}`;
            vscode.window.showInformationMessage(`Committed: ${commitMessage}`);
            // Store the commit URL in a variable or use it as needed
            console.log('Commit URL:', commitUrl);
            if(closedState && token) {
                const shortcurClient = new ShortcutClient(token);
                shortcurClient.updateStory(task.shortcutTask.id, {workflow_state_id: closedState});
                const version = packageJson.version;
                const name = packageJson.name;
                shortcurClient.createStoryComment(task.shortcutTask.id, {text: `Committed: ${commitUrl}`});
                shortcurClient.updateStory(task.shortcutTask.id, {labels: [{name: `${name}-${version}`,color: '#FC5000'}]});
                // shortcurClient.listLabels({slim:true}).then((result) => {
                //     const label = result.data.find((label:any) => label.name === `${name}-${version}`);
                //     if(!label) {
                //     }
                // }
            }
        });
    });
}

export const copyGitMessage = (task:any) => {
    const shortcutTask:StorySlim = task.shortcutTask;
    const text = `[sc-${shortcutTask.id}] [${shortcutTask.story_type}] ${shortcutTask.name}`;
    vscode.env.clipboard.writeText(text);
    vscode.window.showInformationMessage(`Copied: ${task.label}`);
}