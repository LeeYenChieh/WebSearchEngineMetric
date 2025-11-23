from Dataset.Dataset import Dataset
from Dataset.CSVDataset import CSVDataset
from Dataset.AutoDateCSVDataset import AutoDateCSVDataset
from Dataset.JsonDataset import JsonDataset
import os

class DatasetFactory:
    def __init__(self):
        pass

    def getDataset(self, path, autoDate=False, rawdata_timestamp=None) -> Dataset:
        if os.path.splitext(path)[1] == '.csv':
            if not autoDate:
                return CSVDataset(path)
            else:
                return AutoDateCSVDataset(path, rawdata_timestamp)
        elif os.path.splitext(path)[1] == '.json':
            return JsonDataset(path)
        
