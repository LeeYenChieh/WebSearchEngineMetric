from Chain.Handler import Handler
from Chain.PipelineResult import PipelineResult
import re
import datetime
from collections import Counter

class ExtractionJson(Handler):
    """
    新增
    content: parse過後的content,
    content_length: content 長度

    """
    def __init__(self):
        super().__init__()
        self.name = "Extraction"
        # 定義這個 Stage 內部的 "微產線" (Micro-Pipeline)
        self.processors = [
            self._remove_boilerplate,
            self._normalize_date,
            self._fix_metadata,
            self._extract_entities,
            self._auto_tag,
            self._extract_domain
        ]

    def canHandle(self, data):
        return data.content_path.lower().endswith('.json')

    def handle(self, data) -> PipelineResult:
        if not self.canHandle(data):
            return super().handle(data)

        try:
            for processor in self.processors:
                processor(data)

        except Exception as e:
            return PipelineResult(success=False, stage=self.name, reason=f"Error: {str(e)}")

        return super().handle(data)

    # --- 以下是獨立的處理邏輯 (分離的區塊) ---

    def _remove_boilerplate(self, data):
        content = data.get('content', '') or ''
        title = data.get('title', '') or ''
        content = re.sub(r'Copyright ©.*', '', content, flags=re.IGNORECASE).strip()
        if content.startswith(title):
            content = content[len(title):].strip()
        data.content = content
        data.content_length = len(content)

    def _normalize_date(self, data):
        ts = data.get('timestamp')
        if ts and isinstance(ts, (int, float)):
            data['published_at'] = datetime.datetime.fromtimestamp(ts / 1000.0).isoformat()
        else:
            data['published_at'] = datetime.datetime.now().isoformat()

    def _fix_metadata(self, data):
        if 'meta' not in data or data['meta'] is None:
            data['meta'] = {}

    def _extract_entities(self, data):
        # 這裡的邏輯被隔離了，很乾淨
        text = data.get('content', '')
        entities = []
        target_entities = ['Basel', 'Spiesshof', 'SBB']
        for ent in target_entities:
            if ent in text:
                entities.append(ent)
        data['entities'] = list(set(entities))

    def _auto_tag(self, data):
        if not data['meta'].get('keywords'):
            # 這裡可以呼叫外部複雜邏輯，不影響主流程
            data['meta']['keywords'] = ["Generated", "Tag"]
            data['is_auto_tagged'] = True

    def _extract_domain(self, data):
        canonical = data['meta'].get('canonical', '')
        if canonical:
            data['domain'] = "extracted.com" # 簡化範例