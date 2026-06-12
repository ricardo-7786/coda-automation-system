# 🧪 CODA 웹 애플리케이션 테스트 가이드

## 테스트 환경 설정

### 1. 서버 시작

```bash
# 백엔드 서버 시작 (포트 5001)
cd /home/ubuntu/coda-web-outreach
PORT=5001 npm run server

# 프론트엔드 개발 서버 시작 (포트 3002)
npm run dev
```

### 2. 통합 테스트 실행

```bash
# 모든 API 엔드포인트 테스트
node test_integration.js
```

---

## 수동 테스트 체크리스트

### Phase 1: 기본 기능 테스트

#### 1.1 홈페이지
- [ ] 페이지 로드 성공
- [ ] 지역 선택 버튼 표시
- [ ] 그래디언트 배경 표시

#### 1.2 지역 선택
- [ ] 모든 지역 버튼 표시
- [ ] 지역 선택 시 데이터 로드
- [ ] 로딩 상태 표시

#### 1.3 학원 목록
- [ ] 학원 정보 표시 (이름, 주소, 전화, 이메일)
- [ ] 학원 카드 레이아웃 정상
- [ ] 스크롤 가능

#### 1.4 대시보드
- [ ] 통계 정보 표시
- [ ] 응답률 계산 정상
- [ ] 계약률 계산 정상

#### 1.5 아웃리치 계획
- [ ] 3단계 계획 표시
- [ ] 각 단계별 학원 수 표시
- [ ] 수익 계산 정상

---

### Phase 2: CRM 기능 테스트

#### 2.1 CRM 대시보드 접근
- [ ] 네비게이션에서 CRM 버튼 클릭
- [ ] CRM 대시보드 페이지 로드
- [ ] 지역 선택 가능

#### 2.2 학원 관리
- [ ] 학원 목록 표시
- [ ] 학원 선택 시 상세 정보 표시
- [ ] 상태 변경 가능 (신규 → 연락함 → 응답함 → 협상중 → 계약함)
- [ ] 상태 변경 저장 성공

#### 2.3 연락 이력 추적
- [ ] 연락 기록 추가 폼 표시
- [ ] 연락 유형 선택 (이메일, 전화, 미팅, SMS)
- [ ] 단계 선택 (1, 2, 3)
- [ ] 메시지 입력 가능
- [ ] 연락 기록 저장 성공
- [ ] 저장된 기록 목록 표시

#### 2.4 계약 관리
- [ ] 계약 추가 폼 표시
- [ ] 계약금액 입력 가능
- [ ] 시작일/종료일 선택 가능
- [ ] 계약 조건 입력 가능
- [ ] 계약 저장 성공
- [ ] 계약 상태 변경 가능

#### 2.5 이메일 추적
- [ ] 이메일 기록 추가 폼 표시
- [ ] 수신자 이메일 입력 가능
- [ ] 제목 입력 가능
- [ ] 이메일 유형 선택 가능
- [ ] 내용 입력 가능
- [ ] 이메일 기록 저장 성공
- [ ] 발송 날짜 표시

---

### Phase 3: 분석 및 리포트 테스트

#### 3.1 분석 페이지 접근
- [ ] 네비게이션에서 분석 버튼 클릭
- [ ] 분석 페이지 로드
- [ ] 지역 선택 가능

#### 3.2 개요 탭
- [ ] 통계 카드 표시 (총 학원, 연락, 응답, 계약)
- [ ] 응답률 표시
- [ ] 계약률 표시

#### 3.3 차트 탭
- [ ] 응답 추이 차트 표시
- [ ] 수익 추이 차트 표시
- [ ] 차트 데이터 정상

#### 3.4 리포트 탭
- [ ] 리포트 생성 폼 표시
- [ ] 리포트 유형 선택 (주간, 월간, 분기별)
- [ ] 리포트 생성 버튼 클릭
- [ ] 리포트 생성 성공 메시지
- [ ] 생성된 리포트 목록 표시

---

### Phase 4: 데이터 내보내기 테스트

#### 4.1 내보내기 페이지 접근
- [ ] 네비게이션에서 내보내기 버튼 클릭
- [ ] 내보내기 페이지 로드

#### 4.2 지역 선택
- [ ] 모든 지역 버튼 표시
- [ ] 지역 선택 가능

#### 4.3 JSON 형식 내보내기
- [ ] JSON 형식 선택
- [ ] 내보내기 버튼 클릭
- [ ] 파일 다운로드 성공
- [ ] 다운로드된 파일 확인

