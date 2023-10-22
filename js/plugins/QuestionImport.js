//=============================================================================
// QuestionImport
//=============================================================================
/*:
 * @plugindesc jsonで問題保存
 *
 * @help
 * jsonで問題を保存して、Qjsonで問題が出てきます。(多分)
 * 現状2通りの取得方法があり、
 * 1:GitHubから取得する方法
 * 2:ローカルファイルから取得する方法
 * を使い分けています。
 * ブラウザで実行する場合だと2が使えないので必然的に1を使うことになります。
 * 動作的には2のほうが軽いはずです。
 * 現状はオンライン状態なら1、オフライン状態なら2を使うようになっています。
 * パラメータのOwnerとRepoはGitHub Auto Updaterと同じもので大丈夫です。
 * 使用時にはexcelDataファイル内にLv01~Lv07,Ca004を入れておくことで読み込んでくれます。
 * GitHubとローカルの両方に入れてください。
 * 
 * @author chuukunn
 *
 * @param Owner
 * @desc GitHubユーザーの名前
 * @default your_owner
 *
 * @param Repo
 * @desc GitHubレポジトリの名前
 * @default your_repo
 * 
 */

(function () {
    var parameters = PluginManager.parameters('QuestionImport');
    var owner = String(parameters['Owner'] || 'your_owner');
    var repo = String(parameters['Repo'] || 'your_repo');
    const keyDictionary = {
        '問題': '8',
        '解１': '9',
        '解２': '10',
        '解３': '11',
        '送前': '1057',
        '送後': '1058',
        '文上': '19',
        '文下': '20',
        '配列': '18',
        '長い': '169',
        'ジャ': '13',
        '文数': '14',
        'サブ': '16',
        'カジ': '1087',
        '珍回': '992'
    };


    // ゲーム開始時の処理
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.call(this);
        const existingData = {};
        if (navigator.onLine) {
            const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/excelData`;
            fetch(apiUrl)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Failed to fetch folder list: ${apiUrl}`);
                    }
                })
                .then(data => {
                    const txtFiles = data.filter(item => item.name.endsWith('.txt'));

                    // 各.txtファイルの内容を取得しコンソールに表示
                    const filePromises = txtFiles.map(async (file) => {
                        try {
                            const folderUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`;
                            const fileResponse = await fetch(folderUrl);

                            if (fileResponse.ok) {
                                const data = await fileResponse.text();
                                AddData(existingData, data);
                            } else {
                                console.error(`Failed to fetch file: ${folderUrl}`);
                            }
                        } catch (error) {
                            console.error(`Error: ${error}`);
                        }
                    });

                    // すべてのファイルの処理が終わった後にデータを保存
                    Promise.all(filePromises)
                        .then(() => {
                            DataManager.saveCustomData(existingData);
                        })
                        .catch((error) => {
                            console.error(`Error while processing files: ${error}`);
                        });
                })
                .catch(error => {
                    console.error(`Error: ${error}`);
                });
        }
        else {
            const fs = require('fs');
            const path = require('path');
            const directoryPath = './excelData';
            const promises = [];

            fs.readdir(directoryPath, (err, files) => {

                files.forEach(file => {
                    const filePath = path.join(directoryPath, file);
                    if (path.extname(filePath) === '.txt') {
                        const promise = new Promise((resolve, reject) => {
                            fs.readFile(filePath, 'utf8', (err, data) => {
                                if (err) {
                                    console.error(`ファイル ${file} を読み込む際にエラーが発生しました:`, err);
                                    reject(err);
                                } else {
                                    AddData(existingData, data);
                                    resolve();
                                }
                            });
                        });
                        promises.push(promise);
                    }
                });

                Promise.all(promises)
                    .then(() => {
                        DataManager.saveCustomData(existingData);
                    })
                    .catch(error => {
                        // Handle errors if needed
                    });
                
            });
        }

    };
    function AddData(existing, d) {
        const separator = '--------------------------------';
        const sections = d.split(separator);
        for (const section of sections) {
            const lines = section.trim().split('\n');
            var datakey;
            for (const line of lines) {
                if (line === "") continue;
                var [key, value] = line.split(':');
                if (value === "") {
                    if (key === "解２" || key === "解３") {
                        value = "000000000000000000000";
                    } else if (key === "解１" || key === "送前" || key === "送後" || key === "珍回") {
                        value = "　";
                    } else {
                        value = "0";
                    }
                }
                if (key === "問題") {
                    datakey = value;
                    existing[datakey] = {}; // data_toaddオブジェクトを初期化
                    existing[datakey]["6"] = datakey;
                } else {
                    if (keyDictionary[key] != undefined && keyDictionary[key] !== null && keyDictionary[key] !== "") {
                        existing[datakey][keyDictionary[key]] = value;
                    }
                }
            }
        }
    }

    DataManager.saveCustomData = function (data) {
        localStorage.setItem('MainQuestionData', JSON.stringify(data));
    };
    DataManager.loadCustomData = function () {
        try {
            const data = localStorage.getItem('MainQuestionData');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to load custom data:', error);
            return null;
        }
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command === 'Qjson') {
            var list = DataManager.loadCustomData();
            console.log(list);
            var dict = list[args[0]];
            for (const [key, value] of Object.entries(dict)) {
                $gameVariables.setValue(parseInt(key), value);
            }
        }
    };

    function formatToFourDigits(number) {
        var formatted_number = String(number).padStart(4, '0');
        return formatted_number;
    }

    DataManager.getCustomDataForLevel = function (levelKey) {
        var customData = this.getCustomData();
        if (customData && customData[levelKey]) {
            return customData[levelKey];
        } else {
            return null;
        }
    };

})();
