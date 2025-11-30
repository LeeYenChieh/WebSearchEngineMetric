from Measure.Measure import Measure
from Dataset.Dataset import Dataset
from tqdm import tqdm
import requests

class URLAllMeasure(Measure):
    def __init__(self, dataset: Dataset, url, resultDataset: Dataset):
        super().__init__()
        self.dataset = dataset
        self.url = url
        self.resultDataset = resultDataset
        self.resultDataset.clear()
    
    def test(self):
        discover_correct = 0
        fetch_correct = 0
        upload_correct = 0
        total = 0

        pbar = tqdm(total=len(self.dataset.getKeys()))
        for keyword in self.dataset.getKeys():
            for goldenurl in self.dataset.get(keyword)['url']:
                total += 1
                response = requests.get(f'{self.url}/status/url?url={goldenurl}')

                discover_fail = True
                fetch_fail = True
                upload_fail = True
                if response.status_code == 200:
                    data = response.json()
                    if data['in_db']:
                        discover_correct += 1
                        discover_fail = False
                    if data['fetched']:
                        fetch_correct += 1
                        fetch_fail = False
                    if data['uploaded']:
                        upload_correct += 1
                        upload_fail = False
                else:
                    print("Response Status Code: " + response.status_code)

                if self.resultDataset.get(keyword) == None:
                    self.resultDataset.store(keyword, [{'url': goldenurl, 'discover_find': not discover_fail, 'fetch_find': not fetch_fail, 'upload_find': not upload_fail}])
                else:
                    self.resultDataset.get(keyword).append({'url': goldenurl, 'discover_find': not discover_fail, 'fetch_find': not fetch_fail, 'upload_find': not upload_fail})
            pbar.update(1)
        pbar.close()
        print(f'Discover Performance: {discover_correct} / {total}')
        print(f'Fetch Performance: {fetch_correct} / {total}')
        print(f'Upload Performance: {upload_correct} / {total}')
        self.resultDataset.store("__total__", {
            "discover_find": discover_correct,
            "fetch_find": fetch_correct,
            "upload_find": upload_correct,
            "total": total
        })
        self.resultDataset.dump()