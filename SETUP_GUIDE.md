# 🖥️ 로컬 설정 가이드 (Mac/Linux/Windows)

이 가이드는 당신의 로컬 머신에서 CODA 자동화 시스템을 설정하고 실행하는 방법을 설명합니다.

---

## 📱 Mac (MacBook Pro) 설정

### 1단계: Homebrew 설치 (이미 설치되어 있으면 건너뛰기)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2단계: Python 3.11+ 설치

```bash
brew install python@3.11
```

### 3단계: Git 저장소 클론

```bash
cd ~/Desktop
git clone https://github.com/YOUR_USERNAME/coda-automation-system.git
cd coda-automation-system
```

### 4단계: 가상 환경 생성

```bash
python3 -m venv venv
source venv/bin/activate
```

### 5단계: 의존성 설치

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 6단계: 스크립트 실행

```bash
# SNS 자동화
python3 coda_sns_automation.py

# 분석 & 리포팅
python3 coda_analytics_reporting.py

# 계약 관리
python3 coda_contract_management.py
```

### 7단계: 웹 대시보드 열기

```bash
open coda_crm_dashboard_v3.html
```

---

## 🐧 Linux (Ubuntu/Debian) 설정

### 1단계: Python 3.11+ 설치

```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip git
```

### 2단계: Git 저장소 클론

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/coda-automation-system.git
cd coda-automation-system
```

### 3단계: 가상 환경 생성

```bash
python3.11 -m venv venv
source venv/bin/activate
```

### 4단계: 의존성 설치

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 5단계: 스크립트 실행

```bash
python3 coda_sns_automation.py
```

### 6단계: 웹 대시보드 열기

```bash
xdg-open coda_crm_dashboard_v3.html
```

---

## 🪟 Windows 설정

### 1단계: Python 3.11+ 설치

1. [python.org](https://www.python.org/downloads/) 방문
2. Python 3.11 이상 다운로드
3. 설치 중 **"Add Python to PATH"** 체크 ✅

### 2단계: Git 설치

1. [git-scm.com](https://git-scm.com/) 방문
2. Git for Windows 다운로드 및 설치

### 3단계: Git 저장소 클론

```cmd
cd Desktop
git clone https://github.com/YOUR_USERNAME/coda-automation-system.git
cd coda-automation-system
```

### 4단계: 가상 환경 생성

```cmd
python -m venv venv
venv\Scripts\activate
```

### 5단계: 의존성 설치

```cmd
pip install --upgrade pip
pip install -r requirements.txt
```

### 6단계: 스크립트 실행

```cmd
python coda_sns_automation.py
```

### 7단계: 웹 대시보드 열기

```cmd
start coda_crm_dashboard_v3.html
```

---

## 🔐 API 키 설정

### SendGrid API Key

1. [SendGrid 대시보드](https://app.sendgrid.com/) 로그인
2. Settings → API Keys → Create API Key
3. `coda_sns_automation.py` 파일에서 다음 부분 수정:

```python
SENDGRID_API_KEY = "SG.your_api_key_here"
```

### Google Sheets API (선택)

1. [Google Cloud Console](https://console.cloud.google.com/) 방문
2. 새 프로젝트 생성
3. Google Sheets API 활성화
4. 서비스 계정 생성
5. JSON 키 다운로드
6. 프로젝트 폴더에 `credentials.json`으로 저장

---

## ✅ 설치 확인

모든 설정이 완료되었는지 확인하려면:

```bash
# 가상 환경 활성화 확인
which python3  # Mac/Linux
where python   # Windows

# 의존성 확인
pip list

# Python 버전 확인
python3 --version
```

---

## 🚀 자동 실행 스케줄 설정 (선택)

### Mac/Linux (Cron)

```bash
crontab -e
```

다음 라인 추가:

```bash
# 매일 오전 9시에 SNS 자동화 실행
0 9 * * * cd /Users/yourname/coda-automation-system && source venv/bin/activate && python3 coda_sns_automation.py

# 매주 월요일 오전 10시에 주간 리포트 생성
0 10 * * 1 cd /Users/yourname/coda-automation-system && source venv/bin/activate && python3 coda_analytics_reporting.py
```

### Windows (Task Scheduler)

1. **작업 스케줄러** 열기
2. **작업 만들기**
3. 트리거 설정 (매일 오전 9시)
4. 작업 설정:
   ```
   프로그램: C:\Users\yourname\coda-automation-system\venv\Scripts\python.exe
   인수: coda_sns_automation.py
   시작 위치: C:\Users\yourname\coda-automation-system
   ```

---

## 🆘 문제 해결

### 문제: "python3: command not found"

**해결책:**
```bash
# Mac
brew install python@3.11

# Linux
sudo apt install python3.11

# Windows: python.org에서 다시 설치 (PATH 확인)
```

### 문제: "ModuleNotFoundError: No module named 'sendgrid'"

**해결책:**
```bash
# 가상 환경 활성화 확인
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows

# 의존성 재설치
pip install -r requirements.txt
```

### 문제: "Permission denied" (Mac/Linux)

**해결책:**
```bash
chmod +x coda_sns_automation.py
python3 coda_sns_automation.py
```

### 문제: 웹 대시보드가 열리지 않음

**해결책:**
```bash
# 파일 경로 확인
ls -la coda_crm_dashboard_v3.html

# 브라우저에서 직접 열기
# Mac: open coda_crm_dashboard_v3.html
# Linux: xdg-open coda_crm_dashboard_v3.html
# Windows: start coda_crm_dashboard_v3.html
```

---

## 📞 추가 지원

문제가 해결되지 않으면:

1. GitHub Issues 확인: https://github.com/YOUR_USERNAME/coda-automation-system/issues
2. 이메일 문의: codapartner@gmail.com
3. 상세 에러 메시지와 함께 이슈 등록

---

**Happy Automation! 🎉**
