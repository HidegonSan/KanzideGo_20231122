// Generated by RPG Maker.
// Do not edit this file directly.
var $plugins =
[
{"name":"SA_CoreSpeedImprovement","status":true,"description":"v18.1 SA Core Speed Improvement (Define at the top)","parameters":{"Enable CWC-cache":"false","Minimum CWC-cache holding count":"15","Logging level":"4"}},
{"name":"Community_Basic","status":true,"description":"基本的なパラメーターを設定するプラグインです。","parameters":{"cacheLimit":"30","screenWidth":"1280","screenHeight":"720","changeWindowWidthTo":"","changeWindowHeightTo":"","renderingMode":"auto","alwaysDash":"ON"}},
{"name":"DatabaseConverter","status":false,"description":"データベース変換プラグイン","parameters":{"excelDataPath":"excelData","ExportPrefix":"","targetDatabase":"[\"{\\\"JsonName\\\":\\\"Actors\\\",\\\"VariableName\\\":\\\"\\\"}\",\"{\\\"JsonName\\\":\\\"Classes\\\",\\\"VariableName\\\":\\\"\\\"}\",\"{\\\"JsonName\\\":\\\"Skills\\\",\\\"VariableName\\\":\\\"\\\"}\",\"{\\\"JsonName\\\":\\\"Items\\\",\\\"VariableName\\\":\\\"\\\"}\",\"{\\\"JsonName\\\":\\\"Weapons\\\",\\\"VariableName\\\":\\\"\\\"}\",\"{\\\"JsonName\\\":\\\"Armors\\\",\\\"VariableName\\\":\\\"\\\"}\",\"{\\\"JsonName\\\":\\\"Enemies\\\",\\\"VariableName\\\":\\\"\\\"}\",\"{\\\"JsonName\\\":\\\"Troops\\\",\\\"VariableName\\\":\\\"\\\"}\",\"{\\\"JsonName\\\":\\\"States\\\",\\\"VariableName\\\":\\\"\\\"}\",\"{\\\"JsonName\\\":\\\"MapInfos\\\",\\\"VariableName\\\":\\\"\\\"}\"]","fileFormat":"xlsx","originalDataLoad":"false","autoImport":"false","exportEventTest":"true","originalDatabaseStack":"false","commandPrefix":""}},
{"name":"Galv_ImageCache","status":true,"description":"(v.1.1) Pre-cache images that cause issues when loading during gameplay","parameters":{"Folder 1":"animations|","Folder 2":"battlebacks1|","Folder 3":"battlebacks2|","Folder 4":"characters|","Folder 5":"enemies|","Folder 6":"faces|","Folder 7":"parallaxes|","Folder 8":"pictures|Clear_01,Clear_02,Clear_03,Clear_04,Clear_05,Clear_06,Clear_07,Clear_08,Clear_09,Clear_10,Clear_11,Clear_12,Clear_13,Clear_14,Clear_15,Clear_16,Clear_17,Clear_18,Clear_19,Clear_20,Gameover_01,Gameover_02,Gameover_03,Gameover_04,Gameover_05,Gameover_06,Gameover_07,Gameover_08,Gameover_09,Gameover_10,Gameover_11,Gameover_12,Com_cor,Howto_01,Howto_01_s,Howto_02,Howto_03,Howto_04,Howto_05,Howto_06,Howto_board,Diff_01,Diff_02,Diff_03,Diff_04,Gauge_16_bar_01,Gauge_16_bar_02,Gauge_16_bar_03,Gauge_16_bar_04,Gauge_16_bar_05,Gauge_16_bar_06,Gauge_16_bar_07,Gauge_16_bar_08,Gauge_16_bar_09,Gauge_16_bar_10,Gauge_16_bar_11,Gauge_16_bar_12,Gauge_16_bar_13,Gauge_16_bar_14,Gauge_16_bar_15,Gauge_16_bar_16,Gauge_16_bar_16_all,Gauge_16_LayerD,Gauge_16_LayerU,Gauge_10_bar_01,Gauge_10_bar_02,Gauge_10_bar_03,Gauge_10_bar_04,Gauge_10_bar_05,Gauge_10_bar_06,Gauge_10_bar_07,Gauge_10_bar_08,Gauge_10_bar_09,Gauge_10_bar_10,Gauge_10_bar_10_all,Gauge_10_LayerD,Gauge_10_LayerU,Genre_01,Genre_02,Genre_03,Genre_04,Specify,Specify_1,Specify_2,Specify_3,Specify_4,Specify_5,Specify_6,Specify_7,Specify_8,Specify_9,Alert_bg,Window,Window_Kan,Window_Text_N,Window_Text_Y,Window_TextA,Window_TextB,Gameover_Select_A1,Gameover_Select_A2,Gameover_Select_A3,Fl_2_0001,Fl_2_0002,Fl_2_0003,Fl_2_0004,Fl_2_0005,Fl_2_0006,Fl_12_0001,Fl_12_0002,Fl_12_0003,Fl_12_0004,Fl_12_0005,Fl_12_0006,Fl_21_0001,Fl_21_0002,Fl_21_0003,Fl_21_0004,Fl_21_0005,Fl_21_0006,Fl_22_0001,Fl_22_0002,Fl_22_0003,Fl_22_0004,Fl_22_0005,Fl_22_0006,Fl_112_0001,Fl_112_0002,Fl_112_0003,Fl_112_0004,Fl_112_0005,Fl_112_0006,Fl_122_0001,Fl_122_0002,Fl_122_0003,Fl_122_0004,Fl_122_0005,Fl_122_0006,Fl_211_0001,Fl_211_0002,Fl_211_0003,Fl_211_0004,Fl_211_0005,Fl_211_0006,Fl_221_0001,Fl_221_0002,Fl_221_0003,Fl_221_0004,Fl_221_0005,Fl_221_0006,Fl_222_0001,Fl_222_0002,Fl_222_0003,Fl_222_0004,Fl_222_0005,Fl_222_0006,Fl_1112_0001,Fl_1112_0002,Fl_1112_0003,Fl_1112_0004,Fl_1112_0005,Fl_1112_0006,Fl_1122_0001,Fl_1122_0002,Fl_1122_0003,Fl_1122_0004,Fl_1122_0005,Fl_1122_0006,Fl_1222_0001,Fl_1222_0002,Fl_1222_0003,Fl_1222_0004,Fl_1222_0005,Fl_1222_0006,Fl_2111_0001,Fl_2111_0002,Fl_2111_0003,Fl_2111_0004,Fl_2111_0005,Fl_2111_0006,Fl_2211_0001,Fl_2211_0002,Fl_2211_0003,Fl_2211_0004,Fl_2211_0005,Fl_2211_0006,Fl_2221_0001,Fl_2221_0002,Fl_2221_0003,Fl_2221_0004,Fl_2221_0005,Fl_2221_0006,Fl_2222_0001,Fl_2222_0002,Fl_2222_0003,Fl_2222_0004,Fl_2222_0005,Fl_2222_0006,Fl_11112_0001,Fl_11112_0002,Fl_11112_0003,Fl_11112_0004,Fl_11112_0005,Fl_11112_0006,Fl_11122_0001,Fl_11122_0002,Fl_11122_0003,Fl_11122_0004,Fl_11122_0005,Fl_11122_0006,Fl_11222_0001,Fl_11222_0002,Fl_11222_0003,Fl_11222_0004,Fl_11222_0005,Fl_11222_0006,Fl_12222_0001,Fl_12222_0002,Fl_12222_0003,Fl_12222_0004,Fl_12222_0005,Fl_12222_0006,Fl_21111_0001,Fl_21111_0002,Fl_21111_0003,Fl_21111_0004,Fl_21111_0005,Fl_21111_0006,Fl_22111_0001,Fl_22111_0002,Fl_22111_0003,Fl_22111_0004,Fl_22111_0005,Fl_22111_0006,Fl_22211_0001,Fl_22211_0002,Fl_22211_0003,Fl_22211_0004,Fl_22211_0005,Fl_22211_0006,Fl_22221_0001,Fl_22221_0002,Fl_22221_0003,Fl_22221_0004,Fl_22221_0005,Fl_22221_0006,Fl_22222_0001,Fl_22222_0002,Fl_22222_0003,Fl_22222_0004,Fl_22222_0005,Fl_22222_0006,Fl_111112_0001,Fl_111112_0002,Fl_111112_0003,Fl_111112_0004,Fl_111112_0005,Fl_111112_0006,Fl_111122_0001,Fl_111122_0002,Fl_111122_0003,Fl_111122_0004,Fl_111122_0005,Fl_111122_0006,Fl_111222_0001,Fl_111222_0002,Fl_111222_0003,Fl_111222_0004,Fl_111222_0005,Fl_111222_0006,Fl_112222_0001,Fl_112222_0002,Fl_112222_0003,Fl_112222_0004,Fl_112222_0005,Fl_112222_0006,Fl_122222_0001,Fl_122222_0002,Fl_122222_0003,Fl_122222_0004,Fl_122222_0005,Fl_122222_0006,Fl_211111_0001,Fl_211111_0002,Fl_211111_0003,Fl_211111_0004,Fl_211111_0005,Fl_211111_0006,Fl_221111_0001,Fl_221111_0002,Fl_221111_0003,Fl_221111_0004,Fl_221111_0005,Fl_221111_0006,Fl_222111_0001,Fl_222111_0002,Fl_222111_0003,Fl_222111_0004,Fl_222111_0005,Fl_222111_0006,Fl_222211_0001,Fl_222211_0002,Fl_222211_0003,Fl_222211_0004,Fl_222211_0005,Fl_222211_0006,Fl_222221_0001,Fl_222221_0002,Fl_222221_0003,Fl_222221_0004,Fl_222221_0005,Fl_222221_0006,Fl_222222_0001,Fl_222222_0002,Fl_222222_0003,Fl_222222_0004,Fl_222222_0005,Fl_222222_0006,Fl_1111122_0001,Fl_1111122_0002,Fl_1111122_0003,Fl_1111122_0004,Fl_1111122_0005,Fl_1111122_0006,Fl_1111222_0001,Fl_1111222_0002,Fl_1111222_0003,Fl_1111222_0004,Fl_1111222_0005,Fl_1111222_0006,Fl_1112222_0001,Fl_1112222_0002,Fl_1112222_0003,Fl_1112222_0004,Fl_1112222_0005,Fl_1112222_0006,Fl_2211111_0001,Fl_2211111_0002,Fl_2211111_0003,Fl_2211111_0004,Fl_2211111_0005,Fl_2211111_0006,Fl_2221111_0001,Fl_2221111_0002,Fl_2221111_0003,Fl_2221111_0004,Fl_2221111_0005,Fl_2221111_0006,Fl_2222111_0001,Fl_2222111_0002,Fl_2222111_0003,Fl_2222111_0004,Fl_2222111_0005,Fl_2222111_0006,Howto_AnmA_0001,Howto_AnmA_0002,Howto_AnmA_0003,Howto_AnmA_0004,Howto_AnmA_0005,Howto_AnmA_0006,Howto_AnmA_0007,Howto_AnmA_0008,Howto_AnmA_0009,Howto_AnmA_0010,Howto_AnmA_0011,Howto_AnmA_0012,Howto_AnmA_0013,Howto_AnmA_0014,Howto_AnmA_0015,Howto_AnmA_0016,Howto_AnmA_0017,Howto_AnmA_0018,Howto_AnmA_0019,Howto_AnmA_0020,Howto_AnmA_0021,Howto_AnmA_0022,Howto_AnmA_0023,Howto_AnmA_0024,Howto_AnmA_0025,Howto_AnmA_0026,Howto_AnmA_0027,Howto_AnmA_0028,Howto_AnmA_0029,Howto_AnmA_0030,Howto_AnmA_0031,Howto_AnmA_0032,Howto_AnmA_0033,Howto_AnmA_0034,Howto_AnmA_0035,Howto_AnmA_0036,Howto_AnmA_0037,Howto_AnmA_0038,Howto_AnmA_0039,Howto_AnmA_0040,Howto_AnmA_0041,Howto_AnmA_0042,Howto_AnmA_0043,Howto_AnmA_0044,Howto_AnmA_0045,Howto_AnmA_0046,Howto_AnmA_0047,Howto_AnmA_0048,Howto_AnmA_0049,Howto_AnmA_0050,Howto_AnmA_0051,Howto_AnmA_0052,Howto_AnmA_0053,Howto_AnmA_0054,Howto_AnmA_0055,Howto_AnmA_0056,Howto_AnmA_0057,Howto_AnmA_0058,Howto_AnmA_0059,Howto_AnmA_0060,Howto_AnmA_0061,Howto_AnmA_0062,Howto_AnmA_0063,Howto_AnmA_0064,Howto_AnmA_0065,Howto_AnmA_0066,Howto_AnmA_0067,Howto_AnmA_0068,Howto_AnmA_0069,Howto_AnmA_0070,Howto_AnmA_0071,Howto_AnmA_0072,Howto_AnmA_0073,Howto_AnmA_0074,Howto_AnmA_0075,Howto_AnmA_0076,Credit_board,Credit_01,Credit_02,Credit_03,Credit_04,Update,Custom_bg,Custom_C_s,Custom_Ca,Custom_Cb,Custom_Cb_a,Custom_Cb_b,Custom_Cb_c,Custom_Cb_d,Custom_Cb_e,Custom_Cc,Custom_Cd,Custom_Cd_a,Custom_Cd_b,Custom_Cd_c,Custom_D_s2,Custom_S_s,Custom_Sa,Custom_Sb,Cust_GameA,Cust_GameB,Cust_GameBa,Cust_GameBb,Cust_GameBc,Cust_GameBd,Cust_GameBe,Cust_GameC,Cust_GameDa,Cust_GameDb,Cust_GameDc,Menu_difficult,Menu_difficult_decide,Rush_course_01,Rush_course_02,Casual_course_01A,Casual_course_01B,Casual_course_02A,Casual_course_02B,Casual_course_03A,Casual_course_03B,Select_Ctrl_A,Select_Ctrl_B,Select_Ctrl_C,Select_Ctrl_D,Select_Up_A,Select_Down_A,Select_Shift_A,Select_Shift_B,Select_Shift_F,Select_Shift_G,Select_Space_A,Select_Space_B,Select_Space_D,Select_Space_E,Select_Space_F,Select_Space_G,Custom_bar,Select_U,Select_D,Gauge_10_bar_01,Gauge_10_bar_02,Gauge_10_bar_03,Gauge_10_bar_04,Gauge_10_bar_05,Gauge_10_bar_06,Gauge_10_bar_07,Gauge_10_bar_08,Gauge_10_bar_09,Gauge_10_bar_10,Gauge_10_bar_10_all,Gauge_10_LayerD,Gauge_10_LayerU,LvB_00001,LvB_00002,LvB_00003,LvB_00004,LvB_00005,LvB_00006,LvB_00007,LvB_00008,LvB_ap_01,LvB_ap_02,LvB_ap_03,LvB_ap_04,Party_bg,Party_left,Party_left_01,Party_left_02,Party_left_03,Party_left_04,Party_left_05,Party_O_s,Party_Oa,Party_Ob,Party_P_s,Party_Pa,Party_Pb,Party_Pc,Party_Pd,Party_Pe,Miss_Mes_A,Miss_Mes_bg,Com_bg,Com_bg_Change,Com_bg_Stock,First_Mes,Balloon_Res,Incorrect_bg,Tips_Wall","Folder 9":"sv_actors|","Folder 10":"sv_enemies|","Folder 11":"system|","Folder 12":"tilesets|","Folder 13":"titles1|","Folder 14":"titles2|","Folder 15":"","Folder 16":"","Folder 17":"","Folder 18":"","Folder 19":"","Folder 20":"","Folder 21":"","Folder 22":"","Folder 23":"","Folder 24":"","Folder 25":""}},
{"name":"ExcludeMaterialGuard","status":true,"description":"未使用素材削除ガードプラグイン","parameters":{"画像素材":"[\"particles/_ANIM_Absorb_8\",\"particles/asterisk1\",\"particles/asterisk1g\",\"particles/asterisk_thick1\",\"particles/asterisk_thick1g\",\"particles/asterisk_thin1\",\"particles/asterisk_thin1g\",\"particles/bubble1\",\"particles/bubble2\",\"particles/bubble1g\",\"particles/bubble2g\",\"particles/cartoon_fuss1\",\"particles/cartoon_fuss2\",\"particles/circle\",\"particles/circle2\",\"particles/circle3\",\"particles/circle2g\",\"particles/circle3g\",\"particles/cloud1\",\"particles/cloud2\",\"particles/cloud3\",\"particles/cloud1s\",\"particles/cloud2s\",\"particles/cloud3s\",\"particles/fish1\",\"particles/fish1g\",\"particles/flame1\",\"particles/flame1g\",\"particles/flare\",\"particles/flare2\",\"particles/heart1\",\"particles/heart4\",\"particles/heart1g\",\"particles/heart4g\",\"particles/hexagon1\",\"particles/hexagon1g\",\"particles/hexagon_line1\",\"particles/hexagon_line2\",\"particles/hexagon_line3\",\"particles/hexagon_line1g\",\"particles/hexagon_line2g\",\"particles/hexagon_line3g\",\"particles/leaf1\",\"particles/leaf1g\",\"particles/line1\",\"particles/line2\",\"particles/line3\",\"particles/line4\",\"particles/line_drop1\",\"particles/line_oval1\",\"particles/line_oval2\",\"particles/line_oval3\",\"particles/line_rain1\",\"particles/line_rain2\",\"particles/line_ray1\",\"particles/line_ray2\",\"particles/line_ray3\",\"particles/note1\",\"particles/note1g\",\"particles/note_tuplet1\",\"particles/note_tuplet1g\",\"particles/particle1\",\"particles/particle2\",\"particles/particle3\",\"particles/particle4\",\"particles/particle5\",\"particles/particle6\",\"particles/particle7\",\"particles/particle8\",\"particles/particle9\",\"particles/petal1\",\"particles/petal2\",\"particles/petal1g\",\"particles/petal2g\",\"particles/ring1\",\"particles/ring2\",\"particles/ring3\",\"particles/ring1g\",\"particles/ring2g\",\"particles/ring3g\",\"particles/ripple1\",\"particles/ripple2\",\"particles/ripple1g\",\"particles/ripple2g\",\"particles/shine1\",\"particles/shine2\",\"particles/shine3\",\"particles/shine1g\",\"particles/shine_thin1\",\"particles/shine_thin2\",\"particles/shine_thin3\",\"particles/shine_thin1g\",\"particles/smog1\",\"particles/smog2\",\"particles/smoke1\",\"particles/smoke2\",\"particles/snow1\",\"particles/snow2\",\"particles/snow3\",\"particles/snow4\",\"particles/snow5\",\"particles/snow1g\",\"particles/snow2g\",\"particles/snow3g\",\"particles/snow4g\",\"particles/snow5g\",\"particles/snow_blizard1\",\"particles/snow_blizard1g\",\"particles/snow_particle1\",\"particles/snow_particle2\",\"particles/snow_particle1g\",\"particles/snow_particle2g\",\"particles/square1\",\"particles/square3\",\"particles/square5\",\"particles/square1g\",\"particles/square3g\",\"particles/square5g\",\"particles/square_line1\",\"particles/square_line2\",\"particles/square_line3\",\"particles/square_line1g\",\"particles/square_line2g\",\"particles/square_line3g\",\"particles/star1\",\"particles/star1g\",\"particles/star_thick1\",\"particles/star_thick1g\",\"particles/star_thin1\",\"particles/star_thin1g\",\"particles/sunlight\",\"particles/thunder1\",\"particles/thunder2\",\"particles/thunder3\",\"particles/thunder1_2\",\"particles/triangle1\",\"particles/triangle1g\",\"particles/triangle_line1\",\"particles/triangle_line2\",\"particles/triangle_line1g\",\"particles/triangle_line2g\",\"system/ActionButton\",\"system/CancelButton\",\"system/DirPad\"]","音声素材":""}},
{"name":"CustomizeErrorScreen","status":true,"description":"エラー画面表示改善プラグイン","parameters":{"MainMessage":"以下のエラーが発生しました。","HyperLink":"https://forms.gle/QV1sbnDHAxf3uKig9","OutputDetail":"true"}},
{"name":"VolumeOffset","status":true,"description":"コンフィグのボリューム値を小刻みにするプラグイン","parameters":{"OffsetParameter":"5"}},
{"name":"MadeWithMv","status":false,"description":"メイン画面へ進む前に、\"Made with MV\"のスプラッシュ画面もしくはカスタマイズされたスプラッシュ画面を表示します。","parameters":{"Show Made With MV":"true","Made with MV Image":"MadeWithMv","Show Custom Splash":"false","Custom Image":"","Fade Out Time":"120","Fade In Time":"120","Wait Time":"160"}},
{"name":"AutoLoad","status":true,"description":"タイトル画面仕様変更プラグイン","parameters":{"効果音演奏":"ON","完全スキップ":"OFF","タイトルマップID":"1"}},
{"name":"111_InputForm","status":true,"description":"フォーム作って文字入力（修正版）","parameters":{}},
{"name":"AcceptAllKeys","status":true,"description":"使えるキーを拡張します","parameters":{"key_a":"a","key_b":"b","key_c":"c","key_d":"d","key_e":"e","key_f":"f","key_g":"g","key_h":"h","key_i":"i","key_j":"j","key_k":"k","key_l":"l","key_m":"m","key_n":"n","key_o":"o","key_p":"p","key_q":"pageup","key_r":"r","key_s":"s","key_t":"t","key_u":"u","key_v":"v","key_w":"pagedown","key_x":"escape","key_y":"y","key_z":"ok","key_backspace":"escape","key_tab":"tab","key_enter":"ok","key_shift":"escape","key_control":"control","key_alt":"alt","key_escape":"escape","key_space":"ok","key_pageup":"pageup","key_pagedown":"pagedown","key_left":"left","key_right":"right","key_up":"up","key_down":"down","key_insert":"escape","numpad_0":"escape","numpad_2":"down","numpad_4":"left","numpad_6":"right","numpad_8":"up","F9":"debug"}},
{"name":"FixSimultaneouslyPress","status":true,"description":"同時押し仕様変更プラグイン","parameters":{}},
{"name":"Chikuwa","status":true,"description":"「どのデータをロードしても共有した変数を読み込める」プラグイン","parameters":{"FileName":"Assign","WebStorageKey":"Chikuwa"}},
{"name":"CustomizeConfigDefault","status":true,"description":"オプションデフォルト値設定プラグイン","parameters":{"常時ダッシュ":"ON","コマンド記憶":"OFF","BGM音量":"20","BGS音量":"30","ME音量":"30","SE音量":"30","常時ダッシュ消去":"ON","コマンド記憶消去":"ON","BGM音量消去":"OFF","BGS音量消去":"ON","ME音量消去":"OFF","SE音量消去":"OFF"}},
{"name":"CustomizeConfigItem","status":true,"description":"オプション任意項目作成プラグイン","parameters":{"数値項目":"","文字項目":"","スイッチ項目":"","音量項目":""}},
{"name":"DTextPicture","status":true,"description":"動的文字列ピクチャ生成プラグイン","parameters":{"itemIconSwitchId":"0","lineSpacingVariableId":"0","frameWindowSkin":"","frameWindowPadding":"18","padCharacter":"0","prefixText":""}},
{"name":"TRP_ParticleList","status":true,"description":"","parameters":{}},
{"name":"TRP_ParticlePreset","status":true,"description":"","parameters":{}},
{"name":"TRP_Particle","status":true,"description":"※TRP_ParticlePresetより下に配置","parameters":{"importLibrary":"true","importFilter":"true","systemParticles":"[\"particle set click click\",\"particle set click2 click\"]","commandName":"particle,パーティクル","keepPictureOrder":"false","walkOffset":"16","dashOffset":"16","categoryClear":"==============================","clearCharacterOnMapChange":"true","clearPartyOnMapChange":"true","clearScreenOnMapChange":"true","clearBattleScreenOnEnd":"false","clearBattleCharaOnEnd":"true","categoryPerformance":"==============================","regionMargin":"2","outsideMargin":"6","maxParticles":"100000","categoryConflict":"==============================","disableState":"false","disableSkill":"false","disableRoute":"false","cacheBeforeTerminate":"false","categorySenior":"==============================","sceneTypes":"[\"Scene_Menu-Scene_Save-Scene_Item-Scene_Equip-Scene_Actor-Scene_Skill-Scene_Status\",\"Scene_Title\",\"Scene_Load\",\"Scene_Options\",\"Scene_Shop\",\"Scene_Gameover\"]","noRewriteFunctions":"false","categoryDebug":"==============================","displayCount":"false","errorLog":"true"}},
{"name":"TRP_ParticleEditor","status":true,"description":"※TRP_Particleより下に配置","parameters":{"showGuide":"true","paramFontSize":"18","noColorCode":"false","buttonFontSize":"13","buttonWidth":"86","saveAsArray":"false","copyAsArray":"true"}},
{"name":"dashBan","status":true,"description":"ダッシュを禁止するプラグインです","parameters":{}},
{"name":"PictureCallCommon","status":true,"description":"ピクチャのボタン化プラグイン","parameters":{"透明色を考慮":"true","ピクチャ番号の変数番号":"0","ポインタX座標の変数番号":"0","ポインタY座標の変数番号":"0","タッチ操作抑制":"false","タッチ操作抑制スイッチ":"0","戦闘中常にコモン実行":"false","並列処理として実行":"false","無効スイッチ":"0"}},
{"name":"PictureAnimation","status":true,"description":"ピクチャのアニメーションプラグイン","parameters":{"最初のセルに戻る":"false"}},
{"name":"stbvorbis_stream_asm","status":false,"description":"","parameters":{}},
{"name":"stbvorbis_stream","status":false,"description":"","parameters":{}},
{"name":"AudioStreaming","status":true,"description":"音声読み込みを高速化し、oggファイルのみを使用します。","parameters":{"mode":"10","deleteM4a":"false"}},
{"name":"SAN_Imp_ColorCache","status":true,"description":"カラーキャッシュ 1.0.0\nパフォーマンス改善プラグインです。","parameters":{}},
{"name":"SAN_Imp_SkipParallelEventPreload","status":true,"description":"並列イベントプリロードスキップ 1.0.0\nパフォーマンス改善プラグインです。","parameters":{}},
{"name":"EasingPicture","status":true,"description":"ピクチャーの移動パターンを増やします。","parameters":{}},
{"name":"LoadingExtend","status":true,"description":"ロード中画像拡張プラグイン","parameters":{"イメージ列数":"2","イメージ行数":"2","表示タイプ":"1","セル指定変数":"1","アニメーション間隔":"30","表示位置X座標":"","表示位置Y座標":"","待機フレーム数":"60","点滅なし":"OFF"}},
{"name":"PictureVariableSetting","status":true,"description":"ピクチャ関連のイベント機能拡張プラグイン","parameters":{"初期値":"OFF","ピクチャ表示最大数":"180"}},
{"name":"FixImageLoading","status":false,"description":"画像ロード時のチラつき防止プラグイン","parameters":{}},
{"name":"GraphicsRenderFix","status":true,"description":"放置していると画面がフリーズするのを修正","parameters":{}},
{"name":"SNZ_randomXorshiftOnline","status":false,"description":"ランダムに何かをする処理の精度を上げます　ブラウザプレイ対応","parameters":{}},
{"name":"MPI_AutoWaitForPicture","status":true,"description":"ピクチャの表示実行時、画像読み込み完了まで自動でウェイトする機能を提供します。","parameters":{"ピクチャの表示自動ウェイト切替スイッチ":"60"}},
{"name":"StringSearchReplace","status":true,"description":"","parameters":{}},
{"name":"Torigoya_RetryLoadPlus","status":false,"description":"ファイルの読み込み失敗時にリトライします","parameters":{"Retry Max":"10","Retry Message Text":"ファイルの読み込みに失敗しました。\\nネットワーク状況を確認して、リトライしてください。","Retry Button Text":"リトライする"}},
{"name":"ThroughFailedToLoad","status":false,"description":"ロード失敗エラーのすり抜けプラグイン","parameters":{"テストプレー時無効":"true","Web版で無効":"false","無視種別":"3"}},
{"name":"GetOriginalQuestion","status":true,"description":".csv形式の問題を読み込めます。","parameters":{}},
{"name":"DRS_BoostEngineMV","status":true,"description":"ゲームスピードを動的に変更します。","parameters":{}},
{"name":"SNZ_randomXorshiftOnline","status":false,"description":"ランダムに何かをする処理の精度を上げます　ブラウザプレイ対応","parameters":{}},
{"name":"RGenRandomizer","status":true,"description":"ランダムな変数出力","parameters":{"exported_value":"6"}},
{"name":"GetStageFromGitHub","status":true,"description":"GitHubから問題セットを持ってきて、ステージにしてくれます。すべき操作は以下の通りです。\r\n\r\nモード座標代入、プラグインコマンド「StageSelect_Enter」でモードに入れます。\r\n\r\n残機設定、カスタマイズ設定から戻るときにプラグインコマンド「StageSelect_ReturnFromConfig」を実行してください。","parameters":{"extra_page":"1099","extra_sub_place":"1100","common_click":"1091","edit_start":"200","font_edit":"游明朝"}},
{"name":"varIDforPlugin","status":true,"description":"【末尾に導入】\r\nプラグイン引数に変数の値を採用","parameters":{}},
{"name":"GitHubAutoUpdater","status":true,"description":"Allows automatic updates from a GitHub repository.","parameters":{"Owner":"Formidi","Repo":"KanzideGo","DPath":"./www/","InitialSHA":"046f733399e3ec7ac3df3ac54550b0121e9e3d50","isUpdate":"230"}}
];
