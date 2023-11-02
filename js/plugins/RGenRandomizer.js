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
 * @default 6
 */
//=============================================================================
(function () {
    var parameters = PluginManager.parameters('RGenRandomizer');
    var exported_value = Number(parameters['exported_value'] || 6);

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

    function GetCustomStageQuestion(stage_name) {
        const filteredArray = this._CustomStageArray.filter(item => item.dataName === stage_name);
        return filteredArray[0]["Question"] || null;
    }

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
            if (args.length >= 5) {
                var addedQuestion_num = parseInt(args[4]);
                var addedQuestion_probability = parseInt(args[5]);
            }
            var Customlist = DataManager.getCustomList();
            if (variableId && min && max && probability >= 0 && probability <= 100) {
                var value = generateRandomNumber(min, max);
                if (probability > Math.random() * 100) {
                    value = getRandomNumberInIdentifierRangeNotInCustomlist(variableId, min, max, Customlist, 0);
                }
                if (args.length >= 5) {
                    if (addedQuestion_probability > Math.random() * 100) {
                        value = getRandomNumberInIdentifierRangeNotInCustomlist(variableId, min, max, Customlist, addedQuestion_num);
                    }
                }
                $gameVariables.setValue(exported_value, value);
            }
        }
        else if (command === 'RGen_Record') {
            var Customlist = DataManager.getCustomList();
            if (!DataManager._customList) {
                DataManager.initCustomList();
            }
            var tag = "";
            if (parseInt($gameVariables.value(15)) <= 100) {
                tag = "Ma";
            } else if (parseInt($gameVariables.value(15)) <= 500) {
                tag = `Ca_${String(parseInt($gameVariables.value(15)) - 100).padStart(3, '0')}`;
            } else if (parseInt($gameVariables.value(15)) <= 600) {
                tag = "Ma";
            }
            if (parseInt($gameVariables.value(15)) != 101) {
                tag = `${tag}_Lv${parseInt($gameVariables.value(8).split('_')[0].match(/\d+/))}`;
            }
            DataManager.addToCustomList(`${tag}_${$gameVariables.value(6)}`);
            DataManager.SetCustomList(removeItemsWithSubstring(Customlist, tag, parseInt($gameVariables.value(681))));
        }
        else if (command === 'RGen_reset') {
            DataManager.SetCustomList(removeItemsForceWithSubstring(DataManager.getCustomList(), args[0]));
        }
        else if (command === 'EXRGen') {
            if (!DataManager._customList) {
                DataManager.initCustomList();
            }
            var stageName = args[0];
            var probability = parseInt(args[1]);
            var level = parseInt(args[2]);
            var Customlist = DataManager.getCustomList();
            if (stageName && probability >= 0 && probability <= 100) {
                var isFilter = false;
                if (probability > Math.random() * 100) {
                    isFilter = true;
                }
                var value = getExRandomNumber(stageName, Customlist, level, isFilter);
                //DataManager.addToCustomList(value);
                //$gameVariables.setValue(exported_value, parseInt(value.slice(value.lastIndexOf('_') + 1)));
            }
        }
        else if (command === 'EditRGen') {
            if (!DataManager._customList) {
                DataManager.initCustomList();
            }
            var stageName = args[0];
            var probability = parseInt(args[1]);
            var level = parseInt(args[2]);
            var Customlist = DataManager.getCustomList();
            if (stageName && probability >= 0 && probability <= 100) {
                var isFilter = false;
                if (probability > Math.random() * 100) {
                    isFilter = true;
                }
                var value = getEditRandomNumber(stageName, Customlist, level, isFilter);
                //DataManager.addToCustomList(value);
                //$gameVariables.setValue(exported_value, parseInt(value.slice(value.lastIndexOf('_') + 1)));
            }
        }
    };

    function removeItemsForceWithSubstring(list, substring) {
        list = list.filter(function (currentItem) {
            return !currentItem.includes(substring);
        });

        return list;
    }

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

    function getRandomNumberInIdentifierRangeNotInCustomlist(identifier, a, b, customlist, grad) {
        var a_save = a;
        if (grad >= 1) {
            a = b - grad + 1;
        }
        const matchingNumbers = customlist.filter(item => item.startsWith(identifier));

        if (matchingNumbers.length === 0) {
            return generateRandomNumber(a, b);
        }

        const allNumbersInRange = Array.from({ length: b - a + 1 }, (_, index) => a + index);
        const matchingNumbersInRange = matchingNumbers.map(item => parseInt(item.split('_').slice(-1)[0]));
        const availableNumbers = allNumbersInRange.filter(number => !matchingNumbersInRange.includes(number));
        if (availableNumbers.length === 0 && grad >= 1) {
            return getRandomNumberInIdentifierRangeNotInCustomlist(identifier, a_save, b, customlist, 0);
        } else if (availableNumbers.length <= 25) {
            removeItemsForceWithSubstring(customlist, identifier);
            return generateRandomNumber(a, b);
        }
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        return availableNumbers[randomIndex];
    }
    function getExRandomNumber(stageName, Customlist, level, doFilter) {
        const ex_dict = DataManager.loadCustomExData();
        const indexesToInclude = [];
        for (const key in ex_dict) {
            if (key.includes(stageName) && level == parseInt(ex_dict[key]["Level"]) && (!doFilter || !Customlist.includes(key))) {
                indexesToInclude.push(key);
            }
        }
        if (indexesToInclude.length == 0) {
            DataManager.SetCustomList(removeItemsForceWithSubstring(Customlist, stageName));
        }
        const randomIndex = Math.floor(Math.random() * indexesToInclude.length);
        return indexesToInclude[randomIndex];
    }

    function getEditRandomNumber(stageName, Customlist, level, doFilter) {
        const ex_dict = GetCustomStageQuestion(stageName);
        const indexesToInclude = [];
        for (const key in ex_dict) {
            if (key.includes(stageName) && level == parseInt(ex_dict[key]["Level"]) && (!doFilter || !Customlist.includes(key))) {
                indexesToInclude.push(key);
            }
        }
        if (indexesToInclude.length == 0) {
            DataManager.SetCustomList(removeItemsForceWithSubstring(Customlist, stageName));
        }
        const randomIndex = Math.floor(Math.random() * indexesToInclude.length);
        return indexesToInclude[randomIndex];
    }

})();