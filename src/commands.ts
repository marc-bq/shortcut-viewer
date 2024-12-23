import { StorySlim } from '@shortcut/client';
import { exec } from 'child_process';
import * as vscode from 'vscode';

export const commitStory = (task:any) => {
    const commitMessage = task.label;
    const options = { cwd: vscode.workspace.workspaceFolders? vscode.workspace.workspaceFolders[0].uri.path:undefined };
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
        });
    });
}

export const copyGitMessage = (task:any) => {
    const shortcutTask:StorySlim = task.shortcutTask;
    const text = `[sc-${shortcutTask.id}] [${shortcutTask.story_type}] ${shortcutTask.name}`;
    vscode.env.clipboard.writeText(text);
    vscode.window.showInformationMessage(`Copied: ${task.label}`);
}