from Dataset.Dataset import Dataset
import pandas as pd
from datetime import datetime
import os

class CSVDataset(Dataset):
    def __init__(self, path):
        super().__init__(path)
    
    def load(self):
        if not os.path.exists(self.path):
            self.query = {}
            return

        df = pd.read_csv(self.path)
        self.query = {row["keyword"]: row["urls"].split(",") for _, row in df.iterrows()}
    
    def dump(self):
        df = pd.DataFrame({
            "keyword": list(self.query.keys()),
            "urls": [",".join(v) for v in self.query.values()]
        })
        df.to_csv(self.path, index=False)

