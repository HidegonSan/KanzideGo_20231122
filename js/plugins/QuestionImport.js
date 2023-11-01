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
 * @param IsLocal
 * @desc 場合に任せるなら0、強制的にローカルにするなら1、強制的にGitHubにするなら2
 * @type number
 * @default 0
 */

(function () {
    var parameters = PluginManager.parameters('QuestionImport');
    var owner = String(parameters['Owner'] || 'your_owner');
    var repo = String(parameters['Repo'] || 'your_repo');
    var IsLocal = Number(parameters['IsLocal'] || 0);
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
        '珍回': '992',
        '品詞': '1094'
    };


    // ゲーム開始時の処理
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.call(this);
        const existingData = {};
        const existingExData = {};
        if ((navigator.onLine && !$gameTemp.isPlaytest() && IsLocal != 1) || IsLocal == 2) {
            console.log("GitHub取得");
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
                    const txtFiles = data.filter(item => {
                        if (item && item.name) {
                            return item.name.endsWith('.txt') || item.name.endsWith('.csv');
                        }
                        return false;
                    });

                    // 各.txtファイルの内容を取得しコンソールに表示
                    const filePromises = txtFiles.map(async (file) => {
                        const folderUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${file.path}`;
                        const fileResponse = await fetch(folderUrl);

                        if (fileResponse.ok) {
                            const data = await fileResponse.text();
                            AddData(existingData, data);
                        } else {
                            console.error(`Failed to fetch file: ${folderUrl}`);
                        }
                    });

                    // すべてのファイルの処理が終わった後にデータを保存
                    Promise.all(filePromises)
                        .then(() => {
                            DataManager.saveCustomData(existingData);
                            DataManager.saveCustomExData(existingExData);
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
            console.log("ローカル取得");
            const fs = require('fs');
            const path = require('path');
            var directoryPath = './www/excelData';
            if ($gameTemp.isPlaytest()) {
                directoryPath = './excelData';
            }
            const promises = [];

            fs.readdir(directoryPath, (err, files) => {

                files.forEach(file => {
                    const filePath = path.join(directoryPath, file);
                    if (path.extname(filePath) === '.txt' || path.extname(filePath) === '.csv') {
                        const promise = new Promise((resolve, reject) => {
                            fs.readFile(filePath, 'utf8', (err, data) => {
                                if (path.extname(filePath) === '.txt') {
                                    if (err) {
                                        console.error(`ファイル ${file} を読み込む際にエラーが発生しました:`, err);
                                        reject(err);
                                    } else {
                                        AddData(existingData, data);
                                        resolve();
                                    }
                                } else if (path.extname(filePath) === '.csv') {
                                    if (err) {
                                        console.error(`ファイル ${file} を読み込む際にエラーが発生しました:`, err);
                                        reject(err);
                                    } else {
                                        AddCsvData(existingExData, data, path.basename(filePath).split('.').slice(0, -1).join('.'));
                                        resolve();
                                    }
                                }
                            });
                        });
                        promises.push(promise);
                    }
                });
                Promise.all(promises)
                    .then(() => {
                        DataManager.saveCustomData(existingData);
                        DataManager.saveCustomExData(existingExData);
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
                    existing[datakey]["8"] = datakey;
                } else {
                    if (keyDictionary[key] != undefined && keyDictionary[key] !== null && keyDictionary[key] !== "") {
                        existing[datakey][keyDictionary[key]] = value;
                    }
                }
            }
        }
    }
    function AddCsvData(existing, data, filename) {
        var lines = data.split('\n');
        var hasPicture = false;
        for (var i = 0; i < lines.length; i++) {
            var rowData = lines[i].split(',');
            if (rowData[3] === "字") {
                lines = lines.slice(i - 1);
                break;
            } else if (rowData[3] === "画") {
                lines = lines.slice(i - 1);
                hasPicture = true;
                break;
            }
        }

        for (var i = 1; i < lines.length - 1; i = i + 2) {
            var firstLine = lines[i].split(',');
            var secondLine;
            if (firstLine.length <= 3) {
                i = i + 1;
                firstLine = lines[i].split(',');
            }
            secondLine = lines[i + 1].split(',');
            if (secondLine.length <= 3) {
                i = i + 1;
                secondLine = lines[i + 1].split(',');
            }

            var id = firstLine[0];
            var answer_Row = parseText(firstLine[1]);
            var answerText_e_1057 = answer_Row[0];
            var answerText_a_1058 = answer_Row[2];
            var answer = answer_Row[1].split('、');
            var splitText = parseText(secondLine[1]);
            var questionText_e = splitText[0];
            var questionText = splitText[1];
            var questionText_a = splitText[2];
            var num_of_chr_14;
            if (firstLine[2] != "") {
                num_of_chr_14 = 1;
            } else {
                num_of_chr_14 = 0;
            }
            var chr_raw = parseText(firstLine[2]);
            var chr_text = chr_raw[2];
            var genre_13 = firstLine[4];
            var comment1_19 = firstLine[5];
            var comment2_20 = secondLine[5];
            var level = firstLine[6] + secondLine[6];
            var appendix = firstLine[7] + secondLine[7];
            var color = 1;
            if (level == "4") {
                color = 2;
            }
            var parent_key = filename + "_" + String(id).padStart(4, '0');
            existing[parent_key] = {};
            var chr = "";
            const isAlphabet = /^[A-Za-z]+$/.test(answer);
            if (chr_text != "" && isAlphabet) {
                chr = chr_text.replace(/〇|○/g, '▮');
            }else if (chr_text != "") {
                chr = chr_text.replace(/〇|○/g, '●');
            } else if (chr_raw[1] != "" && isAlphabet) {
                chr = '▮'.repeat(Number(chr_raw[1]));
            } else if (chr_raw[1] != "" && !isNaN(chr_raw[1])) {
                chr = '●'.repeat(Number(chr_raw[1]));
            }
            if (hasPicture) {
                existing[parent_key]["8"] = parent_key;
            } else {
                existing[parent_key]["8"] = createDTextString(questionText_e, questionText, questionText_a, chr, color, appendix);
            }
            existing[parent_key]["16"] = 0;
            existing[parent_key]["9"] = answer[0];
            if (answer.length >= 2) {
                existing[parent_key]["10"] = answer[1];
                if (answer.length >= 3) {
                    existing[parent_key]["11"] = answer[2];
                } else {
                    existing[parent_key]["11"] = "000000000000000000000";
                }
            } else {
                existing[parent_key]["10"] = "000000000000000000000";
                existing[parent_key]["11"] = "000000000000000000000";
            }
            existing[parent_key]["13"] = genre_13 || "";
            existing[parent_key]["14"] = num_of_chr_14 || 0;
            existing[parent_key]["18"] = createString(questionText_e, questionText, questionText_a);
            existing[parent_key]["19"] = comment1_19;
            existing[parent_key]["20"] = comment2_20 || "　";
            existing[parent_key]["Level"] = level;
            if (parseInt(questionText_e.length) + parseInt(questionText.length) + parseInt(questionText_a.length) >= 8) {
                existing[parent_key]["169"] = "2";
            } else if (parseInt(questionText_e.length) + parseInt(questionText.length) + parseInt(questionText_a.length) >= 5) {
                existing[parent_key]["169"] = "1";
            } else {
                existing[parent_key]["169"] = "0";
            }
            existing[parent_key]["992"] = "";
            existing[parent_key]["1057"] = answerText_e_1057;
            existing[parent_key]["1058"] = answerText_a_1058;
        }

    }
    DataManager.saveCustomData = function (data) {
        this._NormalQuestionData = data;
    };
    DataManager.loadCustomData = function () {
        return this._NormalQuestionData || [];
    };
    DataManager.saveCustomExData = function (data) {
        this._ExtraQuestionData = data;
    };
    DataManager.loadCustomExData = function () {
        return this._ExtraQuestionData || [];
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command === 'Qjson') {
            var list = DataManager.loadCustomData();
            var dict = list[args[0]];
            for (const [key, value] of Object.entries(dict)) {
                if (value != "000000000000000000000") {
                    $gameVariables.setValue(parseInt(key), parseOrReturnOriginal(value));
                } else {
                    $gameVariables.setValue(parseInt(key), value);
                }
            }
        }
        else if (command === 'ExQjson') {
            var list = DataManager.loadCustomExData();
            var dict = list[args[0]];
            for (const [key, value] of Object.entries(dict)) {
                if (value != "000000000000000000000") {
                    $gameVariables.setValue(parseInt(key), parseOrReturnOriginal(value));
                } else {
                    $gameVariables.setValue(parseInt(key), value);
                }
            }
        }
        else if (command === 'GetTotalQuestionNum') {
            const stage_name = args[0];
            const difficulty = parseInt(args[1]);
            const data = DataManager.loadCustomExData();
            const indexesToInclude = [];
            for (const key in data) {
                if (key.includes(stage_name) && difficulty == parseInt(data[key]["Level"])) {
                    indexesToInclude.push(data[key]);
                }
            }
            $gameVariables.setValue(681, indexesToInclude.length);
        }
    };
    function parseOrReturnOriginal(inputString) {
        const parsedInt = parseInt(inputString);

        if (!isNaN(parsedInt)) {
            return parsedInt;
        } else {
            return inputString;
        }
    }
    function createString(A, B, C) {
        let result = "";

        if (A > C) {
            result += "1".repeat(A - C);
            result += "2".repeat(B);
        } else if (A < C) {
            result += "2".repeat(B);
            result += "1".repeat(C - A);
        } else {
            result += "2".repeat(B);
        }

        return result;
    }
    function createDTextString(A, B, C, chr, color, appendix) {
        if (appendix != "" && chr != "") {
            return `[\\OC[rgba(0,0,0,1)]\\C[0]${A}]\\C[${color}]<${B}|[\\C[15]${chr}]>\\C[0][${C}]㊦${appendix}㊦`;
        }
        else if (chr != "") {
            return `[\\OC[rgba(0,0,0,1)]\\C[0]${A}]\\C[${color}]<${B}|[\\C[15]${chr}]>\\C[0][${C}]`;
        }
        return `[\\OC[rgba(0,0,0,1)]\\C[0]${A}]\\C[${color}]${B}\\C[0][${C}]`;
    }
    function parseText(text) {
        let x = "";
        let y = "";
        let z = "";

        const text_split_num = text.split("(").length - 1;
        if (text_split_num === 0) {
            y = text;
        } else if (text_split_num === 1) {
            if (text.charAt(0) === '(') {
                var text_split = text.split(")");
                x = text_split[0].replace("(", "");
                y = text_split[1];
            } else {
                var text_split = text.split("(");
                y = text_split[0];
                z = text_split[1].replace(")", "");
            }
        } else if (text_split_num >= 2) {
            var text_split_l = text.split(")");
            x = text_split_l[0].replace("(", "");
            y = text_split_l[1].split("(")[0];
            var text_split_r = text.split("(");
            z = text_split_r[2].replace(")", "");
        }
        return [x, y, z];
    }


})();
