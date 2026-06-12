#!/usr/bin/env python3
"""
CODA Academy Crawler Service
Node.js 백엔드와 통합되는 Python 크롤러 서비스
"""

import requests
import json
import time
import re
import sys
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
from datetime import datetime

class CodaAcademyCrawler:
    def __init__(self):
        self.base_url = "https://map.naver.com/v5/api/search"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.email_pattern = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
        
        # 지역별 좌표
        self.regions = {
            "gangnam": {
                "name": "강남권",
                "locations": {
                    "강남": {"lat": 37.4979, "lng": 127.0276},
                    "서초": {"lat": 37.4830, "lng": 127.0326},
                    "송파": {"lat": 37.5172, "lng": 127.1007}
                }
            },
            "busan": {
                "name": "부산권",
                "locations": {
                    "해운대": {"lat": 35.1596, "lng": 129.1607},
                    "부산진": {"lat": 35.1595, "lng": 129.0629}
                }
            },
            "daegu": {
                "name": "대구권",
                "locations": {
                    "중구": {"lat": 35.8714, "lng": 128.5957},
                    "수성": {"lat": 35.8519, "lng": 128.6241}
                }
            }
        }
    
    def extract_email_from_website(self, url: str) -> Optional[str]:
        """웹사이트에서 이메일 주소 추출"""
        if not url:
            return None
        
        try:
            if not url.startswith('http'):
                url = 'https://' + url
            
            response = requests.get(url, timeout=5, headers=self.headers)
            response.encoding = 'utf-8'
            
            emails = self.email_pattern.findall(response.text)
            
            if emails:
                spam_domains = ['naver.com', 'gmail.com', 'yahoo.com', 'hotmail.com']
                for email in emails:
                    domain = email.split('@')[1].lower()
                    if domain not in spam_domains:
                        return email
            
            return None
        except Exception as e:
            return None
    
    def search_academies(self, query: str, region_id: str, location_name: str) -> List[Dict]:
        """실용음악학원 검색"""
        academies = []
        
        try:
            region_info = self.regions[region_id]["locations"][location_name]
            
            params = {
                'query': query,
                'displayCount': 100,
                'searchCoord': f"{region_info['lng']};{region_info['lat']}"
            }
            
            response = requests.get(self.base_url, params=params, headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                results = data.get('result', {}).get('place', {}).get('list', [])
                
                for item in results:
                    academy = {
                        'name': item.get('name', ''),
                        'address': item.get('address', ''),
                        'roadAddress': item.get('roadAddress', ''),
                        'phone': item.get('telephone', ''),
                        'url': item.get('url', ''),
                        'region': location_name,
                        'email': None,
                        'crawled_at': datetime.now().isoformat()
                    }
                    
                    # 웹사이트에서 이메일 추출
                    if academy['url']:
                        academy['email'] = self.extract_email_from_website(academy['url'])
                    
                    academies.append(academy)
                    time.sleep(0.3)  # 요청 제한
        
        except Exception as e:
            print(f"Error searching {location_name}: {e}", file=sys.stderr)
        
        return academies
    
    def crawl_region(self, region_id: str) -> List[Dict]:
        """특정 지역 크롤링"""
        all_academies = []
        
        if region_id not in self.regions:
            return all_academies
        
        region_info = self.regions[region_id]
        
        for location_name in region_info["locations"].keys():
            # 실용음악학원 검색
            academies = self.search_academies(f"{location_name} 실용음악학원", region_id, location_name)
            all_academies.extend(academies)
            time.sleep(0.5)
            
            # 보컬학원 검색
            academies = self.search_academies(f"{location_name} 보컬학원", region_id, location_name)
            all_academies.extend(academies)
            time.sleep(0.5)
        
        return all_academies
    
    def get_region_data(self, region_id: str) -> Dict:
        """지역 데이터 반환 (JSON 형식)"""
        academies = self.crawl_region(region_id)
        
        # 중복 제거
        unique_academies = []
        seen_names = set()
        
        for academy in academies:
            if academy['name'] not in seen_names:
                unique_academies.append(academy)
                seen_names.add(academy['name'])
        
        return {
            'region': self.regions[region_id]['name'],
            'total_academies': len(unique_academies),
            'academies': unique_academies
        }

def main():
    """메인 함수"""
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Region ID required'}))
        sys.exit(1)
    
    region_id = sys.argv[1]
    
    crawler = CodaAcademyCrawler()
    result = crawler.get_region_data(region_id)
    
    print(json.dumps(result, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
