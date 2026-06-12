# 🎤 CODA 파트너 아카데미 - 자동 아웃리치 시스템

CODA 보컬 연습 앱의 파트너십 확보를 위한 웹 기반 자동 아웃리치 시스템입니다.

## 🎯 주요 기능

### 1. 지역별 학원 데이터 조회
- 강남, 부산, 대구, 대전, 광주, 인천 등 주요 지역 지원
- 실시간 학원 정보 (이름, 주소, 전화, 이메일)
- 캐시 시스템으로 빠른 응답

### 2. 자동 아웃리치 계획
- **1단계**: 초기 접촉 (1주) - 모든 학원에 소개 메일 발송
- **2단계**: 응답 추적 (2주) - 응답한 학원과 상담 일정 확정
- **3단계**: 계약 체결 (3주) - 파트너십 계약 체결

### 3. 수익 분석
- 월간 예상 수익 계산
- 연간 예상 수익 분석
- 응답률 및 계약률 예측

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────┐
│      React 프론트엔드 (포트 3002)       │
│  - 지역 선택 UI                        │
│  - 실시간 대시보드                     │
│  - 학원 목록 표시                      │
│  - 아웃리치 계획 시각화                │
└─────────────────────────────────────────┘
              ↓ (API 호출)
┌─────────────────────────────────────────┐
│    Express 백엔드 (포트 5001)           │
│  - REST API 엔드포인트                 │
│  - 캐시 시스템                         │
│  - 데이터 처리                         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│      Python 크롤러 (선택사항)           │
│  - Naver 지도 API 통합                 │
│  - 웹사이트 이메일 추출                │
│  - 데이터 캐싱                         │
└─────────────────────────────────────────┘
```

## 📁 프로젝트 구조

```
coda-web-outreach/
├── server.js                 # Express 백엔드
├── crawler_service.py        # Python 크롤러
├── crawler_cache.js          # 캐시 시스템
├── vite.config.js           # Vite 설정
├── tailwind.config.js       # Tailwind CSS 설정
├── postcss.config.js        # PostCSS 설정
├── package.json             # 의존성
├── index.html               # React 진입점
├── src/
│   ├── main.jsx            # React 메인 파일
│   ├── App.jsx             # 메인 컴포넌트
│   ├── index.css           # 전역 스타일
│   └── components/
│       ├── RegionSelector.jsx    # 지역 선택
│       ├── Dashboard.jsx         # 대시보드
│       ├── AcademiesList.jsx     # 학원 목록
│       └── OutreachPlan.jsx      # 아웃리치 계획
├── .cache/                  # 캐시 디렉토리
└── public/                  # 정적 파일
```

## 🚀 시작하기

### 설치

```bash
cd /home/ubuntu/coda-web-outreach
npm install
```

### 개발 모드 실행

**터미널 1: 백엔드 서버**
```bash
PORT=5001 npm run server
```

**터미널 2: 프론트엔드 개발 서버**
```bash
npm run dev
```

프론트엔드는 `http://localhost:3002`에서 접근 가능합니다.

### 프로덕션 빌드

```bash
npm run build
```

## 📡 API 엔드포인트

### 1. 지역 목록 조회
```
GET /api/regions
```

**응답:**
```json
[
  { "id": "gangnam", "name": "강남권", "count": 9 },
  { "id": "busan", "name": "부산권", "count": 3 }
]
```

### 2. 지역별 학원 데이터
```
GET /api/region/:region
```

**응답:**
```json
{
  "region": "강남권",
  "total_academies": 9,
  "academies": [
    {
      "name": "남주희실용음악학원 강남점",
      "address": "서울 강남구 선릉로 86길 15",
      "phone": "02-6959-8899",
      "email": "info@namjuhee.com"
    }
  ]
}
```

### 3. 아웃리치 계획 생성
```
POST /api/outreach/:region
```

**응답:**
```json
{
  "status": "success",
  "region": "강남권",
  "total_academies": 9,
  "stage1_sent": 9,
  "stage2_sent": 4,
  "stage3_sent": 2,
  "responses": 4,
  "contracts": 2,
  "response_rate": "44%",
  "contract_rate": "22%",
  "monthly_revenue": "1000만 원",
  "annual_revenue": "12000만 원"
}
```

## 🔧 기술 스택

### 프론트엔드
- **React 19** - UI 라이브러리
- **Vite 8** - 빌드 도구
- **Tailwind CSS 4** - 스타일링
- **Wouter** - 라우팅 (필요시)

### 백엔드
- **Node.js 22** - 런타임
- **Express 5** - 웹 프레임워크
- **CORS** - 크로스 오리진 요청

### 크롤러
- **Python 3** - 크롤링 언어
- **BeautifulSoup** - HTML 파싱
- **Requests** - HTTP 요청

## 💾 캐시 시스템

캐시는 `.cache/` 디렉토리에 저장됩니다:
- `gangnam.json` - 강남권 데이터
- `busan.json` - 부산권 데이터
- 등등...

캐시된 데이터는 다음 요청 시 즉시 반환되어 응답 속도를 향상시킵니다.

## 📊 데이터 흐름

```
사용자 지역 선택
    ↓
프론트엔드 API 호출 (/api/region/:region)
    ↓
백엔드 캐시 확인
    ├─ 캐시 있음 → 즉시 반환
    └─ 캐시 없음 → Python 크롤러 실행 → 캐시 저장 → 반환
    ↓
프론트엔드 데이터 표시
    ├─ 학원 목록
    ├─ 대시보드 통계
    └─ 아웃리치 계획
```

## 🎨 UI/UX 특징

- **반응형 디자인** - 모바일/태블릿/데스크톱 지원
- **그래디언트 배경** - 전문적인 시각적 디자인
- **카드 기반 레이아웃** - 정보 구조화
- **실시간 업데이트** - 선택 즉시 데이터 표시
- **직관적 네비게이션** - 사용자 친화적 인터페이스

## 🔐 보안 고려사항

- CORS 설정으로 크로스 오리진 요청 제어
- 환경 변수로 민감한 정보 관리
- 캐시 시스템으로 외부 API 호출 최소화

## 📈 확장 가능성

### 새로운 지역 추가
1. `crawler_cache.js`의 `DEFAULT_ACADEMIES`에 지역 데이터 추가
2. `server.js`의 `academiesData`에 지역 추가
3. 프론트엔드는 자동으로 새로운 지역 표시

### 실제 크롤링 통합
1. `crawler_service.py` 활성화
2. Naver 지도 API 설정
3. 백엔드에서 Python 크롤러 호출

### 데이터베이스 연동
1. MongoDB/PostgreSQL 추가
2. 크롤링 결과 저장
3. 아웃리치 이력 관리

## 🐛 문제 해결

### 포트 충돌
```bash
# 포트 확인
netstat -tlnp | grep 5001

# 프로세스 종료
kill -9 <PID>
```

### 캐시 초기화
```bash
rm -rf .cache/
```

### 의존성 재설치
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 라이선스

CODA 파트너 아카데미 프로젝트 (내부 사용)

## 👥 팀

- 개발: CODA 개발팀
- 디자인: CODA 디자인팀

---

**마지막 업데이트:** 2026년 6월 11일
