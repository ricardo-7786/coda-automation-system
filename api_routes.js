const express = require('express');
const db = require('./db');
const router = express.Router();

// ==================== 학원 관련 API ====================

// 학원 추가
router.post('/academies', (req, res) => {
  try {
    const result = db.addAcademy(req.body);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 학원 목록 조회
router.get('/academies', (req, res) => {
  try {
    const region = req.query.region;
    const academies = db.getAcademies(region);
    res.json(academies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 학원 상세 조회
router.get('/academies/:id', (req, res) => {
  try {
    const academy = db.getAcademyById(req.params.id);
    if (!academy) {
      return res.status(404).json({ error: '학원을 찾을 수 없습니다' });
    }
    
    academy.contact_history = db.getContactHistory(academy.id);
    academy.contracts = db.getContracts(academy.id);
    academy.email_logs = db.getEmailLogs(academy.id);
    academy.sns_activity = db.getSnsActivity(academy.id);
    
    res.json(academy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 학원 상태 업데이트
router.patch('/academies/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    db.updateAcademyStatus(req.params.id, status);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 연락 이력 관련 API ====================

// 연락 이력 추가
router.post('/contact-history', (req, res) => {
  try {
    const result = db.addContactHistory(req.body);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 연락 이력 조회
router.get('/contact-history/:academy_id', (req, res) => {
  try {
    const history = db.getContactHistory(req.params.academy_id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 응답 기록
router.post('/contact-history/:id/response', (req, res) => {
  try {
    const { response_content } = req.body;
    db.recordResponse(req.params.id, response_content);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 계약 관련 API ====================

// 계약 추가
router.post('/contracts', (req, res) => {
  try {
    const result = db.addContract(req.body);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 계약 목록 조회
router.get('/contracts', (req, res) => {
  try {
    const academy_id = req.query.academy_id;
    const contracts = db.getContracts(academy_id);
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 계약 상태 업데이트
router.patch('/contracts/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    db.updateContractStatus(req.params.id, status);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 이메일 로그 관련 API ====================

// 이메일 로그 추가
router.post('/email-logs', (req, res) => {
  try {
    const result = db.addEmailLog(req.body);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 이메일 로그 조회
router.get('/email-logs/:academy_id', (req, res) => {
  try {
    const logs = db.getEmailLogs(req.params.academy_id);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 이메일 오픈 기록
router.post('/email-logs/:id/open', (req, res) => {
  try {
    db.recordEmailOpen(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SNS 활동 관련 API ====================

// SNS 활동 추가
router.post('/sns-activity', (req, res) => {
  try {
    const result = db.addSnsActivity(req.body);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SNS 활동 조회
router.get('/sns-activity/:academy_id', (req, res) => {
  try {
    const activity = db.getSnsActivity(req.params.academy_id);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 결제 일정 관련 API ====================

// 결제 일정 추가
router.post('/payment-schedule', (req, res) => {
  try {
    const result = db.addPaymentSchedule(req.body);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 결제 일정 조회
router.get('/payment-schedule/:contract_id', (req, res) => {
  try {
    const schedule = db.getPaymentSchedule(req.params.contract_id);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 분석 관련 API ====================

// 통계 조회
router.get('/statistics/:region', (req, res) => {
  try {
    const stats = db.getStatistics(req.params.region);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 리포트 관련 API ====================

// 리포트 생성
router.post('/reports', (req, res) => {
  try {
    const result = db.generateReport(req.body);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 리포트 조회
router.get('/reports', (req, res) => {
  try {
    const region = req.query.region;
    const report_type = req.query.type;
    const reports = db.getReports(region, report_type);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== 데이터 내보내기 API ====================

// JSON 형식으로 내보내기
router.get('/export/:region/json', (req, res) => {
  try {
    const data = db.exportToJSON(req.params.region);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CSV 형식으로 내보내기
router.get('/export/:region/csv', (req, res) => {
  try {
    const academies = db.getAcademies(req.params.region);
    
    // CSV 헤더
    const headers = ['ID', '학원명', '주소', '전화', '이메일', '상태', '생성일'];
    const rows = academies.map(a => [
      a.id,
      a.name,
      a.address,
      a.phone,
      a.email,
      a.status,
      a.created_at
    ]);
    
    // CSV 생성
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="academies_${req.params.region}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
