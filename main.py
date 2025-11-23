from Dataset.Dataset import Dataset
from Dataset.DatasetFactory import DatasetFactory

from RawDataReader.RawDataReader import RawDataReader
from RawDataReader.CSVRawDataReader import CSVRawDataReader
from RawDataReader.AutoUpdateRawDataReader import AutoUpdateRawDataReader

from Query.QueryContext import QueryContext
from Query.RandomQueryStrategy import RandomQueryStrategy
from Query.HeadQueryStrategy import HeadQueryStrategy

from Measure.MeasureContext import MeasureContext
from Measure.URLDiscoverMeasure import URLDiscoveryMeasure
from Measure.URLFetchedMeasure import URLFetchedMeasure
from Measure.URLUploadedMeasure import URLUploadedMeasure

from argparse import ArgumentParser

import os

def parseArgs():
    parser = ArgumentParser()

    parser.add_argument("--datadir", help="Metric data dir path")
    parser.add_argument("--strategy", nargs='+', choices=['random', 'head'], help="raw data path")
    parser.add_argument("--measure", nargs='+', choices=['discover', 'fetch', 'upload'], help="raw data path")

    parser.add_argument("--create", action='store_true', help="create dataset")
    parser.add_argument("--rawdatareader", choices=['csv', 'auto'], help="raw data reader strategy")
    parser.add_argument("--rawdatapath", help="Raw data path")
    parser.add_argument("--rawdatadir", default='.', help="Auto generator raw data dir")
    parser.add_argument("--update", type=int, default=14, help="auto generator days")
    parser.add_argument("--keywordNums", type=int, default=100, help="Metric Data Keyword Nums")

    parser.add_argument("--test", action='store_true', help="test performance")
    parser.add_argument("--url", help="raw data path")
    parser.add_argument("--resultdir", help="Result Dir")

    args = parser.parse_args()
    return args

def createDataset(args):
    rawDataReader: RawDataReader = None
    rawdata_timestamp = None
    if args.rawdatareader == "csv":
        rawDataReader = CSVRawDataReader(args.rawdatapath)
    elif args.rawdatareader == "auto":
        rawDataReader = AutoUpdateRawDataReader(args.update, args.rawdatadir)
    rawData = rawDataReader.readData()

    context: QueryContext = QueryContext()

    if 'random' in args.strategy:
        dataset: Dataset  = DatasetFactory().getDataset('{args.datadir}/random.csv', True, rawdata_timestamp)
        context.setQueryStrategy(RandomQueryStrategy(dataset, rawData, args.keywordNums))
        context.getGoldenSet()
    if 'head' in args.strategy:
        dataset: Dataset  = DatasetFactory().getDataset('{args.datadir}/head.csv', True, rawdata_timestamp)
        context.setQueryStrategy(HeadQueryStrategy(dataset, rawData, args.keywordNums))
        context.getGoldenSet()

def get_latest_dataset_file(dir, base, ext):
    prefix = base + "_"
    files = [
        f for f in os.listdir(dir)
        if f.startswith(prefix) and f.endswith(ext)
    ]
    files = sorted(files)   # 今天最大
    return f'{dir}/{files[-1]}' if files else None

def test(args):
    dataset: list  = []
    resultDataset: list  = []
    context: MeasureContext = MeasureContext()

    if 'random' in args.strategy:
        dataset.append(DatasetFactory().getDataset(get_latest_dataset_file(args.datadir, 'random', '.csv')))
        resultDataset.append({
            "discover": DatasetFactory().getDataset(f'{args.resultdir}/random_discover.json'),
            "fetch": DatasetFactory().getDataset(f'{args.resultdir}/random_fetch.json'),
            "upload": DatasetFactory().getDataset(f'{args.resultdir}/randomd_upload.json'),
            "rank": DatasetFactory().getDataset(f'{args.resultdir}/random_rank.json'),
        })
    if 'head' in args.strategy:
        dataset.append(DatasetFactory().getDataset(get_latest_dataset_file(args.datadir, 'head', '.csv')))
        resultDataset.append({
            "discover": DatasetFactory().getDataset(f'{args.resultdir}/head_discover.json'),
            "fetch": DatasetFactory().getDataset(f'{args.resultdir}/head_fetch.json'),
            "upload": DatasetFactory().getDataset(f'{args.resultdir}/head_upload.json'),
            "rank": DatasetFactory().getDataset(f'{args.resultdir}/head_rank.json'),
        })

    if 'discover' in args.measure:
        for i in range(len(dataset)):
            context.setMeasure(URLDiscoveryMeasure(dataset[i], args.url, resultDataset[i]["discover"]))
            context.test()
    if 'fetch' in args.measure:
        for i in range(len(dataset)):
            context.setMeasure(URLFetchedMeasure(dataset[i], args.url, resultDataset[i]["fetch"]))
            context.test()
    if 'upload' in args.measure:
        for i in range(len(dataset)):
            context.setMeasure(URLUploadedMeasure(dataset[i], args.url, resultDataset[i]["upload"]))
            context.test()

def main():
    args = parseArgs()

    if args.create:
        createDataset(args)
    if args.test:
        test(args)

if __name__ == '__main__':
    main()
