// FUSE 02 Ver.1.00. 2012.12.22. TEAM B
//         Ver.1.10. 2012.12.31. @kuny1975
//         Ver.1.20. 2013.05.02. @kuny1975
enchant();

// 制限時間
var LIMIT_TIME = 120;

window.onload = function()
{
	// ゲームシステム定数定義
	var GAME_SCREEN_SIZE_W = 320;	// スクリーンサイズ横幅
	var GAME_SCREEN_SIZE_H = 240;	// スクリーンサイズ縦幅
	var GAME_AREA_X_MIN = 0;
	var GAME_AREA_X_MAX = GAME_SCREEN_SIZE_W;
	var GAME_AREA_Y_MIN = 0;
	var GAME_AREA_Y_MAX = GAME_SCREEN_SIZE_H;
	var GAME_FPS_VAR = 60;			// フレームレート

	// ゲームシステム登録
	var game = new Game(GAME_SCREEN_SIZE_W, GAME_SCREEN_SIZE_H);
	game.fps = GAME_FPS_VAR;
	game.score = 0;
	// 「Ｚ」キーを「ａ」ボタンに割り当てる
	game.keybind(90, "a");

	// 素材読み込み
	game.preload('BG001.png');
	game.preload('player.png');
	game.preload('shot.png');
	game.preload('effect0.png');
	game.preload('chara2.png');
	game.preload('chara6.png');
	game.preload('chara7.png');

	game.preload('HEX001.png');
	game.preload('HEX002.png');
	game.preload('HEX003.png');
	game.preload('HEX004.png');
	game.preload('HEX005.png');

	game.preload('WOOD001.png');
	game.preload('WOOD002.png');
	game.preload('WOOD003.png');
	game.preload('WOOD004.png');
	game.preload('WOOD005.png');

	game.preload('clear.png');

	game.onload = function()
	{
		// 敵管理配列
		enemys = [];
		// 巣管理配列
		hexs = [];
		hexsHP = [];

		// -- 背景 --------------------------------------------------------------
		var BG_OBJ_1_SIZE_W = 640;										// オブジェクトサイズ横幅
		var BG_OBJ_1_SIZE_H = 240;										// オブジェクトサイズ縦幅

		var BG_1_MOVE_SPEED = 2/40;										// スクロールスピード


		// -- 背景（近景１） --------------------------------------------------------------
		var bg1 = new Sprite(BG_OBJ_1_SIZE_W, BG_OBJ_1_SIZE_H);
		bg1.image = game.assets['BG001.png'];
		bg1.frame = 0;
		bg1.x = 0;
		bg1.y = 0;
		game.rootScene.addChild(bg1);

		bg1.addEventListener("enterframe", function()
		{
			if(( bg1.x -= BG_1_MOVE_SPEED ) < -GAME_AREA_X_MAX )
				bg1.x = 0;
		});

		// -- エネミー --------------------------------------------------------------
		game.addEnemy = function(type,posX,posY)
		{
			var ENEMY_OBJ_SIZE_W = 32;
			var ENEMY_OBJ_SIZE_H = 32;
			var ENEMY_MOVE_SPEED = 1;
			// 敵00用フレーム情報
			var ENEMY_OBJ_FRAME_TOP = 0;								// アニメーションフレーム初期位置
			var ENEMY_OBJ_FRAME_BOTTOM = ENEMY_OBJ_FRAME_TOP + 2;		// アニメーションフレーム最終位置
			// 敵01用フレーム情報
			var ENEMY_OBJ_01_FRAME_TOP = 9;								// アニメーションフレーム初期位置
			var ENEMY_OBJ_01_FRAME_BOTTOM = ENEMY_OBJ_01_FRAME_TOP + 2;	// アニメーションフレーム最終位置
			// 敵02用フレーム情報
			var ENEMY_OBJ_02_FRAME_TOP = 9;								// アニメーションフレーム初期位置
			var ENEMY_OBJ_02_FRAME_BOTTOM = ENEMY_OBJ_FRAME_TOP + 2;	// アニメーションフレーム最終位置
			// タイプ分けの為フレーム用変数
			var enemyFrameTop = ENEMY_OBJ_FRAME_TOP;
			var enemyFrameBtm = ENEMY_OBJ_FRAME_BOTTOM;
			// 敵種類保存
			var typeIndex = type;
			// 座標計算用テンポラリ
			var tmpY;
			// 移動シーケンス制御用
			var enemyMoveSeq = 0;

			var enemy = new Sprite(ENEMY_OBJ_SIZE_W, ENEMY_OBJ_SIZE_H);

			switch(typeIndex)
			{
				// 敵00
				case 0:
				default:

					enemy.image = game.assets['chara2.png'];
					enemyFrameTop = ENEMY_OBJ_FRAME_TOP;
					enemyFrameBtm = ENEMY_OBJ_FRAME_BOTTOM;
					break;

				// 敵01
				case 1:

					enemy.image = game.assets['chara6.png'];
					enemyFrameTop = ENEMY_OBJ_01_FRAME_TOP;
					enemyFrameBtm = ENEMY_OBJ_01_FRAME_BOTTOM;
					break;

				// 敵02
				case 2:

					enemy.image = game.assets['chara7.png'];
					enemyFrameTop = ENEMY_OBJ_01_FRAME_TOP;
					enemyFrameBtm = ENEMY_OBJ_01_FRAME_BOTTOM;
					break;
			}
			enemy.frame = enemyFrameTop;

			enemy.x = posX + ENEMY_OBJ_SIZE_W;
			enemy.y = posY - ENEMY_OBJ_SIZE_H/2;
			tmpY = enemy.y;
			enemy.intervalCount = 0;

			game.rootScene.addChild(enemy);

			// エネミー管理配列に登録
			enemy.key = game.frame;
			enemys[game.frame] = enemy;

			enemy.addEventListener("enterframe", function()
			{
				switch(typeIndex)
				{
					// 単純移動
					case 0:
					default:

						enemy.x -= ENEMY_MOVE_SPEED;
						break;

					// sin波移動
					case 1:

						enemy.x -= ENEMY_MOVE_SPEED/2;
						enemy.y = tmpY + Math.sin(((enemy.intervalCount+=8)/16)*(Math.PI/180))*48;
						break;

					// 一時停止倍速移動
					case 2:

						switch(enemyMoveSeq)
						{
							case 0:
							default:

								if((enemy.x -= ENEMY_MOVE_SPEED) < 280)
								{
									enemy.intervalCount = 60;
									enemyFrameTop = 15;
									enemyFrameBtm = 15;
									enemy.frame = enemyFrameTop;
									++enemyMoveSeq;
								}
								else
								{
									break;
								}

							case 1:

								if(--enemy.intervalCount <= 0)
								{
									enemyFrameTop = 16;
									enemyFrameBtm = 17;
									enemy.frame = enemyFrameTop;
									++enemyMoveSeq;
								}
								else
								{
									// 処理なし
								}
								break;

							case 2:

								enemy.x -= ENEMY_MOVE_SPEED*5;
								break;
						}
						break;
				}

				if(enemy.x < GAME_AREA_X_MIN - ENEMY_OBJ_SIZE_W)
				{
					game.rootScene.removeChild(enemy);
					delete enemys[enemy.key];
				}
				else
				{
					// 処理なし
				}

				// アニメーション
				if(!(enemy.age % PLAYER_OBJ_FRAME_WAIT))
				{
					// 最終フレームを超えたら初期フレームに戻す
					if(++enemy.frame > enemyFrameBtm)
					{
						enemy.frame = enemyFrameTop;
					}
					else
					{
						// 処理なし
					}
				}
				else
				{
					// 処理なし
				}
			});
		};

		// -- 巣 --------------------------------------------------------------
		game.addHex = function(type,posX,posY)
		{
			var HEX_OBJ_SIZE_W = 64;
			var HEX_OBJ_SIZE_H = 64;
			var HEX_OBJ_FRAME_TOP = 0;								// アニメーションフレーム初期位置
			var HEX_MOVE_SPEED = 1;

			var hex = new Sprite(HEX_OBJ_SIZE_W, HEX_OBJ_SIZE_H);

			var num = Math.random()*4;

			switch(Math.floor(num))
			{
				case 0:
					hex.image = game.assets['HEX001.png'];
					break;
				case 1:
					hex.image = game.assets['HEX002.png'];
					break;
				case 2:
					hex.image = game.assets['HEX003.png'];
					break;
				case 3:
					hex.image = game.assets['HEX004.png'];
					break;
				case 4:
					hex.image = game.assets['HEX005.png'];
					break;
				default:
					break;
			}

			hex.frame = HEX_OBJ_FRAME_TOP;
			hex.x = posX;
			hex.y = posY + HEX_OBJ_SIZE_H/2;
			game.rootScene.addChild(hex);

			// 巣管理配列に登録
			hex.key = game.frame;
			hexs[game.frame] = hex;
			hexsHP[game.frame] = 3;

			hex.addEventListener("enterframe", function()
			{
				if((hex.x -= HEX_MOVE_SPEED) < GAME_AREA_X_MIN - HEX_OBJ_SIZE_W)
				{
					game.rootScene.removeChild(hex);
					delete hexs[hex.key];
					hexsHP[game.frame] = 0;
				}
				else
				{
					// 処理なし
				}
			});
		};

		// -- 木 --------------------------------------------------------------
		game.addWood = function(type,posX,posY)
		{
			var WOOD_OBJ_SIZE_W = 110;
			var WOOD_OBJ_SIZE_H = 240;
			var WOOD_OBJ_FRAME_TOP = 0;								// アニメーションフレーム初期位置
			var WOOD_MOVE_SPEED = 1;

			var wood = new Sprite(WOOD_OBJ_SIZE_W, WOOD_OBJ_SIZE_H);

			var num = Math.random()*4;

			switch(Math.floor(num))
			{
				case 0:
					wood.image = game.assets['WOOD001.png'];
					break;
				case 1:
					wood.image = game.assets['WOOD002.png'];
					break;
				case 2:
					wood.image = game.assets['WOOD003.png'];
					break;
				case 3:
					wood.image = game.assets['WOOD004.png'];
					break;
				case 4:
					wood.image = game.assets['WOOD005.png'];
					break;
				default:
					break;
			}

			wood.frame = WOOD_OBJ_FRAME_TOP;
			wood.x = posX;
			wood.y = posY;
			game.rootScene.addChild(wood);

			wood.addEventListener("enterframe", function()
			{
				if((wood.x -= WOOD_MOVE_SPEED) < GAME_AREA_X_MIN - WOOD_OBJ_SIZE_W)
				{
					game.rootScene.removeChild(wood);
				}
				else
				{
					// 処理なし
				}
			});
		};

		// -- プレイヤー --------------------------------------------------------------
		var PLAYER_OBJ_SIZE_W = 64;										// オブジェクトサイズ横幅
		var PLAYER_OBJ_SIZE_H = 64;										// オブジェクトサイズ縦幅
		var PLAYER_OBJ_FRAME_TOP = 0;									// アニメーションフレーム初期位置
		var PLAYER_OBJ_FRAME_BOTTOM = PLAYER_OBJ_FRAME_TOP + 2;			// アニメーションフレーム最終位置
		var PLAYER_OBJ_FRAME_WAIT = 8;									// アニメーション間隔
		var PLAYER_MOVE_SPEED = 2;										// 上下左右方向の移動速度
		var PLAYER_MOVE_OBLIQUE_SPEED = PLAYER_MOVE_SPEED/Math.sqrt(2);	// 斜め方向の移動速度
		var PLAYER_SHOT_ENTRY_OFFSET_X = 48;							// ショット発射位置オフセットＸ
		var PLAYER_SHOT_ENTRY_OFFSET_Y = 0;								// ショット発射位置オフセットＹ
		var playerShotEnable = true;									// ショットチャタリング対策用フラグ

		// プレイヤー初期設定（敵で見る為にグローバル）
	 	player = new Sprite(PLAYER_OBJ_SIZE_W, PLAYER_OBJ_SIZE_H);
		player.image = game.assets['player.png'];
		player.frame = PLAYER_OBJ_FRAME_TOP;
		player.x = 0;
		player.y = (GAME_AREA_Y_MAX - PLAYER_OBJ_SIZE_H)/2;
		game.rootScene.addChild(player);

		player.addEventListener("enterframe", function()
		{
			// ショットボタン入力かつショット許可中ならば
			if(game.input.a && playerShotEnable == true )
			{
				// ショット登録
				game.addPlayerShot(player.x + PLAYER_SHOT_ENTRY_OFFSET_X, player.y + PLAYER_SHOT_ENTRY_OFFSET_Y);
				// ショット不許可にする（チャタリング防止）
				playerShotEnable = false;
			}
			else if(!game.input.a)
			{
				// ショットボタン入力なしの場合にショット許可にする（チャタリング防止）
				playerShotEnable = true;
			}
			else
			{
				// 処理なし
			}

			// 移動処理
			if(game.input.up && game.input.right)			// 右斜め上
			{
				player.x += PLAYER_MOVE_OBLIQUE_SPEED;
				player.y -= PLAYER_MOVE_OBLIQUE_SPEED;
			}
			else if(game.input.right && game.input.down)	// 右斜め下
			{
				player.x += PLAYER_MOVE_OBLIQUE_SPEED;
				player.y += PLAYER_MOVE_OBLIQUE_SPEED;
			}
			else if(game.input.left && game.input.down)		// 左斜め下
			{
				player.x -= PLAYER_MOVE_OBLIQUE_SPEED;
				player.y += PLAYER_MOVE_OBLIQUE_SPEED;
			}
			else if(game.input.left && game.input.up)		// 左斜め上
			{
				player.x -= PLAYER_MOVE_OBLIQUE_SPEED;
				player.y -= PLAYER_MOVE_OBLIQUE_SPEED;
			}
			else if(game.input.up && !game.input.down)		// 上
			{
				player.y -= PLAYER_MOVE_SPEED;
			}
			else if(game.input.right && !game.input.left)	// 右
			{
				player.x += PLAYER_MOVE_SPEED;
			}
			else if(game.input.down && !game.input.up)		// 下
			{
				player.y += PLAYER_MOVE_SPEED;
			}
			else if(game.input.left && !game.input.right)	// 左
			{
				player.x -= PLAYER_MOVE_SPEED;
			}
			else
			{
				// 処理なし
			}

			// 画面範囲チェック横幅
			if((player.x -= PLAYER_MOVE_SPEED) < GAME_AREA_X_MIN)
			{
				player.x = GAME_AREA_X_MIN;
			}
			else if((player.x += PLAYER_MOVE_SPEED) > GAME_AREA_X_MAX - PLAYER_OBJ_SIZE_W)
			{
				player.x = GAME_AREA_X_MAX - PLAYER_OBJ_SIZE_W;
			}
			else
			{
				// 処理なし
			}

			// 画面範囲チェック縦幅
			if((player.y -= PLAYER_MOVE_SPEED) < GAME_AREA_Y_MIN)
			{
				player.y = GAME_AREA_Y_MIN;
			}
			else if((player.y += PLAYER_MOVE_SPEED) > GAME_AREA_Y_MAX - PLAYER_OBJ_SIZE_H)
			{
				player.y = GAME_AREA_Y_MAX - PLAYER_OBJ_SIZE_H;
			}
			else
			{
				// 処理なし
			}

			// アニメーション
/*
			if(!(player.age % PLAYER_OBJ_FRAME_WAIT))
			{
				// 最終フレームを超えたら初期フレームに戻す
				if(++player.frame > PLAYER_OBJ_FRAME_BOTTOM)
				{
					player.frame = PLAYER_OBJ_FRAME_TOP;
				}
				else
				{
					// 処理なし
				}
			}
			else
			{
				// 処理なし
			}
*/
					// エネミーとの当たり判定処理
					for(var i in enemys)
					{
						if(enemys[i].within(player, 16))
						{
						//	game.rootScene.removeChild(player);
							game.rootScene.removeChild(enemys[i]);
							delete enemys[i];

							if(game.score >= 10000)
							{
								var clear = new Scene() ;

								// 背景の生成
								var bg = new Sprite( 320, 240 ) ;
								bg.image = game.assets[ 'clear.png' ] ;
								clear.addChild( bg ) ;

								game.pushScene(clear) ;

								clear.addEventListener("enterframe", function()
								{
									// GAME OVERまでのタメ
									if(!(clear.age % (GAME_FPS_VAR*5)))
									{
									//	game.popScene();
										clear.removeChild( bg ) ;
										game.end(game.score, "あなたのスコアは" + game.score);
									}
									else
									{
									// 処理なし
									}
								});
							}
							else
							{
								game.end(game.score, "あなたのスコアは" + game.score);
							}
						}
						else
						{
						}
					}
		});

		// -- プレイヤー弾 --------------------------------------------------------------
		game.addPlayerShot = function(posX,posY)
		{
			var PSHOT_OBJ_SIZE_W = 32;
			var PSHOT_OBJ_SIZE_H = 32;
			var PSHOT_OBJ_FRAME_TOP = 0;
			var PSHOT_MOVE_SPEED = 4;

			var playerShot = new Sprite(PSHOT_OBJ_SIZE_W, PSHOT_OBJ_SIZE_H);
			playerShot.image = game.assets['shot.png'];
			playerShot.frame = PSHOT_OBJ_FRAME_TOP;
			playerShot.x = posX;
			playerShot.y = posY;
			game.rootScene.addChild(playerShot);

			playerShot.addEventListener("enterframe", function()
			{
				if((playerShot.x += PSHOT_MOVE_SPEED) > GAME_AREA_X_MAX + PSHOT_OBJ_SIZE_W)
				{
					game.rootScene.removeChild(playerShot);
				}
				else
				{
					// エネミーとの当たり判定処理
					for(var i in enemys)
					{
						if(enemys[i].within(playerShot, 16))
						{
							game.addEffect(0,enemys[i].x,enemys[i].y);
							game.rootScene.removeChild(playerShot);
							game.rootScene.removeChild(enemys[i]);
							delete enemys[i];
							game.score += 10;
						}
						else
						{
						}
					}

					// 巣との当たり判定処理
					for(var i in hexs)
					{
						if(hexs[i].within(playerShot, 16))
						{
							game.rootScene.removeChild(playerShot);
							if( --hexsHP[i] <= 0 )
							{
								game.addEffect(0,hexs[i].x,hexs[i].y + 16 );
								game.rootScene.removeChild(hexs[i]);
								delete hexs[i];
								hexsHP[i] = 0;
								game.score += 1000;
							}
						}
						else
						{
						}
					}
				}
			});
		};

		// -- エフェクト --------------------------------------------------------------
		game.addEffect = function(type,posX,posY)
		{
			var EFFECT_OBJ_SIZE_W = 16;
			var EFFECT_OBJ_SIZE_H = 16;
			var EFFECT_OBJ_FRAME_TOP = 0;								// アニメーションフレーム初期位置
			var EFFECT_OBJ_FRAME_BOTTOM = EFFECT_OBJ_FRAME_TOP + 3;		// アニメーションフレーム最終位置
			var EFFECT_MOVE_SPEED = 1;

			var effect = new Sprite(EFFECT_OBJ_SIZE_W, EFFECT_OBJ_SIZE_H);
			effect.image = game.assets['effect0.png'];
			effect.frame = EFFECT_OBJ_FRAME_TOP;
			effect.x = posX;
			effect.y = posY + 8;
			effect.scaleX = 2.0;
			effect.scaleY = 2.0;
			game.rootScene.addChild(effect);

			effect.addEventListener("enterframe", function()
			{
				// アニメーション
				if(!(effect.age % PLAYER_OBJ_FRAME_WAIT))
				{
					// 最終フレームを超えたら初期フレームに戻す
					if(++effect.frame > EFFECT_OBJ_FRAME_BOTTOM)
					{
						game.rootScene.removeChild(effect);
					}
					else
					{
						// 処理なし
					}
				}
				else
				{
					// 処理なし
				}
			});
		};

		// -- フレーム毎のイベント制御 --------------------------------------------------------------
		// イベントエントリーマップ
		var eventMap =
		[
		//  WAIT TYPE PRM0 POSX POSY PRM1
			 120,   0,   0,   0,   0,   0,		// 2s

			 120,   1,   0, 320,  64,   0,		// 4s
			  36,   1,   0, 320,  64,   0,		// 4.5s
			  36,   1,   0, 320,  64,   0,		// 5s
			  36,   1,   0, 320,  64,   0,		// 5.5s
			  36,   1,   0, 320,  64,   0,		// 6s

			 120,   1,   0, 320, 176,   0,		// 8s
			  36,   1,   0, 320, 176,   0,		// 8.5s
			  36,   1,   0, 320, 176,   0,		// 9s
			  36,   1,   0, 320, 176,   0,		// 9.5s
			  36,   1,   0, 320, 176,   0,		// 10s

			 120,   3,   0, 320,   0,   0,		// 12s

			 120,   1,   1, 320,  64,   0,		// 14s
			  30,   1,   1, 320,  64,   0,		// 14.5s
			  30,   1,   1, 320,  64,   0,		// 15s
			  30,   1,   1, 320,  64,   0,		// 15.5s
			  30,   1,   1, 320,  64,   0,		// 16s

			 120,   1,   1, 320, 176,   0,		// 18s
			  30,   1,   1, 320, 176,   0,		// 18.5s
			  30,   1,   1, 320, 176,   0,		// 19s
			  30,   1,   1, 320, 176,   0,		// 19.5s
			  30,   1,   1, 320, 176,   0,		// 20s

			 120,   3,   0, 320,   0,   0,		// 12s
			  60,   3,   0, 320,   0,   0,		// 12s

			 120,   1,   0, 320,  64,   0,		// 14s
			  36,   1,   0, 320,  64,   0,		// 14.5s
			  36,   1,   0, 320,  64,   0,		// 15s
			  36,   1,   0, 320,  64,   0,		// 15.5s
			  36,   1,   0, 320,  64,   0,		// 16s

			 120,   1,   0, 320, 176,   0,		// 18s
			  36,   1,   0, 320, 176,   0,		// 18.5s
			  36,   1,   0, 320, 176,   0,		// 19s
			  36,   1,   0, 320, 176,   0,		// 19.5s
			  36,   1,   0, 320, 176,   0,		// 20s

			 120,   1,   2, 320,  64,   0,		// 14s
			  30,   1,   2, 320,  64,   0,		// 14.5s
			  30,   1,   2, 320,  64,   0,		// 15s
			  30,   1,   2, 320,  64,   0,		// 15.5s
			  30,   1,   2, 320,  64,   0,		// 16s

			 120,   1,   2, 320, 176,   0,		// 18s
			  30,   1,   2, 320, 176,   0,		// 18.5s
			  30,   1,   2, 320, 176,   0,		// 19s
			  30,   1,   2, 320, 176,   0,		// 19.5s
			  30,   1,   2, 320, 176,   0,		// 20s

			  -1,
		];

		var EVENT_MAP_TOP = 6 * 0;							// イベントマップ先頭定義（デバッグするときは変更等）
		var eventMapIndex = EVENT_MAP_TOP;					// イベントマップインデックス
		var eventWait = eventMap[eventMapIndex];			// 次のイベントまでのウエイト

		var EVENT_TYPE_WAIT_ONLY = 0;						// イベント種類「ウエイトのみ」
		var EVENT_TYPE_ENEMY_ENTRY = 1;						// イベント種類「エネミー」
		var EVENT_TYPE_ENEMY_BOSS = 2;						// イベント種類「エネミーボス」
		var EVENT_TYPE_WOOD_ENTRY= 3;						// イベント種類「木」

		game.addEventListener("enterframe", function()
		{
			label.text = "SCORE:" + game.score + "点";

			// ゲーム開始かつウエイトゼロの場合に次のイベント登録
			if(game.started == true && --eventWait <= 0)
			{
				// イベント種類に応じたイベント登録処理
				switch(eventMap[++eventMapIndex])
				{
					// ウエイトのみ
					case EVENT_TYPE_WAIT_ONLY:

						eventMapIndex+=4;
						break;

					// エネミー
					case EVENT_TYPE_ENEMY_ENTRY:

						var param0 = eventMap[++eventMapIndex];
						var posx = eventMap[++eventMapIndex];
						var posy = eventMap[++eventMapIndex];
						var param1 = eventMap[++eventMapIndex];
						game.addEnemy(param0, posx, posy);
						break;

					// エネミーボス
					case EVENT_TYPE_ENEMY_BOSS:
						break;

					// 木
					case EVENT_TYPE_WOOD_ENTRY:

						var param0 = eventMap[++eventMapIndex];
						var posx = eventMap[++eventMapIndex];
						var posy = eventMap[++eventMapIndex];
						var param1 = eventMap[++eventMapIndex];
						game.addWood(param0, posx, posy);
						game.addHex(param0, posx, posy);
						break;

					default:
						break;
				};

				// 次のイベントまでのウエイトを取得
				while(1)
				{
					eventWait = eventMap[eventMapIndex];
					// 「-1」ならイベントマップ先頭に戻す
					if( eventWait == -1 )
					{
						eventMapIndex = EVENT_MAP_TOP;
					}
					else
					{
						break;
					}
				};
			}
			else
			{
				// 処理なし
			}
		});
		var label = new Label("SCORE:0点");
		label.font = "16px monospace";
		label.x = 5;
		label.y = 5;
		label.color = "white";
		game.rootScene.addChild(label);

		var time_label = new Label("TIME:120");
		time_label.font = "16px monospace";
		time_label.x = 5;
		time_label.y = 20;
		time_label.color = "white";

		time_label.addEventListener(enchant.Event.ENTER_FRAME, function()
		{
			var progress = parseInt(game.frame/game.fps);
			time = LIMIT_TIME - parseInt(game.frame/game.fps)+"";
			this.text = "TIME: " + time;
			this.color = "white";
			if (time <= 0)
			{
				if(game.score >= 10000)
				{
					var clear = new Scene() ;

					// 背景の生成
					var bg = new Sprite( 320, 240 ) ;
					bg.image = game.assets[ 'clear.png' ] ;
					clear.addChild( bg ) ;

					game.pushScene(clear) ;

					clear.addEventListener("enterframe", function()
					{
						// GAME OVERまでのタメ
						if(!(clear.age % (GAME_FPS_VAR*5)))
						{
						//	game.popScene();
							clear.removeChild( bg ) ;
							game.end(game.score, "あなたのスコアは" + game.score);
						}
						else
						{
						// 処理なし
						}
					});
				}
				else
				{
					game.end(game.score, "あなたのスコアは" + game.score);
				}
			}
		});
		game.rootScene.addChild(time_label);
 
		var pad = new Pad();
		pad.x = 0;
		pad.y = 140;
		game.rootScene.addChild(pad);
	};
	game.start();
};

