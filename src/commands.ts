import ShortcutClient, { CreateLabelParams, LabelSlim, StorySlim } from '@shortcut/client';
import { exec } from 'child_process';
import * as vscode from 'vscode';

export const commitStory = (task: any) => {
  let commitMessage = `[sc-${task.shortcutTask.id}] [${task.shortcutTask.story_type}] ${task.shortcutTask.name}`;
  commitMessage = commitMessage.replace(/"/g, '\\"');
  const options = {
    cwd: vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : undefined,
  };

  exec('git status --porcelain', options, (statusError, statusStdout, statusStderr) => {
    if (statusError) {
      vscode.window.showErrorMessage(`Git status failed: ${statusStderr}`);
      return;
    }
    if (!statusStdout) {
      vscode.window.showInformationMessage('No changes to commit.');
      return;
    }
    // Proceed with adding and committing changes
    exec('git add .', options, (addError, addStdout, addStderr) => {
      if (addError) {
        vscode.window.showErrorMessage(`Git add failed: ${addStderr}`);
        return;
      }
      exec(`git commit -m "${commitMessage}"`, options, async (commitError, commitStdout, commitStderr) => {
        if (commitError) {
          vscode.window.showErrorMessage(`Git commit failed: ${commitStderr}`);
          return;
        }
        const commitUrl = `https://your-repo-url/commit/${commitStdout.trim()}`;
        vscode.window.showInformationMessage(`Committed: ${commitMessage}`);
        // Store the commit URL in a variable or use it as needed
        console.log('Commit URL:', commitUrl);
        await closeTask(task, options.cwd);
      });
    });
  });
};

export const copyGitMessage = (task: any) => {
  const shortcutTask: StorySlim = task.shortcutTask;
  const text = `[sc-${shortcutTask.id}] [${shortcutTask.story_type}] ${shortcutTask.name}`;
  vscode.env.clipboard.writeText(text);
  vscode.window.showInformationMessage(`Copied: ${task.label}`);
};

export const goToSettings = () => {
  vscode.commands.executeCommand('workbench.action.openSettings', 'shortcutViewer');
};

export const closeStory = async (task: any) => {
  closeTask(task, vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.path : undefined);
};

async function closeTask(task: any, cwd: string | undefined) {
  const packageJson = require(`${cwd}/package.json`);
  const token: string = vscode.workspace.getConfiguration('shortcutViewer').get('token') || '';
  const closedState: number | undefined = vscode.workspace.getConfiguration('shortcutViewer').get('closedStage');
  if (closedState && token) {
    const shortcurClient = new ShortcutClient(token);
    await shortcurClient.updateStory(task.shortcutTask.id, {
      workflow_state_id: closedState,
    });
    const packageField: string = vscode.workspace.getConfiguration('shortcutViewer').get('labelName') || 'name';
    const version = packageJson.version;
    const name = packageJson[packageField];
    // await shortcurClient.createStoryComment(task.shortcutTask.id, {text: `Committed: ${commitUrl}`})
    const story = await shortcurClient.getStory(task.shortcutTask.id);
    let labels = (story.data.labels || []).concat([{ name: `${name}-${version}`, description: '' } as LabelSlim]);

    const createLabels = labels.map((label) => {
      return { name: label.name, color: label.color, description: label.description ?? undefined } as CreateLabelParams;
    });

    try {
      await shortcurClient.updateStory(task.shortcutTask.id, {
        labels: createLabels,
      });
    } catch (error) {
      console.error('Error updating story:', error);
    }
    // Refresh the tree view
    vscode.commands.executeCommand('shortcut-viewer.reloadShortcutTasks');
    // shortcurClient.listLabels({slim:true}).then((result) => {
    //     const label = result.data.find((label:any) => label.name === `${name}-${version}`);
    //     if(!label) {
    //     }
    // }
  }
}
