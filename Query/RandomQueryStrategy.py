from Query.QueryStrategy import QueryStrategy
from Dataset.Dataset import Dataset
import random

class RandomQueryStrategy(QueryStrategy):
    def __init__(self, dataset, rawData, keywordNums):
        super().__init__(dataset, rawData, keywordNums)
    
    def getGoldenSet(self):
        sample = random.sample(self.rawData, self.keywordNums)
        for s in sample:
            key = s['keyword']
            print("=" * 30)
            print(f'KeyWord: {key}')
            
            urlSet = self.getQuery(key)
            result = {
                "frequency": s['frequency'],
                "started": s['started'],
                'url nums': len(urlSet),
                "url": urlSet,
            }
            self.dataset.store(key, result)

            # print(f'Golden URL Nums: {len(urlSet)}')
            # print(f'Golden URL Set: {urlSet}')
            # print("=" * 30)
        self.dataset.dump()