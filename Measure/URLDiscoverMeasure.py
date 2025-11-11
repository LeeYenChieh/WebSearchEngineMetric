from Measure.Measure import Measure
from Dataset.Dataset import Dataset
import requests

class URLDiscoveryMeasure(Measure):
    def __init__(self, dataset: Dataset, url):
        super().__init__()
        self.dataset = dataset
        self.url = url
    
    def test(self):
        correct = 0
        total = 0
        for keyword in self.dataset.getKeys():
            for goldenurl in self.dataset.get(keyword):
                total += 1
                response = requests.get(f'{self.url}/status/url?url={goldenurl}')

                if response.status_code == 200:
                    data = response.json()
                    if data['in_db']:
                        correct += 1
                else:
                    print("Response Status Code: " + response.status_code)
        print(f'Performance: {correct} / {total}')