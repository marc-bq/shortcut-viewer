# Shortcut Viewer

Shortcut Viewer is a tool designed to view your shortcut stories and create a commit using the story name

![Screenshot](media/screenshot.gif)

## Features

- View your workflow
- View your stories for every stage
- Open story link
- Generate commit message
- Commit using story git message
- Label commited story using the version from your package

## Configuration

* `shortcutViewer.token`: Token for your shortcut account
* `shortcutViewer.workspaceid`: The workspace ID that you want to see
* `shortcutViewer.closedStage`: The stage ID for closed stories (stories will be moved there after commiting)

## Contributing

If you would like to contribute to Shortcut Viewer, please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m "Description of your changes"
    ```
4. Push to the branch:
    ```sh
    git push origin feature-branch
    ```
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
