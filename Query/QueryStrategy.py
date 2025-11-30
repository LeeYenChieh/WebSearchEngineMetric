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
        try:
            params = {
                "engine": "google",
                "q": query,
                "num": nums,
                "api_key": os.environ.get('SERPAPI_KEY')
            }

            search = GoogleSearch(params)
            results = search.get_dict()
            if "error" in results:
                raise Exception(results['error'])

            urls = [r["link"] for r in results.get("organic_results", []) if "link" in r]
            
            return urls
        except Exception as e:
            error_msg = str(e)
            print(error_msg)
            return []