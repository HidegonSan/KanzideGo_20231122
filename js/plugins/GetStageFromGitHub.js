//=============================================================================
// GetStageFromGitHub
//=============================================================================
/*:
 * @plugindesc GitHubから問題セットを持ってきて、ステージにしてくれます。すべき操作は以下の通りです。
 * 
 * モード座標代入、プラグインコマンド「StageSelect_Enter」でモードに入れます。
 * 
 * 残機設定、カスタマイズ設定から戻るときにプラグインコマンド「StageSelect_ReturnFromConfig」を実行してください。
 * 
 * @author chuukunn
 *
 * @param extra_page
 * @desc エディットステージのページ管理。
 * @type number
 * @default 1099
 * 
 * @param extra_sub_place
 * @desc エディットステージのページ内位置管理。
 * @type number
 * @default 1100
 * 
 * @param common_click
 * @desc クリックする際にオンにされるスイッチの位置。この値、+1、+2までが使われる。
 * @type number
 * @default 1091
 * 
 * @param edit_start
 * @desc エディットステージの画面を開いている時trueになる変数の番号。
 * @type number
 * @default 200
 * 
 * @param font_edit
 * @desc テキストのフォント
 * @type string
 * @default 游明朝
 */
//=============================================================================

(function () {
    var parameters = PluginManager.parameters('GetStageFromGitHub');
    var extra_page = Number(parameters['extra_page'] || 1099);
    var extra_sub_place = Number(parameters['extra_sub_place'] || 1100);
    var common_click = Number(parameters['common_click'] || 1091);

    var edit_start = Number(parameters['edit_start'] || 200);
    var font_edit = (parameters['font_edit'] || "游明朝");

    const userName = 'edenad';
    const repoName = 'question';
    var pictureNum = parseInt(6);


    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.call(this);
        try {
            const apiUrl = `https://api.github.com/repos/${userName}/${repoName}/contents`;
            const jsonData = {};
            const stageData = [];
            fetch(apiUrl)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Failed to fetch folder list: ${apiUrl}`);
                    }
                })
                .then(data => {
                    const folders = data.filter(item => item.type === 'dir').map(item => item.name);
                    // 各フォルダごとにファイルを取得して表示
                    folders.forEach(folder => {
                        const folderUrl = `https://raw.githubusercontent.com/${userName}/${repoName}/main/${folder}/`;
                        const files = ['question.csv', 'icon.png', 'data.txt'];

                        files.forEach(file => {
                            const fileUrl = folderUrl + file;
                            const fileExtension = file.split('.').pop().toLowerCase();

                            fetch(fileUrl)
                                .then(fileResponse => {
                                    if (fileResponse.ok) {
                                        return fileResponse.text();
                                    } else {
                                        console.error(`Failed to fetch file: ${fileUrl}`);
                                    }
                                })
                                .then(fileData => {
                                    switch (fileExtension) {
                                        case 'png':
                                            // .png ファイルの場合の処理
                                            //const blob = new Blob([fileData], { type: 'image/png' });
                                            //const imageUrl = URL.createObjectURL(blob);
                                            //$gameScreen.showPicture(200, imageUrl, 1, 640, 360, 100, 100, 255, 0);
                                            break;
                                        case 'txt':
                                            ImportMetaData(folder, fileData, stageData);
                                            break;
                                        case 'csv':
                                            ImportQuestionData(folder, fileData, jsonData);
                                            break;
                                        default:
                                            break;
                                    }
                                })
                                .catch(error => {
                                    console.error(`Error: ${error}`);
                                });
                        });
                    });
                    SetCustomStageList(stageData);
                    SetCustomStageQuestion(jsonData);
                    return getCustomStageList();
                })
                .catch(error => {
                    console.error(`Error: ${error}`);
                });
        } catch (e) {
            console.log("問題を読み込めませんでした。");
        }
    };

    function SetCustomStageList(data) {
        this._CustomStageList = data;
    }

    function getCustomStageList() {
        return this._CustomStageList || null;
    }


    // カスタムデータをローカルストレージに保存する関数
    function SetCustomStageQuestion(data) {
        this._CustomStageQuestion = data;
    }

    // ローカルストレージからカスタムデータを取得する関数
    function GetCustomStageQuestion() {
        return this._CustomStageQuestion || null;
    }

    // 既存のshowPicture関数を保持
    var originalShowPicture = Game_Screen.prototype.showPicture;

    Game_Screen.prototype.showPicture = function (pictureId, pictureName, origin, x, y, scaleX, scaleY, opacity, blendMode) {
        if (pictureName === null || pictureName === undefined) {
            originalShowPicture.call(this, pictureId, pictureName, origin, x, y, scaleX, scaleY, opacity, blendMode);
        }else if (!pictureName.startsWith("[")) {
            originalShowPicture.call(this, pictureId, pictureName, origin, x, y, scaleX, scaleY, opacity, blendMode);
        } else {
            $gameMap._interpreter.pluginCommand("D_TEXT_SETTING", ["FONT", font_edit]);
            $gameMap._interpreter.pluginCommand("D_TEXT", [pictureName, (scaleX + scaleY).toString()]);
            originalShowPicture.call(this, pictureId, null, origin, x, y, scaleX, scaleY, opacity, blendMode);
        }
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'CustomStageParallel') {
            if ($gameVariables.value(196) == 2 || $gameSwitches.value(76) || $gameSwitches.value(67) || !$gameSwitches.value(edit_start)) {

            }
            else if (Input.isTriggered("up")) {
                $gameTemp.reserveCommonEvent(294);
            }
            else if (Input.isTriggered("down")) {
                $gameTemp.reserveCommonEvent(278);
            }
            else if (Input.isTriggered("left") && $gameVariables.value(196) == 1) {
                $gameMap._interpreter.pluginCommand("StageSelect_L_or_R", ["L"]);
            }
            else if (Input.isTriggered("right") && $gameVariables.value(196) == 1) {
                $gameMap._interpreter.pluginCommand("StageSelect_L_or_R", ["R"]);
            }
            else if (Input.isTriggered("control")) {
            }
            else if (Input.isTriggered("ok")) {
                const customList = getCustomStageList();
                if ($gameVariables.value(extra_page) * 3 - 3 + $gameVariables.value(extra_sub_place) - 1 >= customList.length) {
                    AudioManager.playSe({ name: 'Cancel', volume: 90, pitch: 100, pan: 0 });
                    return;
                }
                $gameMap._interpreter.pluginCommand("StageSelect_OK_1");
                setTimeout(function () {
                    $gameMap._interpreter.pluginCommand("StageSelect_OK_2");
                }, 167);
            }
            else if (Input.isTriggered("escape")) {
                $gameMap._interpreter.pluginCommand("StageSelect_Escape_1");
                setTimeout(function () {
                    $gameMap._interpreter.pluginCommand("StageSelect_Escape_2");
                }, 167);
            }
            if ($gameSwitches.value(common_click)) {
                $gameMap._interpreter.pluginCommand("StageSelect_1_or_2_or_3", ["1"]);

            }
            if ($gameSwitches.value(common_click + 1)) {
                $gameMap._interpreter.pluginCommand("StageSelect_1_or_2_or_3", ["2"]);

            }
            if ($gameSwitches.value(common_click + 2)) {
                $gameMap._interpreter.pluginCommand("StageSelect_1_or_2_or_3", ["3"]);

            }
        }
        else if (command === 'StageSelect_Enter') {
            $gameVariables.setValue(extra_page, 1);
            $gameVariables.setValue(321, 274);
            $gameVariables.setValue(323, 640);
            $gameVariables.setValue(325, 1006);
            $gameVariables.setValue(322, 358);
            $gameVariables.setValue(324, 358);
            $gameVariables.setValue(326, 358);

            $gameVariables.setValue(196, 1);
            const chList = [225, 226, 227, 228, 230, 232, 233, 234, 235, 298, 299, 300, 670, 700];
            chList.forEach(item => {
                $gameMap._interpreter.pluginCommand("Chikuwa", [item.toString(), ">", item.toString()]);
            });
            //各種設定の押し出し
            $gameTemp.reserveCommonEvent(205);
            //メニューカーソルの消去
            $gameScreen.movePicture(10, 1, 640, 360, 100, 100, 0, 0, 10);
            //ピクチャ番号19にデフォルト難易度画面を作成
            //未完成
            //
            $gameScreen.showPicture(71, "Menu_difficult_decide", 1, 274, 358, 85, 100, 0, 0);
            $gameScreen.showPicture(72, "Menu_difficult_decide", 1, 640, 358, 85, 100, 0, 0);
            $gameScreen.showPicture(73, "Menu_difficult_decide", 1, 1006, 358, 85, 100, 0, 0);

            $gameScreen.showPicture(53, "Select_L", 1, 66, 358, 100, 100, 0, 0);
            $gameScreen.showPicture(54, "Select_R", 1, 1213, 358, 100, 100, 0, 0);
            $gameScreen.showPicture(55, "Select_Shift_A", 1, 213, 680, 100, 100, 0, 0);
            $gameScreen.showPicture(57, "Select_Space_A", 1, 1066, 680, 100, 100, 0, 0);
            $gameScreen.showPicture(56, "Select_Down_A", 1, 640, 680, 100, 100, 0, 0);
            $gameScreen.showPicture(58, "Select_Up_A", 1, 640, 30, 100, 100, 0, 0);
            $gameScreen.movePicture(53, 1, 66, 358, 100, 100, 255, 0, 10);
            $gameScreen.movePicture(54, 1, 1213, 358, 100, 100, 255, 0, 10);
            $gameScreen.movePicture(55, 1, 213, 680, 100, 100, 255, 0, 10);
            $gameScreen.movePicture(57, 1, 1066, 680, 100, 100, 255, 0, 10);
            $gameScreen.movePicture(56, 1, 640, 680, 100, 100, 255, 0, 10);
            $gameScreen.movePicture(58, 1, 640, 30, 100, 100, 255, 0, 10);
            $gameMap._interpreter.pluginCommand("P_CALL_KEY_BIND", ["53", "left"]);
            $gameMap._interpreter.pluginCommand("P_CALL_KEY_BIND", ["54", "right"]);
            $gameMap._interpreter.pluginCommand("P_CALL_KEY_BIND", ["55", "escape"]);
            $gameMap._interpreter.pluginCommand("P_CALL_KEY_BIND", ["56", "down"]);
            $gameMap._interpreter.pluginCommand("P_CALL_KEY_BIND", ["57", "ok"]);
            $gameMap._interpreter.pluginCommand("P_CALL_KEY_BIND", ["58", "up"]);

            $gameMap._interpreter.pluginCommand("P_CALL_SWITCH", ["71", common_click.toString(), "1", "OFF"]);
            $gameMap._interpreter.pluginCommand("P_CALL_SWITCH", ["72", (parseInt(common_click) + 1).toString(), "1", "OFF"]);
            $gameMap._interpreter.pluginCommand("P_CALL_SWITCH", ["73", (parseInt(common_click) + 2).toString(), "1", "OFF"]);
            $gameMap._interpreter.pluginCommand("PA_INIT", ["2", "1", "横", "45"]);
            $gameScreen.showPicture(50, "Custom_D_s2", 1, $gameVariables.value(319 + $gameVariables.value(extra_sub_place) * 2), $gameVariables.value(320 + $gameVariables.value(extra_sub_place) * 2), 100, 100, 0, 0);
            $gameScreen.movePicture(50, 1, $gameVariables.value(319 + $gameVariables.value(extra_sub_place) * 2), $gameVariables.value(320 + $gameVariables.value(extra_sub_place) * 2), 100, 100, 255, 0, 10);
            $gameMap._interpreter.pluginCommand("PA_START_LOOP", ["50", "1"]);
            $gameMap._interpreter.pluginCommand("DrawStages");
            $gameSwitches.setValue(edit_start, true);

        }
        else if (command === 'StageSelect_Escape_1') {
            $gameVariables.setValue(196, 2);
            $gameScreen.erasePicture(50);
            $gameScreen.movePicture(10, 1, 640, 360, 100, 100, 255, 0, 10);
            $gameScreen.movePicture(19, 1, 640, 360, 100, 100, 0, 0, 10);
            $gameScreen.movePicture(20, 1, 640, 360, 100, 100, 0, 0, 10);
            $gameScreen.showPicture(40, "Menu_decide", 1, $gameVariables.value(179), $gameVariables.value(180), 92, 100, 1, 0);
            $gameScreen.movePicture(53, 1, $gameVariables.value(175), $gameVariables.value(176), 100, 100, 0, 0, 10);
            $gameScreen.movePicture(54, 1, $gameVariables.value(177), $gameVariables.value(178), 100, 100, 0, 0, 10);
            $gameScreen.movePicture(55, 1, 213, 680, 100, 100, 0, 0, 10);
            $gameScreen.movePicture(57, 1, 1066, 680, 100, 100, 0, 0, 10);
            $gameScreen.movePicture(56, 1, 640, 680, 100, 100, 0, 0, 10);
            $gameScreen.movePicture(58, 1, 640, 30, 100, 100, 0, 0, 10);
            for (var i = pictureNum; i < pictureNum + 4; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = pictureNum + 5; i < pictureNum + 13; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = 2; i < 5; i++) {
                $gameScreen.erasePicture(i);
            }
            $gameSwitches.setValue(edit_start, false);

        }
        else if (command === 'StageSelect_Escape_2') {
            for (var i = 53; i < 60; i++) {
                $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", [i.toString()]);
            }
            $gameTemp.reserveCommonEvent(231);
            for (var i = 71; i < 74; i++) {
                $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", [i.toString()]);
            }
            $gameTemp.reserveCommonEvent(203);
            $gameTemp.reserveCommonEvent(206);
            $gameVariables.setValue(196, 0);
            $gameVariables.setValue(15, 0);
        }
        else if (command === 'StageSelect_ReturnFromConfig') {
            $gameMap._interpreter.pluginCommand("PA_INIT", ["2", "1", "横", "45"]);
            $gameScreen.showPicture(50, "Custom_D_s2", 1, $gameVariables.value(319 + $gameVariables.value(extra_sub_place) * 2), $gameVariables.value(320 + $gameVariables.value(extra_sub_place) * 2), 100, 100, 0, 0);
            $gameScreen.movePicture(50, 1, $gameVariables.value(319 + $gameVariables.value(extra_sub_place) * 2), $gameVariables.value(320 + $gameVariables.value(extra_sub_place) * 2), 100, 100, 255, 0, 10);
            $gameMap._interpreter.pluginCommand("PA_START_LOOP", ["50", "1"]);
            $gameScreen.showPicture(71, "Menu_difficult_decide", 1, 274, 358, 85, 100, 0, 0);
            $gameScreen.showPicture(72, "Menu_difficult_decide", 1, 640, 358, 85, 100, 0, 0);
            $gameScreen.showPicture(73, "Menu_difficult_decide", 1, 1006, 358, 85, 100, 0, 0);
            $gameMap._interpreter.pluginCommand("P_CALL_SWITCH", ["71", common_click.toString(), "1", "OFF"]);
            $gameMap._interpreter.pluginCommand("P_CALL_SWITCH", ["72", (parseInt(common_click) + 1).toString(), "1", "OFF"]);
            $gameMap._interpreter.pluginCommand("P_CALL_SWITCH", ["73", (parseInt(common_click) + 2).toString(), "1", "OFF"]);
        }
        else if (command === 'StageSelect_OK_1') {
            $gameVariables.setValue(196, 2);
            AudioManager.playSe({ name: 'Decide', volume: 90, pitch: 100, pan: 0 });
            var p = parseInt(319) + $gameVariables.value(extra_sub_place) * 2;
            $gameScreen.showPicture(99, "Menu_difficult_decide", 1, $gameVariables.value(p), $gameVariables.value(p + 1), 100, 100, 128, 0);
            $gameScreen.movePicture(99, 1, $gameVariables.value(p), $gameVariables.value(p + 1), 150, 150, 0, 0, 15);
            $gameScreen.showPicture(100, "bg_white", 0, 0, 0, 100, 100, 0, 0);
            $gameScreen.movePicture(100, 0, 0, 0, 100, 100, 255, 0, 15);
        }
        else if (command === 'StageSelect_OK_2') {
            $gameTemp.reserveCommonEvent(677);
            $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", ["11"]);
            $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", ["12"]);
            $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", ["13"]);
            $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", ["14"]);
            $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", ["18"]);
            $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", ["40"]);
            for (var i = pictureNum; i < pictureNum + 4; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = pictureNum + 5; i < pictureNum + 13; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = 8; i < 17; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = 19; i < 26; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = 31; i < 34; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = 40; i < 44; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = 50; i < 60; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = 61; i < 66; i++) {
                $gameScreen.erasePicture(i);
            }
            for (var i = 71; i < 74; i++) {
                $gameScreen.erasePicture(i);
            }
            $gameScreen.erasePicture(99);
            $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", ["71"]);
            $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", ["72"]);
            $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", ["73"]);
            for (var i = 75; i < 78; i++) {
                $gameMap._interpreter.pluginCommand("P_CALL_CE_REMOVE", [i.toString()]);
            }
            var page = $gameVariables.value(extra_page);
            var place = $gameVariables.value(extra_sub_place);
            var stage_index = page * 3 - 3 + place - 1;
            //上2つを使ってステージの判別
            var stage = getCustomStageList()[stage_index];
            $gameMap._interpreter.pluginCommand("Generator", [stage.dataName, "1"]);
            $gamePlayer.reserveTransfer(2, 13, 7);
        }
        else if (command === 'StageSelect_L_or_R') {
            var L_or_R = args[0];//引数としてLかRを与える
            AudioManager.playSe({ name: 'Cursor_X', volume: 90, pitch: 100, pan: 0 });
            if (L_or_R == "L") {
                $gameVariables.setValue(extra_sub_place, parseInt($gameVariables.value(extra_sub_place)) - 1);
                if ($gameVariables.value(extra_sub_place) <= 0) {
                    $gameVariables.setValue(extra_sub_place, parseInt($gameVariables.value(extra_sub_place)) + 3);
                    $gameVariables.setValue(extra_page, parseInt($gameVariables.value(extra_page)) - 1);
                    if ($gameVariables.value(extra_page) <= 0) {
                        $gameVariables.setValue(extra_page, Math.ceil(getCustomStageList().length / 3));
                    }
                    $gameMap._interpreter.pluginCommand("DrawStages");
                }
                $gameScreen.showPicture(53, "Select_L", 1, $gameVariables.value(175), $gameVariables.value(176), 150, 150, 255, 0);
                $gameScreen.movePicture(53, 1, $gameVariables.value(175), $gameVariables.value(176), 100, 100, 255, 0, 10);
            } else if (L_or_R == "R") {
                $gameVariables.setValue(extra_sub_place, parseInt($gameVariables.value(extra_sub_place)) + 1);
                if ($gameVariables.value(extra_sub_place) >= 4) {
                    $gameVariables.setValue(extra_sub_place, parseInt($gameVariables.value(extra_sub_place)) - 3);
                    $gameVariables.setValue(extra_page, parseInt($gameVariables.value(extra_page)) + 1);
                    if ($gameVariables.value(extra_page) >= Math.ceil(getCustomStageList().length / 3) + 1) {
                        $gameVariables.setValue(extra_page, 1);
                    }
                    $gameMap._interpreter.pluginCommand("DrawStages");
                }
                $gameScreen.showPicture(54, "Select_R", 1, $gameVariables.value(177), $gameVariables.value(178), 150, 150, 255, 0);
                $gameScreen.movePicture(54, 1, $gameVariables.value(177), $gameVariables.value(178), 100, 100, 255, 0, 10);
            }

            $gameScreen.movePicture(50, 1, $gameVariables.value(319 + $gameVariables.value(extra_sub_place) * 2), $gameVariables.value(320 + $gameVariables.value(extra_sub_place) * 2), 100, 100, 255, 0, 1);

        }
        else if (command === 'StageSelect_1_or_2_or_3') {
            var num = parseInt(args[0]);//引数として1か2か3を与える
            AudioManager.playSe({ name: 'Cursor_X', volume: 90, pitch: 100, pan: 0 });
            $gameVariables.setValue(extra_sub_place, num);
            $gameMap._interpreter.pluginCommand("PA_INIT", ["2", "1", "横", "45"]);
            $gameScreen.showPicture(50, "Custom_D_s2", 1, $gameVariables.value(319 + $gameVariables.value(extra_sub_place) * 2), $gameVariables.value(320 + $gameVariables.value(extra_sub_place) * 2), 100, 100, 0, 0);
            $gameScreen.movePicture(50, 1, $gameVariables.value(319 + $gameVariables.value(extra_sub_place) * 2), $gameVariables.value(320 + $gameVariables.value(extra_sub_place) * 2), 100, 100, 255, 0, 1);
            $gameMap._interpreter.pluginCommand("PA_START_LOOP", ["50", "1"]);
            $gameSwitches.setValue(parseInt(common_click) - 1 + num, false);
        }
        else if (command === 'DrawStages') {
            var page = $gameVariables.value(extra_page);
            const customList = getCustomStageList();
            for (var i = page * 3 - 3; i < page * 3; i++) {
                var p = i % 3;
                if (i < customList.length) {
                    $gameMap._interpreter.pluginCommand("D_TEXT_SETTING", ["FONT", font_edit]);
                    $gameMap._interpreter.pluginCommand("D_TEXT", [customList[i].name, "40"]);
                    $gameScreen.showPicture(pictureNum + 0 + p, null, 1, 274 + p * 366, 170, 85, 100, 255, 0);
                    $gameMap._interpreter.pluginCommand("D_TEXT_SETTING", ["FONT", font_edit]);
                    $gameMap._interpreter.pluginCommand("D_TEXT", [customList[i].difficulty, "24"]);
                    if (pictureNum + 4 + p == 10) {
                        $gameScreen.showPicture(9, null, 1, 274 + p * 366, 530, 85, 100, 255, 0);
                    } else {
                        $gameScreen.showPicture(pictureNum + 4 + p, null, 1, 274 + p * 366, 530, 85, 100, 255, 0);
                    }
                    $gameMap._interpreter.pluginCommand("D_TEXT_SETTING", ["FONT", font_edit]);
                    $gameMap._interpreter.pluginCommand("D_TEXT", [customList[i].discription_1, "24"]);
                    $gameScreen.showPicture(pictureNum + 7 + p, null, 1, 274 + p * 366, 560, 85, 100, 255, 0);
                    $gameMap._interpreter.pluginCommand("D_TEXT_SETTING", ["FONT", font_edit]);
                    $gameMap._interpreter.pluginCommand("D_TEXT", [customList[i].discription_2, "24"]);
                    $gameScreen.showPicture(pictureNum + 10 + p, null, 1, 274 + p * 366, 590, 85, 100, 255, 0);
                } else {
                    $gameMap._interpreter.pluginCommand("D_TEXT_SETTING", ["FONT", font_edit]);
                    $gameMap._interpreter.pluginCommand("D_TEXT", ["Coming Soon...", "32"]);
                    $gameScreen.showPicture(pictureNum + 0 + p, null, 1, 274 + p * 366, 358, 85, 100, 255, 0);
                    if (pictureNum + 4 + p == 10) {
                        $gameScreen.erasePicture(9);
                    } else {
                        $gameScreen.erasePicture(pictureNum + 4 + p);
                    }
                    $gameScreen.erasePicture(pictureNum + 7 + p);
                    $gameScreen.erasePicture(pictureNum + 10 + p);
                }
            }

        }
        else if (command === 'Generator') {
            Generator(args[0], parseInt(args[1]));
        }
        else if (command === 'Csv_Question_Get_Math') {
            var q = (parseInt($gameVariables.value(15)) - 1000) * 5 + parseInt($gameVariables.value(7)) - 1;
            const randomIndex = Math.floor(Math.random() * 5);
            if (q <= 2) {
                const seeds = [["1", "0", "1"], ["1", "1", "0"], ["2", "0", "1"], ["1", "1", "1"], ["1", "1", "0", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 5) {
                const seeds = [["3", "1", "0"], ["2", "1", "1"], ["2", "2", "0"], ["1", "2", "1"], ["2", "1", "0", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 7) {
                const seeds = [["4", "1", "0"], ["3", "1", "1"], ["3", "2", "0"], ["4", "0", "1"], ["3", "1", "1", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 10) {
                const seeds = [["5", "1", "0"], ["4", "0", "1"], ["3", "2", "0"], ["4", "1", "1"], ["3", "2", "0", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 12) {
                const seeds = [["6", "1", "0"], ["5", "0", "1"], ["4", "2", "0"], ["4", "1", "2"], ["6", "2", "0", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 15) {
                const seeds = [["5", "2", "0"], ["6", "0", "1"], ["4", "2", "0", "□"], ["4", "1", "1", "□"], ["3", "3", "0", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 17) {
                const seeds = [["5", "2", "1"], ["4", "2", "2"], ["4", "2", "2", "□"], ["4", "3", "1", "□"], ["3", "3", "1", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 20) {
                const seeds = [["6", "1", "1"], ["6", "2", "0"], ["5", "2", "0", "□"], ["4", "2", "0", "□"], ["3", "3", "0", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 22) {
                const seeds = [["6", "2", "1"], ["6", "3", "0"], ["5", "2", "1", "□"], ["4", "2", "1", "□"], ["3", "4", "0", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 25) {
                const seeds = [["6", "1", "2"], ["6", "4", "0"], ["5", "2", "2", "□"], ["4", "3", "1", "□"], ["3", "4", "1", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 27) {
                const seeds = [["6", "2", "2"], ["6", "5", "0"], ["5", "3", "2", "□"], ["4", "4", "1", "□"], ["4", "4", "0", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else if (q <= 30) {
                const seeds = [["6", "2", "3"], ["6", "6", "0"], ["6", "3", "2", "□"], ["5", "4", "1", "□"], ["4", "5", "0", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            } else {
                const seeds = [["6", "3", "3"], ["6", "4", "2"], ["6", "4", "2", "□"], ["6", "3", "3", "□"], ["6", "5", "1", "□"]];
                $gameMap._interpreter.pluginCommand("MakeMathQuestion", seeds[randomIndex]);
            }
        }
    };
    
    function ImportQuestionData(filename, data, jsonData) {
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
            var color = 2;
            if (level == "1" || level == "2") {
                color = 1;
            } else if (level == "3") {
                color = 2;
            } else if (level == "4") {
                color = 3;
            }
            var parent_key = filename + "_" + String(id).padStart(4, '0');
            jsonData[parent_key] = {};
            var chr = "";
            if (chr_text != "") {
                chr = chr_text.replace('〇', '●').replace('○', '●');
            } else if (chr_raw[1] != "" && !isNaN(chr_raw[1])){
                chr = '●'.repeat(Number(chr_raw[1]));
            }
            jsonData[parent_key]["6"] = parent_key;
            if (hasPicture) {
                jsonData[parent_key]["8"] = parent_key;
            } else {
                jsonData[parent_key]["8"] = createDTextString(questionText_e, questionText, questionText_a, chr, color);
            }
            jsonData[parent_key]["16"] = 0;
            jsonData[parent_key]["9"] = answer[0];
            if (answer.length >= 2) {
                jsonData[parent_key]["10"] = answer[1];
                if (answer.length >= 3) {
                    jsonData[parent_key]["11"] = answer[2];
                } else {
                    jsonData[parent_key]["11"] = "000000000000000000000";
                }
            } else {
                jsonData[parent_key]["10"] = "000000000000000000000";
                jsonData[parent_key]["11"] = "000000000000000000000";
            }
            jsonData[parent_key]["13"] = genre_13;
            jsonData[parent_key]["14"] = num_of_chr_14;
            jsonData[parent_key]["18"] = createString(questionText_e, questionText, questionText_a);
            jsonData[parent_key]["19"] = comment1_19;
            jsonData[parent_key]["20"] = comment2_20;
            jsonData[parent_key]["Level"] = level;
            if (parseInt(questionText_e.length) + parseInt(questionText.length) + parseInt(questionText_a.length) >= 5) {
                jsonData[parent_key]["169"] = "1";
            } else {
                jsonData[parent_key]["169"] = "0";
            }
            jsonData[parent_key]["992"] = "";
            jsonData[parent_key]["1057"] = answerText_e_1057;
            jsonData[parent_key]["1058"] = answerText_a_1058;
        }

    }
    function ImportMetaData(folder, data, stageData) {
        var lines = data.split('\n');
        const newStage = {
            name: lines[0],
            discription_1: lines[1],
            discription_2: lines[2],
            difficulty: lines[3],
            isBind: lines[4],
            isRise: lines[5],
            isBonus: lines[6],
            dataName: folder
        };
        stageData.push(newStage);
    }
    async function Generator(stage_name, stage_type) {
        $gameSwitches.setValue(60, false);
        var num;
        if (stage_type == 1) {
            num = 10;
        }
        else if (stage_type == 2) {
            num = 8;
        }
        $gameVariables.setValue(290, 1);
        await SetQuestionIndex(stage_name, num);
        $gameVariables.setValue(290, 2);
        await SetQuestionIndex(stage_name, num);
        $gameVariables.setValue(290, 3);
        await SetQuestionIndex(stage_name, num);
        $gameVariables.setValue(290, 4);
        await SetQuestionIndex(stage_name, 2);
        $gameVariables.setValue(7, 0);
        $gameVariables.setValue(290, 0);
        $gameSwitches.setValue(184, true);
        
    }
    async function SetQuestionIndex(stage_name, count) {
        var difficulty = parseInt($gameVariables.value(290));
        const indexesToInclude = [];
        const data = GetCustomStageQuestion();
        for (const key in data) {
            if (key.includes(`${stage_name}`) && (difficulty == 0 || difficulty == parseInt(data[key]["Level"]))) {
                indexesToInclude.push(data[key]);
            }
        }
        const result = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * indexesToInclude.length);
            const selectedIndex = indexesToInclude.splice(randomIndex, 1)[0];
            result.push(selectedIndex);
            if (count == 10) {
                if (i < 5) {
                    //本筋(0,1,2,3,4)
                    $gameVariables.setValue(7, difficulty * 5 - 4 + i);
                } else if (i < 6) {
                    //いれかえ(5)
                    $gameVariables.setValue(380, difficulty);
                } else {
                    //残機(6,7,8,9)
                    $gameVariables.setValue(774, i - 5);
                }
            } else if (count == 8) {
                if (i < 3) {
                    //本筋(0,1,2)
                    $gameVariables.setValue(7, difficulty * 3 - 3 + i);
                } else if (i < 4) {
                    //いれかえ(3)
                    $gameVariables.setValue(380, difficulty);
                } else {
                    //残機(4,5,6,7)
                    $gameVariables.setValue(774, i - 3);
                }
            } else {
                if (i == 0) {
                    //本筋
                    $gameVariables.setValue(7, parseInt($gameVariables.value(7)) + 1);
                } else {
                    //いれかえ
                    $gameVariables.setValue(380, 4);
                }
            }
            //回答代入
            for (const [key, value] of Object.entries(selectedIndex)) {
                if (!isNaN(key)) {
                    $gameVariables.setValue(parseInt(key), value);
                    if (key == "13") {
                        if (value == "生" || value == "動") {
                            $gameVariables.setValue(13, 1);
                            $gameVariables.setValue(17, 1);
                        } else if (value == "地" || value == "建") {
                            $gameVariables.setValue(13, 2);
                            $gameVariables.setValue(17, 2);
                        } else if (value == "植" || value == "草" || value == "木") {
                            $gameVariables.setValue(13, 3);
                            $gameVariables.setValue(17, 3);
                        } else if (value == "人" || value == "名") {
                            $gameVariables.setValue(13, 4);
                            $gameVariables.setValue(17, 4);
                        } else if (value == "則") {
                            $gameVariables.setValue(13, 10);
                            $gameVariables.setValue(17, 10);
                        }
                    }
                }
            }

            //回答記憶
            $gameTemp.reserveCommonEvent(7);
            await waitForCommonEventToEnd(7);
            $gameVariables.setValue(380, 0);
            $gameVariables.setValue(774, 0);
        }
    }
    async function waitForCommonEventToEnd(eventId) {
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                if (!$gameTemp.isCommonEventReserved(eventId)) {
                    clearInterval(intervalId);
                    resolve();
                }
            }, 10); // 10ミリ秒ごとに確認
        });
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
    function createDTextString(A, B, C, chr, color) {
        if (chr != "") {
            return `[${A}]<\\c[${color}]${B}\\c[0]|\\c[15]${chr}\\c[0]>[${C}]`;
        }
        return `[${A}]\\c[${color}]${B}\\c[0][${C}]`;
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