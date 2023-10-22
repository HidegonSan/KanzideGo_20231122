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
 * @param Judge
 * @desc 更新判定が終わったことを示すスイッチの番号。
 * @type number
 * @default 228
 *
 * @param isUpdate
 * @desc 更新中であることを示すスイッチの番号。
 * @type number
 * @default 230
 *
 * @param pictureName
 * @desc 最新バージョンであることを示すピクチャの名前
 * @default Party_Oa
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
    var initialSHA = String(parameters['InitialSHA'] || 'initial_SHA');
    var Judge = Number(parameters['Judge'] || 228);
    var isUpdate = Number(parameters['isUpdate'] || 230);
    var pictureName = parameters['pictureName'] || 'Party_Oa';

    const fs = require('fs');
    const path = require('path');

    var lastCommitSHA = localStorage.getItem('lastCommitSHA');

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = async function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'DoUpdate') {
            if (navigator.onLine && !Utils.isOptionValid('test')) {
                commiting();
            } else if (Utils.isOptionValid('test')){
                ResetRepo();
            }
        }
    }
    async function ResetRepo() {
        console.log("コミットのリセットを開始します");
        lastCommitSHA = initialSHA;
        localStorage.setItem('lastCommitSHA', lastCommitSHA);
        console.log("コミットがリセットされました。");

    }

    const delay = 100; // 0.1秒（100ミリ秒）

    function delayAsync(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function commiting() {
        var latestCommitSHA = await getLatestCommitSHA(owner, repo);
        if (lastCommitSHA === undefined || lastCommitSHA === null) {
            lastCommitSHA = initialSHA;
        }
        if (lastCommitSHA !== latestCommitSHA) {
            $gameSwitches.setValue(isUpdate, true);
            $gameMap._interpreter.pluginCommand("D_TEXT", [`バージョン更新:${lastCommitSHA}→${latestCommitSHA}`, "20"]);
            $gameScreen.showPicture(55, null, 0, 10, 10, 100, 100, 255, 0);
            const commitChanges = await getCommitChanges(owner, repo, lastCommitSHA, latestCommitSHA);
            const downloadPromises = [];
            var progress = 0;
            for (const file of commitChanges) {
                const fileName = path.join(downloadPath, file.filename);

                if (file.status === 'removed') {
                    if (fs.existsSync(fileName)) {
                        fs.unlinkSync(fileName);
                        $gameMap._interpreter.pluginCommand("D_TEXT", [`${fileName}を消去しました。`, "20"]);
                        $gameScreen.showPicture(56, null, 0, 300, 35, 100, 100, 255, 0);
                    }
                } else {
                    if (!fs.existsSync(fileName) || fs.readFileSync(fileName, 'utf8') !== file.content) {
                        const downloadPromise = downloadFile(file, fileName)
                            .then(() => {
                                $gameMap._interpreter.pluginCommand("D_TEXT", [`${fileName}をダウンロードしました`, "20"]);
                                progress += 1;
                                $gameScreen.showPicture(56, null, 0, 300, 35, 100, 100, 255, 0);
                                $gameMap._interpreter.pluginCommand("D_TEXT", [`ダウンロード中... ${progress} / ${commitChanges.length}`, "20"]);
                                $gameScreen.showPicture(57, null, 0, 10, 35, 100, 100, 255, 0);
                            })
                            .catch(error => {
                                console.error(`Error: ${error.message}`);
                            });
                        downloadPromises.push(downloadPromise);
                    }
                }

                await delayAsync(delay);

            }

            await Promise.all(downloadPromises);

            lastCommitSHA = latestCommitSHA;
            localStorage.setItem('lastCommitSHA', lastCommitSHA);

            $gameSwitches.setValue(isUpdate, false);

            $gameMap._interpreter.pluginCommand("D_TEXT", [`処理完了`, "20"]);
            $gameScreen.showPicture(55, null, 0, 10, 10, 100, 100, 255, 0);
            setTimeout(function () {
                $gameMap._interpreter.pluginCommand("D_TEXT", [`3秒後にシャットダウンします。（閉じない場合はウィンドウの閉じるボタンを押してください）`, "20"]);
                $gameScreen.showPicture(55, null, 0, 10, 10, 100, 100, 255, 0);
                setTimeout(function () {
                    $gameMap._interpreter.pluginCommand("D_TEXT", [`2秒後にシャットダウンします。（閉じない場合はウィンドウの閉じるボタンを押してください）`, "20"]);
                    $gameScreen.showPicture(55, null, 0, 10, 10, 100, 100, 255, 0);
                    setTimeout(function () {
                        $gameMap._interpreter.pluginCommand("D_TEXT", [`1秒後にシャットダウンします。（閉じない場合はウィンドウの閉じるボタンを押してください）`, "20"]);
                        $gameScreen.showPicture(55, null, 0, 10, 10, 100, 100, 255, 0);
                        setTimeout(function () {
                            //window.close();
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        } else {
            $gameSwitches.setValue(Judge, true);
            $gameScreen.showPicture(55, pictureName, 0, 0, 0, 100, 100, 255, 0);
        }
    }

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

    async function getCommitChanges(owner, repo, fromSHA, toSHA) {
        try {
            const url = `https://api.github.com/repos/${owner}/${repo}/compare/${fromSHA}...${toSHA}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                return data.files;
            }
        } catch (error) {
            $gameMap._interpreter.pluginCommand("D_TEXT", [`コミットエラー！報告をお願いします`, "40"]);
            $gameScreen.showPicture(55, null, 1, 640, 120, 100, 100, 255, 0);
        }
    }
    async function downloadFile(file, fileName) {
        const fileUrl = file.raw_url;

        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    reject(new Error(`Failed to download file: ${response.statusText}`));
                    return;
                }

                const fileContent = await response.arrayBuffer();
                createDirectoryRecursive(path.dirname(fileName.replace(/\\/g, '/')));
                fs.writeFileSync(fileName, Buffer.from(fileContent), 'binary');
                console.log('ダウンロード: ' + file.filename);
                resolve();
            } catch (error) {
                reject(new Error(`ファイルのダウンロード中にエラーが発生しました: ${error.message}`));
            }
        });
    }

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