#### 4.4 CSV 형식 내보내기
- [ ] CSV 형식 선택
- [ ] 내보내기 버튼 클릭
- [ ] 파일 다운로드 성공
- [ ] Excel에서 열기 가능

#### 4.5 Excel 형식 내보내기
- [ ] Excel 형식 선택
- [ ] 내보내기 버튼 클릭
- [ ] 파일 다운로드 성공
- [ ] Excel에서 열기 가능

---

## API 엔드포인트 테스트

### 기본 API

```bash
# 지역 목록 조회
curl http://localhost:5001/api/regions

# 특정 지역 데이터
curl http://localhost:5001/api/region/gangnam

# 아웃리치 계획
curl -X POST http://localhost:5001/api/outreach/gangnam
```

### CRM API

```bash
# 학원 추가
curl -X POST http://localhost:5001/api/academies \
  -H "Content-Type: application/json" \
  -d '{"name":"테스트","address":"서울","phone":"02-1234","email":"test@test.com","region":"gangnam"}'

# 학원 목록
curl http://localhost:5001/api/academies?region=gangnam

# 학원 상태 변경
curl -X PATCH http://localhost:5001/api/academies/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"contacted"}'

# 연락 이력 추가
curl -X POST http://localhost:5001/api/contact-history \
  -H "Content-Type: application/json" \
  -d '{"academy_id":1,"contact_type":"email","contact_date":"2026-06-11T00:00:00Z","stage":1,"message":"테스트"}'

# 계약 추가
curl -X POST http://localhost:5001/api/contracts \
  -H "Content-Type: application/json" \
  -d '{"academy_id":1,"contract_date":"2026-06-11T00:00:00Z","contract_value":500,"start_date":"2026-06-01","end_date":"2027-06-01"}'

# 이메일 로그 추가
curl -X POST http://localhost:5001/api/email-logs \
  -H "Content-Type: application/json" \
  -d '{"academy_id":1,"recipient_email":"test@test.com","subject":"테스트","body":"테스트 본문","email_type":"introduction"}'

# 통계 조회
curl http://localhost:5001/api/statistics/gangnam

# 리포트 생성
curl -X POST http://localhost:5001/api/reports \
  -H "Content-Type: application/json" \
  -d '{"report_type":"weekly","region":"gangnam","report_date":"2026-06-11","total_academies":10,"contacted_count":5,"responded_count":3,"contracted_count":1,"response_rate":50,"contract_rate":10,"total_revenue":500,"report_data":{}}'

# 데이터 내보내기 (JSON)
curl http://localhost:5001/api/export/gangnam/json

# 데이터 내보내기 (CSV)
curl http://localhost:5001/api/export/gangnam/csv
```

---

## 성능 테스트

### 로딩 시간 측정

```bash
# 홈페이지 로딩 시간
time curl http://localhost:3002

# API 응답 시간
time curl http://localhost:5001/api/regions
```

### 데이터베이스 성능

```bash
# 학원 추가 성능 (100개)
for i in {1..100}; do
  curl -X POST http://localhost:5001/api/academies \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"학원$i\",\"address\":\"주소$i\",\"phone\":\"02-1234-$i\",\"email\":\"test$i@test.com\",\"region\":\"gangnam\"}"
done
```

---

## 브라우저 호환성 테스트

- [ ] Chrome 최신 버전
- [ ] Firefox 최신 버전
- [ ] Safari 최신 버전
- [ ] Edge 최신 버전

---

## 반응형 디자인 테스트

- [ ] 모바일 (375px)
- [ ] 태블릿 (768px)
- [ ] 데스크톱 (1024px)
- [ ] 대형 모니터 (1920px)

---

## 보안 테스트

- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] CSRF 방지
- [ ] 입력 검증

---

## 에러 처리 테스트

- [ ] 잘못된 지역 요청
- [ ] 없는 학원 ID 요청
- [ ] 네트워크 오류 처리
- [ ] 서버 오류 처리

---

## 테스트 결과 보고

테스트 완료 후 다음 정보를 기록하세요:

- 테스트 날짜: ___________
- 테스트 환경: ___________
- 총 테스트 수: ___________
- 통과: ___________
- 실패: ___________
- 성공률: ___________%
- 발견된 버그: ___________

---

**마지막 업데이트:** 2026년 6월 11일
