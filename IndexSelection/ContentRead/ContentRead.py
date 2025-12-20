from Chain.Handler import Handler
from Chain.PipelineResult import PipelineResult

import json

class ContentRead(Handler):
    """
    新增
    content: Content,
    type: html or json
    """
    def __init__(self):
        super().__init__()
        self.name = "readcontent"
        # 定義這個 Stage 內部的 "微產線" (Micro-Pipeline)
        self.processors = [
            self._readData
        ]

    def canHandle(self, data):
        return True

    def handle(self, data) -> PipelineResult:
        if not self.canHandle(data):
            return super().handle(data)

        try:
            for processor in self.processors:
                processor(data)

        except Exception as e:
            return PipelineResult(success=False, stage=self.name, reason=f"Error: {str(e)}")

        return super().handle(data)

    def _readData(self, data):
        if data.content_path.lower().endswith('.json'):
            data.type = 'json'
            with open(data.content_path, 'r', encoding='utf-8') as f:
                data.content = json.load(f)
            