import os
from datetime import datetime, timedelta
import pandas as pd
import re
from RawDataReader.RawDataReader import RawDataReader
from serpapi import GoogleSearch

class AutoUpdateRawDataReader(RawDataReader):
    def __init__(self, update_day=14, dirpath='.'):
        super().__init__()
        self.update_day = update_day
        self.dirpath = dirpath
        self.countries = ["US", "IN", "JP", "GB", "CA", "DE", "AU", "BR", "FR", "TW"]
        # self.countries = ["TW"]

    def readData(self) -> list:
        csv_file = os.path.join(self.dirpath, "last_trending.csv")
        need_update = True

        # 判斷是否需要更新
        if os.path.exists(csv_file):
            last_modified = datetime.fromtimestamp(os.path.getmtime(csv_file))
            if (datetime.now() - last_modified).days < self.update_day:
                need_update = False

        # 如果需要更新或檔案不存在
        if need_update:
            print("Need Fetch Trending Query")
            # 如果檔案存在，先備份
            if os.path.exists(csv_file):
                backup_name = os.path.join(self.dirpath, f"last_trending_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv")
                os.rename(csv_file, backup_name)
            
            # 生成新資料
            all_data = []
            for geo in self.countries:
                trending = self._fetch_trending_now(geo)
                all_data.extend(trending)
            
            # 寫入 last_trending.csv
            df = pd.DataFrame(all_data)
            df.to_csv(csv_file, index=False)
        else:
            print(f'Use {csv_file}')
            # 只讀取
            df = pd.read_csv(csv_file)

        # 將 DataFrame 轉成你原本 readData 的格式
        result = []
        for _, row in df.iterrows():
            keyword = row['keyword']

            # frequency
            freq = int(row['frequency']) if pd.notna(row['frequency']) else 0

            # started
            started_ts = int(row['started']) if pd.notna(row['started']) else None

            # alias
            alias = []
            if pd.notna(row.get('alias')):
                alias = [x.strip() for x in str(row['alias']).split(',') if x.strip()]

            result.append({
                "keyword": keyword,
                "frequency": freq,
                "started": started_ts,
                "alias": alias
            })

        return result, last_modified

    def _fetch_trending_now(self, geo: str) -> list:
        params = {
            "engine": "google_trends_trending_now",
            "geo": geo,
            "api_key": os.environ.get('SERPAPI_KEY'),
            "hours": 168  # 過去 7 天
        }

        search = GoogleSearch(params)
        results = search.get_dict()
        trending_searches = results["trending_searches"]

        trending_list = []
        # SerpAPI 回傳 daily_trends / trending_searches
        for row in trending_searches:
            keyword = row.get("query")
            freq = row.get("search_volume")
            started_ts = row.get("start_timestamp")
            alias = row.get("trend_breakdown")
            if alias is None:
                alias_str = ""
            else:
                alias_str = ",".join([str(x).strip() for x in alias if str(x).strip()])
            data = {
                "keyword": keyword,
                "frequency": freq,
                "started": started_ts,
                "alias": alias_str
            }
            trending_list.append(data)
        print(f'Fetch {geo} Trending Query')
        return trending_list
