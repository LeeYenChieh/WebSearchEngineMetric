from RawDataReader.RawDataReader import RawDataReader
from RawDataReader.CSVRawDataReader import CSVRawDataReader
import os

class RawDataReaderFactory:
    def __init__(self):
        pass

    def getRawDataReader(self, path) -> RawDataReader:
        if os.path.splitext(path)[1] == '.csv':
            return CSVRawDataReader()
