from Dataset.Dataset import Dataset
from Dataset.CSVDataset import CSVDataset
from Dataset.JsonDataset import JsonDataset
import os

class DatasetFactory:
    def __init__(self):
        pass

    def getDataset(self, path) -> Dataset:
        if os.path.splitext(path)[1] == '.csv':
            return CSVDataset(path)
        elif os.path.splitext(path)[1] == '.json':
            return JsonDataset(path)
        
