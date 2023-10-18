//=============================================================================
// GetOriginalQuestion
//=============================================================================
/*:
 * @plugindesc jsonで問題保存
 *
 * @help
 * プロジェクト名/excelData/editLevel直下にある.csvファイルを読み込み、問題として出力できるようにしたものです。
 * 読み込められる.csvに関しては、現状では以前いただいた.excelデータを.csvに変換した際に現れたものを読み込めるようにしてあります。
 *
 *
@author
 chuukunn
 *
 *
 */

(function () {

    // JSONファイルのパス
    var jsonFilePath = './excelData/question.json';

    // ゲーム開始時の処理
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        this.loadAndStoreData();
        _Scene_Boot_start.call(this);
    };

    Scene_Boot.prototype.loadAndStoreData = function () {
        fetch(jsonFilePath)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch JSON file');
                }
            })
            .then(jsonData => {
                // 内部データに保存
                DataManager.saveCustomData(jsonData);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    };
    DataManager.saveCustomData = function (data) {
        try {
            localStorage.setItem('MainQuestionData', JSON.stringify(data));
            console.log(JSON.stringify(data));
        } catch (error) {
            console.error('Failed to save custom data:', error);
        }
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
