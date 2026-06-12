# 📚 CODA 파트너 아카데미 - 완전 가이드

## 📖 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [시스템 아키텍처](#시스템-아키텍처)
3. [설치 및 실행](#설치-및-실행)
4. [주요 기능](#주요-기능)
5. [API 문서](#api-문서)
6. [데이터베이스](#데이터베이스)
7. [배포 가이드](#배포-가이드)
8. [문제 해결](#문제-해결)

---

## 프로젝트 개요

### 목표
CODA 보컬 연습 앱의 파트너십 확보를 위한 자동화된 아웃리치 시스템 구축

### 주요 특징
- 🌍 지역별 학원 데이터 관리
- 📊 자동 아웃리치 계획 생성
- 💼 CRM 기능 (연락 이력, 계약 관리)
- 📈 분석 및 리포트
- 📥 데이터 내보내기 (JSON/CSV/Excel)

### 기술 스택
- **프론트엔드**: React 19 + Vite 8 + Tailwind CSS 4
- **백엔드**: Express.js 5 + Node.js 22
- **데이터베이스**: SQLite 3
- **크롤러**: Python 3.11 + BeautifulSoup

---

## 시스템 아키텍처

```
┌─────────────────────────────────────────┐
│      웹 브라우저 (사용자)               │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────▼──────────┐
        │  React 프론트엔드   │
        │  (포트 3002)        │
        │                     │
        │ - 홈 페이지         │
        │ - CRM 대시보드      │
        │ - 분석 페이지       │
        │ - 내보내기 페이지   │
        └──────────┬──────────┘
                   │ (REST API)
        ┌──────────▼──────────┐
        │  Express 백엔드     │
        │  (포트 5001)        │
        │                     │
        │ - API 라우트        │
        │ - 비즈니스 로직     │
        │ - 데이터 처리       │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │  SQLite 데이터베이스 │
        │  (coda.db)          │
        │                     │
        │ - 학원 정보         │
        │ - 연락 이력         │
        │ - 계약 정보         │
        │ - 이메일 로그       │
        │ - 리포트            │
        └─────────────────────┘
```

---

## 설치 및 실행

### 1. 필수 요구사항
- Node.js 22+
- npm 또는 pnpm
- Python 3.8+ (선택사항)

### 2. 설치

```bash
# 프로젝트 디렉토리 이동
cd /home/ubuntu/coda-web-outreach

# 의존성 설치
npm install

# 환경 설정 파일 생성
cp .env.example .env
```

### 3. 개발 모드 실행

**터미널 1: 백엔드 서버**
```bash
PORT=5001 npm run server
```

**터미널 2: 프론트엔드 개발 서버**
```bash
npm run dev
```

**접근 주소:**
- 프론트엔드: http://localhost:3002
- 백엔드 API: http://localhost:5001

### 4. 프로덕션 빌드

```bash
npm run build
```

---

## 주요 기능

### 1. 홈 페이지
- 지역 선택
- 학원 목록 표시
- 기본 통계
- 아웃리치 계획 시각화

### 2. CRM 대시보드
- **학원 관리**: 학원 정보 및 상태 관리
- **연락 이력**: 연락 기록 추적
- **계약 관리**: 계약 정보 및 상태 관리
- **이메일 추적**: 이메일 발송 및 추적

### 3. 분석 페이지
- **개요**: 주요 통계 카드
- **차트**: 응답 추이, 수익 추이
- **리포트**: 주간/월간/분기별 리포트

### 4. 데이터 내보내기
- JSON 형식
- CSV 형식
- Excel 형식

---

## API 문서

### 기본 API

#### 지역 목록 조회
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

#### 특정 지역 데이터
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
      "name": "학원명",
      "address": "주소",
      "phone": "전화",
      "email": "이메일"
    }
  ]
}
```

#### 아웃리치 계획
```
POST /api/outreach/:region
```

**응답:**
```json
{
  "status": "success",
  "region": "강남권",
  "total_academies": 9,
  "response_rate": "44%",
  "contract_rate": "22%",
  "monthly_revenue": "1000만 원"
}
```

### CRM API

#### 학원 관리
```
POST   /api/academies              # 학원 추가
GET    /api/academies?region=...   # 학원 목록
GET    /api/academies/:id          # 학원 상세
PATCH  /api/academies/:id/status   # 상태 변경
```

#### 연락 이력
```
POST   /api/contact-history        # 연락 기록 추가
GET    /api/contact-history/:id    # 연락 이력 조회
POST   /api/contact-history/:id/response  # 응답 기록
```

#### 계약 관리
```
POST   /api/contracts              # 계약 추가
GET    /api/contracts?academy_id=... # 계약 조회
PATCH  /api/contracts/:id/status   # 상태 변경
```

#### 이메일 추적
```
POST   /api/email-logs             # 이메일 기록
GET    /api/email-logs/:academy_id # 이메일 로그
POST   /api/email-logs/:id/open    # 오픈 기록
```

#### 분석 및 리포트
```
GET    /api/statistics/:region     # 통계 조회
POST   /api/reports                # 리포트 생성
GET    /api/reports?region=...     # 리포트 조회
```

#### 데이터 내보내기
```
GET    /api/export/:region/json    # JSON 내보내기
GET    /api/export/:region/csv     # CSV 내보내기
```

---

## 데이터베이스

### 테이블 구조

#### academies (학원)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본 키 |
| name | TEXT | 학원명 |
| address | TEXT | 주소 |
| phone | TEXT | 전화 |
| email | TEXT | 이메일 |
| region | TEXT | 지역 |
| status | TEXT | 상태 |
| created_at | DATETIME | 생성일 |

#### contact_history (연락 이력)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본 키 |
| academy_id | INTEGER | 학원 ID |
| contact_type | TEXT | 연락 유형 |
| contact_date | DATETIME | 연락 날짜 |
| stage | INTEGER | 아웃리치 단계 |
| response_received | BOOLEAN | 응답 여부 |

#### contracts (계약)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본 키 |
| academy_id | INTEGER | 학원 ID |
| contract_date | DATETIME | 계약일 |
| contract_value | REAL | 계약금액 |
| contract_status | TEXT | 계약 상태 |
| start_date | DATE | 시작일 |
| end_date | DATE | 종료일 |

#### email_logs (이메일 로그)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본 키 |
| academy_id | INTEGER | 학원 ID |
| recipient_email | TEXT | 수신자 |
| subject | TEXT | 제목 |
| sent_date | DATETIME | 발송일 |
| opened | BOOLEAN | 오픈 여부 |
| clicked | BOOLEAN | 클릭 여부 |

#### reports (리포트)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER | 기본 키 |
| report_type | TEXT | 리포트 유형 |
| region | TEXT | 지역 |
| report_date | DATE | 리포트 날짜 |
| response_rate | REAL | 응답률 |
| contract_rate | REAL | 계약률 |
| total_revenue | REAL | 총 수익 |

---

## 배포 가이드

### Vercel 배포

```bash
# 프로덕션 빌드
npm run build

# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

### Heroku 배포

```bash
# Procfile 생성
echo "web: node server.js" > Procfile

# Heroku 로그인
heroku login

# 앱 생성 및 배포
heroku create coda-partner-academy
git push heroku main
```

### Docker 배포

```bash
# 이미지 빌드
docker build -t coda-partner-academy .

# 컨테이너 실행
docker run -p 5001:5001 -e NODE_ENV=production coda-partner-academy
```

---

## 문제 해결

### 포트 충돌
```bash
# 포트 확인
netstat -tlnp | grep 5001

# 프로세스 종료
kill -9 <PID>
```

### 데이터베이스 오류
```bash
# 데이터베이스 초기화
rm coda.db
node server.js  # 재시작하면 자동 생성
```

### 의존성 문제
```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### 크롤러 타임아웃
```bash
# .env 파일에서 타임아웃 증가
CRAWLER_TIMEOUT=60000
```

---

## 성능 최적화

### 1. 프론트엔드
- 번들 크기 최소화
- 이미지 최적화
- 캐싱 설정

### 2. 백엔드
- 데이터베이스 인덱싱
- API 응답 압축
- 캐시 활용

### 3. 데이터베이스
- 쿼리 최적화
- 인덱스 설정
- 연결 풀링

---

## 보안 고려사항

- ✓ HTTPS 사용
- ✓ 환경 변수 보호
- ✓ 입력 검증
- ✓ SQL Injection 방지
- ✓ XSS 방지
- ✓ CORS 설정

---

## 지원 및 문의

문제가 발생하면 다음을 확인하세요:

1. **로그 파일 확인**
   ```bash
   tail -f .manus-logs/devserver.log
   ```

2. **API 테스트**
   ```bash
   curl http://localhost:5001/api/regions
   ```

3. **데이터베이스 상태**
   ```bash
   sqlite3 coda.db ".tables"
   ```

---

## 라이선스

CODA 파트너 아카데미 프로젝트 (내부 사용)

---

**마지막 업데이트:** 2026년 6월 11일
**버전:** 1.0.0
**상태:** 프로덕션 준비 완료 ✓
