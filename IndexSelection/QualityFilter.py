import re
from bs4 import BeautifulSoup

class QualityFilter:
    def __init__(self):
        # 設定你的閾值
        self.MIN_TEXT_LENGTH = 50  # 至少 50 個字
        self.MIN_TCR = 0.15        # 至少 15% 是文字
        self.SOFT_404_KEYWORDS = ["page not found", "404 error", "找不到頁面", "已下架"]

    def calculate_tcr(self, html_content, text_content):
        """計算 Text-to-Code Ratio"""
        if not html_content or len(html_content) == 0:
            return 0
        return len(text_content) / len(html_content)

    def is_soft_404(self, text_content):
        """簡單的關鍵字匹配檢查 Soft 404"""
        sample = text_content[:500].lower() # 只檢查開頭部分
        for keyword in self.SOFT_404_KEYWORDS:
            if keyword in sample:
                return True
        return False

    def check(self, html_content):
        """
        Input: Raw HTML
        Output: (Pass/Fail, Reason, CleanedText)
        """
        # 1. Parsing
        soup = BeautifulSoup(html_content, 'lxml')
        
        # 移除 script 和 style 以獲取純淨文字
        for script in soup(["script", "style", "meta", "noscript"]):
            script.extract()
            
        text = soup.get_text(separator=' ', strip=True)
        
        # 2. Length Check
        if len(text) < self.MIN_TEXT_LENGTH:
            return False, "TEXT_TOO_SHORT", None

        # 3. TCR Check
        tcr = self.calculate_tcr(html_content, text)
        if tcr < self.MIN_TCR:
            return False, f"LOW_TCR_{tcr:.2f}", None
            
        # 4. Soft 404 Check
        if self.is_soft_404(text):
            return False, "SOFT_404", None

        return True, "PASS", text

# Usage Example
filter_engine = QualityFilter()
passed, reason, clean_text = filter_engine.check(raw_html_content)

if passed:
    print(f"Indexing URL... (Length: {len(clean_text)})")
else:
    print(f"Skipping URL: {reason}")