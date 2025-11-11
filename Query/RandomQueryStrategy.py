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
            urlSet = self.getQuery(key)
            self.dataset.store(key, urlSet)

            print("=" * 30)
            print(f'KeyWord: {key}')
            print(f'Golden URL Set: {urlSet}')
            print("=" * 30)
        self.dataset.dump()