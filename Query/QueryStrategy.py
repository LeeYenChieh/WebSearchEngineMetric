from Dataset.Dataset import Dataset
from serpapi import GoogleSearch
import os

class QueryStrategy:
    def __init__(self, dataset: Dataset, rawData: list, keywordNums: int):
        self.dataset: Dataset = dataset
        self.rawData: list = rawData
        self.keywordNums: int = keywordNums

    def getGoldenSet(self):
        pass
    
    def getQuery(self, query, nums=10):
        params = {
            "engine": "google",
            "q": query,
            "num": nums,
            "api_key": os.environ.get('SERPAPI_KEY')
        }

        search = GoogleSearch(params)
        results = search.get_dict()
        urls = [r["link"] for r in results.get("organic_results", []) if "link" in r]

        urls = []
        start = 0  # 第一頁從 0 開始
        cnt = 0

        while len(urls) < nums:
            params = {
                "engine": "google",
                "q": query,
                "num": nums,  # 嘗試拿多一點
                "start": start,
                "api_key": os.environ.get("SERPAPI_KEY")
            }

            search = GoogleSearch(params)
            results = search.get_dict()

            organic_results = results.get("organic_results", [])
            page_urls = [r.get("link") for r in organic_results if "link" in r]

            # 加進總列表並去重
            for u in page_urls:
                if u not in urls:
                    urls.append(u)

            # 沒有更多結果就停止
            if not page_urls:
                break

            # 準備抓下一頁
            start += len(page_urls)
            cnt += 1

        # 只取前 target_count 筆
        return urls[:nums], cnt