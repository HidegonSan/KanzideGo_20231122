//=============================================================================
// GitHub Auto Updater Plugin
//=============================================================================
/*:
 * @plugindesc Allows automatic updates from a GitHub repository.
 * @version 1.0.0
 * @author Your Name
 *
 * @param Owner
 * @desc GitHubユーザーの名前
 * @default your_owner
 *
 * @param Repo
 * @desc GitHubレポジトリの名前
 * @default your_repo
 * 
 * @param DPath
 * @desc ダウンロードする場所(基本は./でいいはずです)
 * @default ./
 * 
 * @param InitialSHA
 * @desc 最初期バージョンのSHA
 * @default initial_SHA
 * 
 * @param isUpdate
 * @desc 更新中であることを示すスイッチの番号。
 * @type number
 * @default 230
 * 
 * @help
 * Githubのほうに更新があったとき、変更箇所をダウンロードして適切な場所に配置してくれるスクリプトですが、まだいろいろと問題点があります。
 * 
 */

(function () {
    var parameters = PluginManager.parameters('GitHubAutoUpdater');
    var owner = String(parameters['Owner'] || 'your_owner');
    var repo = String(parameters['Repo'] || 'your_repo');
    var downloadPath = String(parameters['DPath'] || './');
    var initialSHA = String(parameters['InitialSHA'] || ' initial_SHA');
    var isUpdate = Number(parameters['isUpdate'] || 230);

    const fs = require('fs');
    const path = require('path');

    var lastCommitSHA = localStorage.getItem('lastCommitSHA');

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = async function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'DoUpdate') {
            if (navigator.onLine && !Utils.isOptionValid('test')) {
                commiting();
            }
        }
    }
    async function commiting() {
        var latestCommitSHA = await getLatestCommitSHA(owner, repo);
        if (lastCommitSHA === undefined || lastCommitSHA === null) {
            lastCommitSHA = initialSHA;
        }
        if (lastCommitSHA !== latestCommitSHA) {
            $gameSwitches.setValue(isUpdate, true);
            const commitChanges = await getCommitChanges(owner, repo, lastCommitSHA, latestCommitSHA);
            for (const file of commitChanges) {
                const fileName = path.join(downloadPath, file.filename);
                if (file.status === 'removed') {
                    if (fs.existsSync(fileName)) {
                        fs.unlinkSync(fileName);
                    }
                } else {
                    if (!fs.existsSync(fileName) || fs.readFileSync(fileName, 'utf8') !== file.content) {
                        await downloadFile(file);
                    }
                }
            }
            lastCommitSHA = latestCommitSHA;
            localStorage.setItem('lastCommitSHA', lastCommitSHA);

            $gameSwitches.setValue(isUpdate, false);
        }
    }


    /*
    async function getLatestCommitSHA(owner, repo) {
        try {
            var url = `https://api.github.com/repos/${owner}/${repo}/commits/main`;
            var response = require('child_process').execSync(`curl -s "${url}"`, { encoding: 'utf8' });
            var data = JSON.parse(response);
            return data.sha;
        } catch (error) {
            var hoge = fuga;
            throw new Error(`GitHub APIからのコミットSHAの取得中にエラーが発生しました: ${error.message}`);
        }
    }
    */

    async function getLatestCommitSHA(owner, repo) {
        try {
            const url = `https://api.github.com/repos/${owner}/${repo}/commits/main`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                return data.sha;
            } else {
                throw new Error(`GitHub APIからのコミットSHAの取得中にエラーが発生しました: ${response.statusText}`);
            }
        } catch (error) {
            throw new Error(`GitHub APIからのコミットSHAの取得中にエラーが発生しました: ${error.message}`);
        }
    }

    /*
    async function getCommitChanges(owner, repo, fromSHA, toSHA) {
        try {
            var url = `https://api.github.com/repos/${owner}/${repo}/compare/${fromSHA}...${toSHA}`;
            var response = require('child_process').execSync(`curl -s "${url}"`, { encoding: 'utf8' });
            var data = JSON.parse(response);
            return data.files;
        } catch (error) {
            var hoge = nuga;
            throw new Error(`GitHub APIからのコミット間の変更の取得中にエラーが発生しました: ${error.message}`);
        }
    }
    */

    async function getCommitChanges(owner, repo, fromSHA, toSHA) {
        try {
            const url = `https://api.github.com/repos/${owner}/${repo}/compare/${fromSHA}...${toSHA}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                return data.files;
            } else {
                throw new Error(`GitHub APIからのコミット間の変更の取得中にエラーが発生しました: ${response.statusText}`);
            }
        } catch (error) {
            throw new Error(`GitHub APIからのコミット間の変更の取得中にエラーが発生しました: ${error.message}`);
        }
    }

    async function downloadFile(file) {
        const fileUrl = file.raw_url;
        const fileResponse = await fetch(fileUrl);
        const fileContent = await fileResponse.arrayBuffer();
        const fileName = path.join(downloadPath, file.filename);

        try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`);
            }
            createDirectoryRecursive(path.dirname(fileName.replace(/\\/g, '/')));
            fs.writeFileSync(fileName, Buffer.from(fileContent), 'binary');
            console.log('ダウンロード: ' + file.filename);
        } catch (error) {
            throw new Error(`ファイルのダウンロード中にエラーが発生しました: ${error.message}`);
        }
    }

    /*
    async function DownLoad() {
        await downloadAllFiles("");
        storeCommitSHA(lastCommitSHA);
    }

    async function downloadAllFiles(dirPath = '') {
        const apiEndpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`;
        const response = await fetch(apiEndpoint);
        const contents = await response.json();

        for (const content of contents) {
            const contentPath = content.path;
            const contentUrl = content.download_url;
            const fullPath = path.join(downloadPath, contentPath);

            if (content.type === 'file') {
                // ファイルをダウンロード
                const fileResponse = await fetch(contentUrl);
                const fileContent = await fileResponse.arrayBuffer();
                createDirectoryRecursive(path.dirname(fullPath));
                fs.writeFileSync(fullPath, Buffer.from(fileContent), 'binary');
            } else if (content.type === 'dir') {
                await downloadAllFiles(contentPath);
            }
        }
    }
    */

    function createDirectoryRecursive(dirPath) {
        var normalizedPath = path.normalize(dirPath);
        var parts = normalizedPath.split(path.sep);

        for (var i = 1; i <= parts.length; i++) {
            var directoryPath = path.join.apply(null, parts.slice(0, i));
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath);
            }
        }
    }
})();
