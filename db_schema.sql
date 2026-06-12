-- CODA 파트너 아카데미 CRM 데이터베이스 스키마

-- 1. 학원 테이블
CREATE TABLE IF NOT EXISTS academies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT,
  road_address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  region TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  status TEXT DEFAULT 'new', -- new, contacted, responded, negotiating, contracted, rejected
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 연락 이력 테이블
CREATE TABLE IF NOT EXISTS contact_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  academy_id INTEGER NOT NULL,
  contact_type TEXT NOT NULL, -- email, phone, meeting, sms
  contact_date DATETIME NOT NULL,
  stage INTEGER, -- 1, 2, 3 (아웃리치 단계)
  message TEXT,
  response_received BOOLEAN DEFAULT 0,
  response_date DATETIME,
  response_content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (academy_id) REFERENCES academies(id)
);

-- 3. 계약 정보 테이블
CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  academy_id INTEGER NOT NULL,
  contract_date DATETIME,
  contract_value REAL,
  contract_status TEXT DEFAULT 'pending', -- pending, signed, active, expired, cancelled
  start_date DATE,
  end_date DATE,
  terms TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (academy_id) REFERENCES academies(id)
);

-- 4. SNS 활동 테이블
CREATE TABLE IF NOT EXISTS sns_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  academy_id INTEGER,
  platform TEXT, -- instagram, facebook, youtube, tiktok
  activity_type TEXT, -- post, comment, like, share
  activity_date DATETIME,
  content TEXT,
  engagement_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. 이메일 로그 테이블
CREATE TABLE IF NOT EXISTS email_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  academy_id INTEGER NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  email_type TEXT, -- introduction, followup, proposal, contract
  sent_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  opened BOOLEAN DEFAULT 0,
  opened_date DATETIME,
  clicked BOOLEAN DEFAULT 0,
  clicked_date DATETIME,
  bounced BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (academy_id) REFERENCES academies(id)
);

-- 6. 결제 일정 테이블
CREATE TABLE IF NOT EXISTS payment_schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_id INTEGER NOT NULL,
  payment_date DATE,
  amount REAL,
  payment_status TEXT DEFAULT 'pending', -- pending, completed, overdue, cancelled
  payment_method TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

-- 7. 응답 분석 테이블
CREATE TABLE IF NOT EXISTS response_analysis (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region TEXT NOT NULL,
  stage INTEGER, -- 1, 2, 3
  total_contacted INTEGER DEFAULT 0,
  total_responded INTEGER DEFAULT 0,
  response_rate REAL DEFAULT 0,
  analysis_date DATE DEFAULT CURRENT_DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. 리포트 테이블
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_type TEXT, -- weekly, monthly, quarterly
  region TEXT,
  report_date DATE,
  total_academies INTEGER,
  contacted_count INTEGER,
  responded_count INTEGER,
  contracted_count INTEGER,
  response_rate REAL,
  contract_rate REAL,
  total_revenue REAL,
  report_data JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. 사용자 활동 로그 테이블
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT,
  target_type TEXT, -- academy, contract, email, report
  target_id INTEGER,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_academies_region ON academies(region);
CREATE INDEX IF NOT EXISTS idx_academies_status ON academies(status);
CREATE INDEX IF NOT EXISTS idx_contact_history_academy ON contact_history(academy_id);
CREATE INDEX IF NOT EXISTS idx_contact_history_date ON contact_history(contact_date);
CREATE INDEX IF NOT EXISTS idx_contracts_academy ON contracts(academy_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(contract_status);
CREATE INDEX IF NOT EXISTS idx_email_logs_academy ON email_logs(academy_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_date ON email_logs(sent_date);
CREATE INDEX IF NOT EXISTS idx_sns_activity_academy ON sns_activity(academy_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedule_contract ON payment_schedule(contract_id);
CREATE INDEX IF NOT EXISTS idx_reports_date ON reports(report_date);
