# 骨架分析工具

把射法八節示範影片轉成 3D 骨架資料，並在瀏覽器中與原影片同步檢視。

```bash
# 從 repo 根目錄執行
python3.11 -m venv tools/pose/.venv
tools/pose/.venv/bin/pip install yt-dlp mediapipe opencv-python numpy

# 模型（不進版控）
mkdir -p tools/pose/models && cd tools/pose/models
curl -LO https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task
curl -LO https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task
cd -

# 1. 擷取每格關節點
tools/pose/.venv/bin/python tools/pose/extract.py VIDEO.mp4 data/private/<name>/landmarks.json --fps 12
# 2. 依分段計算各節數值（segments/ 內放分段設定）
tools/pose/.venv/bin/python tools/pose/analyze.py data/private/<name>/landmarks.json tools/pose/segments/<name>.json data/private/<name>/analysis.json
# 3. 檢視
python3 tools/pose/serve.py 8765
open http://127.0.0.1:8765/tools/pose/viewer/
```

檢視器預設讀取 `data/private/miyako/`；其他資料可用網址參數 `?video=&landmarks=&analysis=` 指定。

`data/private/` 不進版控：第三方影片與由其擷取的資料，未取得授權前不公開。分析結果見 [`docs/research/02-shaho-hassetsu-pose-analysis.md`](../../docs/research/02-shaho-hassetsu-pose-analysis.md)。
