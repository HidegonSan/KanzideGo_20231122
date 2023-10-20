//=============================================================================
// RGenRandomizer.js
//=============================================================================
/*:
 * @plugindesc ランダムな変数出力
 *
 * @author chuukunn
 *
 * @param exported_value
 * @desc プラグインコマンド実行時に出力される変数のID。
 * @type number
 * @default 1090
 */
//=============================================================================
(function () {
    var parameters = PluginManager.parameters('RGenRandomizer');
    var exported_value = Number(parameters['exported_value'] || 1090);

    DataManager.initCustomList = function () {
        this._customList = [];
    };

    DataManager.addToCustomList = function (data) {
        this._customList.push(data);
    };

    DataManager.SetCustomList = function (data) {
        this._customList = data;
    };

    DataManager.getCustomList = function () {
        return this._customList || [];
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'RGen') {
            if (!DataManager._customList) {
                DataManager.initCustomList();
            }
            var variableId = args[0];
            var min = parseInt(args[1]);
            var max = parseInt(args[2]);
            var probability = parseInt(args[3]);
            var Customlist = DataManager.getCustomList();
            if (variableId && min && max && probability >= 0 && probability <= 100) {
                var value = generateRandomNumber(min, max);
                if (probability > Math.random() * 100) {
                    value = getRandomNumberInIdentifierRangeNotInCustomlist(variableId, min, max, Customlist);
                }
                DataManager.addToCustomList(`${variableId}_${value}`);
                DataManager.SetCustomList(removeItemsWithSubstring(Customlist, variableId, max));
                $gameVariables.setValue(exported_value, value);
            }
        }
    };

    function generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function removeItemsWithSubstring(list, substring, limit) {
        var count = list.reduce(function (acc, currentItem) {
            if (currentItem.includes(substring)) {
                return acc + 1;
            }
            return acc;
        }, 0);

        if (count >= limit) {
            list = list.filter(function (currentItem) {
                return !currentItem.includes(substring);
            });
        }

        return list;
    }

    function getRandomNumberInIdentifierRangeNotInCustomlist(identifier, a, b, customlist) {
        const matchingNumbers = customlist.filter(item => item.startsWith(identifier));

        if (matchingNumbers.length === 0) {
            return generateRandomNumber(a, b);
        }

        const allNumbersInRange = Array.from({ length: b - a + 1 }, (_, index) => a + index);
        const matchingNumbersInRange = matchingNumbers.map(item => parseInt(item.split('_').slice(-1)[0]));
        const availableNumbers = allNumbersInRange.filter(number => !matchingNumbersInRange.includes(number));
        if (availableNumbers.length === 0) {
            return generateRandomNumber(a, b);
        }

        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        return availableNumbers[randomIndex];
    }

})();