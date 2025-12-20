from argparse import ArgumentParser

from Database.Database import Database
from models import UrlStateMixin, create_url_state_model

from Chain.Handler import Handler
from Chain.PipelineResult import PipelineResult
from ContentRead.ContentRead import ContentRead
from Extraction.ExtractionJson import ExtractionJson

DB_USER = "crawler"      # 請修改
DB_PASS = "crawler"      # 請修改
DB_HOST = "ws2.csie.ntu.edu.tw"
DB_PORT = "22224"        # 指定 Port
DB_NAME = "crawlerdb"    # 請修改

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

def parseArgs():
    parser = ArgumentParser()

    args = parser.parse_args()
    return args

def main():
    args = parseArgs()

    db = Database(DATABASE_URL)

    h1: Handler = ContentRead()
    # h2 = ExtractionJson()

    # h1.setnext(h2)

    with db.session() as s:
        for i in range(1):
            table_name = f'url_state_{i:03}'
            
            UrlState = create_url_state_model(table_name)
            datas: list[UrlStateMixin] = s.query(UrlState)\
                .filter(UrlState.fetch_ok > 0)\
                .yield_per(1000)
            
            for j in range(5):
                datas[j].content_path = '.' + datas[j].content_path
                result: PipelineResult = h1.handle(datas[j])
                print(result.data.content)
                print(result.reason)
                print(result.stage)
                print(result.success)
        

if __name__ == '__main__':
    main()
