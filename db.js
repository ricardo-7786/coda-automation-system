const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// 데이터베이스 파일 경로
const DB_PATH = path.join(__dirname, 'coda.db');

// 데이터베이스 초기화
class CodaDatabase {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    try {
      this.db = new Database(DB_PATH);
      this.db.pragma('journal_mode = WAL');
      this.createTables();
      console.log('✅ 데이터베이스 초기화 완료');
    } catch (error) {
      console.error('❌ 데이터베이스 초기화 실패:', error.message);
    }
  }

  createTables() {
    const schema = fs.readFileSync(path.join(__dirname, 'db_schema.sql'), 'utf-8');
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    statements.forEach(stmt => {
      try {
        this.db.exec(stmt);
      } catch (error) {
        console.warn('테이블 생성 경고:', error.message);
      }
    });
  }

  // 학원 관련 메서드
  addAcademy(data) {
    const stmt = this.db.prepare(`
      INSERT INTO academies (name, address, road_address, phone, email, website, region, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      data.name,
      data.address,
      data.road_address,
      data.phone,
      data.email,
      data.website,
      data.region,
      data.latitude,
      data.longitude
    );
  }

  getAcademies(region = null) {
    let query = 'SELECT * FROM academies';
    if (region) {
      query += ` WHERE region = '${region}'`;
    }
    return this.db.prepare(query).all();
  }

  getAcademyById(id) {
    return this.db.prepare('SELECT * FROM academies WHERE id = ?').get(id);
  }

  updateAcademyStatus(id, status) {
    return this.db.prepare(
      'UPDATE academies SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(status, id);
  }

  // 연락 이력 관련 메서드
  addContactHistory(data) {
    const stmt = this.db.prepare(`
      INSERT INTO contact_history (academy_id, contact_type, contact_date, stage, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      data.academy_id,
      data.contact_type,
      data.contact_date,
      data.stage,
      data.message
    );
  }

  getContactHistory(academy_id) {
    return this.db.prepare(
      'SELECT * FROM contact_history WHERE academy_id = ? ORDER BY contact_date DESC'
    ).all(academy_id);
  }

  recordResponse(id, response_content) {
    return this.db.prepare(
      'UPDATE contact_history SET response_received = 1, response_date = CURRENT_TIMESTAMP, response_content = ? WHERE id = ?'
    ).run(response_content, id);
  }

  // 계약 관련 메서드
  addContract(data) {
    const stmt = this.db.prepare(`
      INSERT INTO contracts (academy_id, contract_date, contract_value, start_date, end_date, terms, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      data.academy_id,
      data.contract_date,
      data.contract_value,
      data.start_date,
      data.end_date,
      data.terms,
      data.notes
    );
  }

  getContracts(academy_id = null) {
    let query = 'SELECT * FROM contracts';
    if (academy_id) {
      query += ` WHERE academy_id = ${academy_id}`;
    }
    return this.db.prepare(query).all();
  }

  updateContractStatus(id, status) {
    return this.db.prepare(
      'UPDATE contracts SET contract_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(status, id);
  }

  // 이메일 로그 관련 메서드
  addEmailLog(data) {
    const stmt = this.db.prepare(`
      INSERT INTO email_logs (academy_id, recipient_email, subject, body, email_type)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      data.academy_id,
      data.recipient_email,
      data.subject,
      data.body,
      data.email_type
    );
  }

  getEmailLogs(academy_id) {
    return this.db.prepare(
      'SELECT * FROM email_logs WHERE academy_id = ? ORDER BY sent_date DESC'
    ).all(academy_id);
  }

  recordEmailOpen(id) {
    return this.db.prepare(
      'UPDATE email_logs SET opened = 1, opened_date = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(id);
  }

  // SNS 활동 관련 메서드
  addSnsActivity(data) {
    const stmt = this.db.prepare(`
      INSERT INTO sns_activity (academy_id, platform, activity_type, activity_date, content, engagement_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      data.academy_id,
      data.platform,
      data.activity_type,
      data.activity_date,
      data.content,
      data.engagement_count || 0
    );
  }

  getSnsActivity(academy_id) {
    return this.db.prepare(
      'SELECT * FROM sns_activity WHERE academy_id = ? ORDER BY activity_date DESC'
    ).all(academy_id);
  }

  // 결제 일정 관련 메서드
  addPaymentSchedule(data) {
    const stmt = this.db.prepare(`
      INSERT INTO payment_schedule (contract_id, payment_date, amount, payment_method, notes)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      data.contract_id,
      data.payment_date,
      data.amount,
      data.payment_method,
      data.notes
    );
  }

  getPaymentSchedule(contract_id) {
    return this.db.prepare(
      'SELECT * FROM payment_schedule WHERE contract_id = ? ORDER BY payment_date ASC'
    ).all(contract_id);
  }

  // 분석 관련 메서드
  getResponseAnalysis(region, stage) {
    return this.db.prepare(
      'SELECT * FROM response_analysis WHERE region = ? AND stage = ?'
    ).get(region, stage);
  }

  updateResponseAnalysis(region, stage, data) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO response_analysis (region, stage, total_contacted, total_responded, response_rate, analysis_date)
      VALUES (?, ?, ?, ?, ?, CURRENT_DATE)
    `);
    
    return stmt.run(region, stage, data.total_contacted, data.total_responded, data.response_rate);
  }

  // 리포트 관련 메서드
  generateReport(data) {
    const stmt = this.db.prepare(`
      INSERT INTO reports (report_type, region, report_date, total_academies, contacted_count, responded_count, 
                          contracted_count, response_rate, contract_rate, total_revenue, report_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      data.report_type,
      data.region,
      data.report_date,
      data.total_academies,
      data.contacted_count,
      data.responded_count,
      data.contracted_count,
      data.response_rate,
      data.contract_rate,
      data.total_revenue,
      JSON.stringify(data.report_data)
    );
  }

  getReports(region = null, report_type = null) {
    let query = 'SELECT * FROM reports WHERE 1=1';
    if (region) query += ` AND region = '${region}'`;
    if (report_type) query += ` AND report_type = '${report_type}'`;
    query += ' ORDER BY report_date DESC';
    
    return this.db.prepare(query).all();
  }

  // 통계 관련 메서드
  getStatistics(region) {
    const total = this.db.prepare(
      'SELECT COUNT(*) as count FROM academies WHERE region = ?'
    ).get(region);

    const contacted = this.db.prepare(
      'SELECT COUNT(DISTINCT academy_id) as count FROM contact_history WHERE academy_id IN (SELECT id FROM academies WHERE region = ?)'
    ).get(region);

    const responded = this.db.prepare(
      'SELECT COUNT(DISTINCT academy_id) as count FROM contact_history WHERE response_received = 1 AND academy_id IN (SELECT id FROM academies WHERE region = ?)'
    ).get(region);

    const contracted = this.db.prepare(
      'SELECT COUNT(*) as count FROM contracts WHERE contract_status = "signed" AND academy_id IN (SELECT id FROM academies WHERE region = ?)'
    ).get(region);

    return {
      total_academies: total.count,
      contacted_count: contacted.count,
      responded_count: responded.count,
      contracted_count: contracted.count,
      response_rate: total.count > 0 ? (responded.count / total.count * 100).toFixed(2) : 0,
      contract_rate: total.count > 0 ? (contracted.count / total.count * 100).toFixed(2) : 0
    };
  }

  // 데이터 내보내기
  exportToJSON(region) {
    const academies = this.getAcademies(region);
    const data = {
      region,
      export_date: new Date().toISOString(),
      academies: academies.map(academy => ({
        ...academy,
        contact_history: this.getContactHistory(academy.id),
        contracts: this.getContracts(academy.id),
        email_logs: this.getEmailLogs(academy.id),
        sns_activity: this.getSnsActivity(academy.id)
      }))
    };
    return data;
  }

  // 데이터베이스 종료
  close() {
    if (this.db) {
      this.db.close();
      console.log('✅ 데이터베이스 연결 종료');
    }
  }
}

module.exports = new CodaDatabase();
