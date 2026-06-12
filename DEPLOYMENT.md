# 🚀 CODA 웹 애플리케이션 배포 가이드

## 로컬 개발 환경 설정

### 1. 필수 요구사항
- Node.js 22+ 
- npm 또는 pnpm
- Python 3.8+ (크롤러 사용 시)

### 2. 설치 및 실행

```bash
# 프로젝트 디렉토리 이동
cd /home/ubuntu/coda-web-outreach

# 의존성 설치
npm install

# 환경 설정 파일 생성
cp .env.example .env

# 백엔드 서버 시작 (터미널 1)
PORT=5001 npm run server

# 프론트엔드 개발 서버 시작 (터미널 2)
npm run dev
```

### 3. 접근 주소
- **프론트엔드**: http://localhost:3002
- **백엔드 API**: http://localhost:5001
- **API 문서**: http://localhost:5001/api/regions

---

## 프로덕션 배포

### 옵션 1: Vercel (권장)

#### 1.1 Vercel CLI 설치
```bash
npm install -g vercel
```

#### 1.2 프로젝트 배포
```bash
# 프로덕션 빌드
npm run build

# Vercel에 배포
vercel
```

#### 1.3 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수 추가:
```
PORT=5001
NODE_ENV=production
```

### 옵션 2: Heroku

#### 2.1 Heroku CLI 설치
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 2.2 Procfile 생성
```bash
cat > Procfile << EOF
web: node server.js
EOF
```

#### 2.3 배포
```bash
# Heroku 로그인
heroku login

# 앱 생성
heroku create coda-partner-academy

# 배포
git push heroku main

# 로그 확인
heroku logs --tail
```

### 옵션 3: Docker (자체 서버)

#### 3.1 Dockerfile 생성
```dockerfile
FROM node:22-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install --production

# 소스 코드 복사
COPY . .

# 프론트엔드 빌드
RUN npm run build

# 포트 노출
EXPOSE 5001

# 서버 시작
CMD ["node", "server.js"]
```

#### 3.2 Docker 이미지 빌드 및 실행
```bash
# 이미지 빌드
docker build -t coda-partner-academy .

# 컨테이너 실행
docker run -p 5001:5001 -e NODE_ENV=production coda-partner-academy
```

#### 3.3 Docker Compose (선택사항)
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5001:5001"
    environment:
      NODE_ENV: production
      PORT: 5001
    volumes:
      - ./.cache:/app/.cache

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

---

## 프로덕션 체크리스트

- [ ] 환경 변수 설정 (.env 파일)
- [ ] 프로덕션 빌드 테스트 (`npm run build`)
- [ ] 보안 헤더 설정 (HTTPS, CORS)
- [ ] 로깅 및 모니터링 설정
- [ ] 캐시 정책 최적화
- [ ] 데이터베이스 백업 계획
- [ ] 에러 추적 (Sentry 등)
- [ ] 성능 모니터링 (New Relic 등)
- [ ] SSL 인증서 설정
- [ ] 도메인 연결

---

## 성능 최적화

### 1. 프론트엔드 최적화
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 분석
npm run preview
```

### 2. 백엔드 최적화
```javascript
// server.js에서 압축 활성화
const compression = require('compression');
app.use(compression());

// 캐시 헤더 설정
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
});
```

### 3. 데이터베이스 최적화
- 인덱싱 설정
- 쿼리 최적화
- 연결 풀링

---

## 모니터링 및 유지보수

### 1. 로그 모니터링
```bash
# 실시간 로그 확인
tail -f logs/server.log

# 에러 로그 필터링
grep ERROR logs/server.log
```

### 2. 성능 메트릭
```bash
# CPU/메모리 사용량
top -p $(pgrep -f "node server.js")

# 네트워크 연결 상태
netstat -an | grep 5001
```

### 3. 정기 유지보수
- 의존성 업데이트 (`npm update`)
- 보안 취약점 스캔 (`npm audit`)
- 캐시 정리 (`rm -rf .cache/`)
- 로그 로테이션

---

## 트러블슈팅

### 포트 충돌
```bash
# 포트 사용 확인
lsof -i :5001

# 프로세스 종료
kill -9 <PID>
```

### 메모리 부족
```bash
# Node.js 메모리 제한 증가
node --max-old-space-size=4096 server.js
```

### 크롤러 타임아웃
```bash
# 타임아웃 값 증가 (.env)
CRAWLER_TIMEOUT=60000
```

---

## 보안 설정

### 1. HTTPS 설정
```javascript
// server.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem')
};

https.createServer(options, app).listen(443);
```

### 2. CORS 설정
```javascript
// server.js
const cors = require('cors');
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### 3. 환경 변수 보호
```bash
# .env 파일 권한 설정
chmod 600 .env

# .env를 Git에서 제외 (이미 .gitignore에 설정됨)
```

---

## 지속적 배포 (CI/CD)

### GitHub Actions 예제
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '22'
      - run: npm install
      - run: npm run build
      - run: npm test
      - name: Deploy
        run: |
          npm run build
          # 배포 스크립트 실행
```

---

## 지원 및 문의

문제가 발생하면 다음을 확인하세요:
1. 로그 파일 확인
2. 환경 변수 설정 확인
3. 의존성 버전 확인
4. 포트 충돌 확인

**문의**: support@coda.app

---

**마지막 업데이트:** 2026년 6월 11일
