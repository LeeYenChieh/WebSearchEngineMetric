from Dataset.Dataset import Dataset
from Dataset.CSVDataset import CSVDataset

from RawDataReader.RawDataReaderFactory import RawDataReaderFactory
from RawDataReader.RawDataReader import RawDataReader

from Query.QueryContext import QueryContext
from Query.RandomQueryStrategy import RandomQueryStrategy

from Measure.MeasureContext import MeasureContext
from Measure.URLDiscoverMeasure import URLDiscoveryMeasure

from argparse import ArgumentParser

def parseArgs():
    parser = ArgumentParser()

    parser.add_argument("--datapath", help="data path")

    parser.add_argument("--create", action='store_true', help="create dataset")
    parser.add_argument("--rawdatapath", help="raw data path")
    parser.add_argument("--strategy", choices=['random'], help="raw data path")
    parser.add_argument("--keywordNums", type=int, default=100, help="keyword Nums")

    parser.add_argument("--test", action='store_true', help="test performance")
    parser.add_argument("--measure", choices=['discover'], help="raw data path")
    parser.add_argument("--url", help="raw data path")

    args = parser.parse_args()
    return args

def createDataset(args):
    factory = RawDataReaderFactory()
    rawDataReader: RawDataReader = factory.getRawDataReader(args.rawdatapath)
    rawData = rawDataReader.readData(args.rawdatapath)

    dataset: Dataset  = CSVDataset(args.datapath)
    context: QueryContext = QueryContext()

    if args.strategy == 'random':
        context.setQueryStrategy(RandomQueryStrategy(dataset, rawData, args.keywordNums))
    
    context.getGoldenSet()

def test(args):
    dataset: Dataset  = CSVDataset(args.datapath)
    context: MeasureContext = MeasureContext()

    if args.measure == 'discovery':
        context.setMeasure(URLDiscoveryMeasure(dataset, args.url))
    
    context.test()

def main():
    args = parseArgs()

    if args.create:
        createDataset(args)
    if args.test:
        test(args)

if __name__ == '__main__':
    main()
