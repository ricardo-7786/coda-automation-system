/**
 * CODA 웹 애플리케이션 통합 테스트
 * 모든 API 엔드포인트 및 기능 테스트
 */

const http = require('http');

const BASE_URL = 'http://localhost:5001';

// 테스트 헬퍼 함수
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// 테스트 실행
async function runTests() {
  console.log('🧪 CODA 웹 애플리케이션 통합 테스트 시작\n');

  let passedTests = 0;
  let failedTests = 0;

  // 테스트 1: 지역 목록 조회
  try {
    console.log('📍 테스트 1: 지역 목록 조회');
    const result = await makeRequest('GET', '/api/regions');
    if (result.status === 200 && Array.isArray(result.data)) {
      console.log('✓ 통과: 지역 목록 조회 성공');
      console.log(`  - 지역 수: ${result.data.length}\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 지역 목록 조회 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 2: 특정 지역 데이터 조회
  try {
    console.log('📍 테스트 2: 특정 지역 데이터 조회');
    const result = await makeRequest('GET', '/api/region/gangnam');
    if (result.status === 200 && result.data.academies) {
      console.log('✓ 통과: 강남권 데이터 조회 성공');
      console.log(`  - 학원 수: ${result.data.academies.length}\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 강남권 데이터 조회 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 3: 아웃리치 계획 생성
  try {
    console.log('📍 테스트 3: 아웃리치 계획 생성');
    const result = await makeRequest('POST', '/api/outreach/gangnam');
    if (result.status === 200 && result.data.status === 'success') {
      console.log('✓ 통과: 아웃리치 계획 생성 성공');
      console.log(`  - 총 학원: ${result.data.total_academies}`);
      console.log(`  - 응답률: ${result.data.response_rate}`);
      console.log(`  - 계약률: ${result.data.contract_rate}\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 아웃리치 계획 생성 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 4: 학원 추가
  try {
    console.log('📍 테스트 4: 학원 추가');
    const newAcademy = {
      name: '테스트 음악학원',
      address: '서울 강남구 테스트로 123',
      phone: '02-1234-5678',
      email: 'test@example.com',
      region: 'gangnam'
    };
    const result = await makeRequest('POST', '/api/academies', newAcademy);
    if (result.status === 200 && result.data.success) {
      console.log('✓ 통과: 학원 추가 성공');
      console.log(`  - 학원 ID: ${result.data.id}\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 학원 추가 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 5: 학원 목록 조회
  try {
    console.log('📍 테스트 5: 학원 목록 조회');
    const result = await makeRequest('GET', '/api/academies?region=gangnam');
    if (result.status === 200 && Array.isArray(result.data)) {
      console.log('✓ 통과: 학원 목록 조회 성공');
      console.log(`  - 학원 수: ${result.data.length}\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 학원 목록 조회 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 6: 연락 이력 추가
  try {
    console.log('📍 테스트 6: 연락 이력 추가');
    const contactData = {
      academy_id: 1,
      contact_type: 'email',
      contact_date: new Date().toISOString(),
      stage: 1,
      message: '테스트 연락 메시지'
    };
    const result = await makeRequest('POST', '/api/contact-history', contactData);
    if (result.status === 200 && result.data.success) {
      console.log('✓ 통과: 연락 이력 추가 성공');
      console.log(`  - 이력 ID: ${result.data.id}\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 연락 이력 추가 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 7: 계약 추가
  try {
    console.log('📍 테스트 7: 계약 추가');
    const contractData = {
      academy_id: 1,
      contract_date: new Date().toISOString(),
      contract_value: 500,
      start_date: '2026-06-01',
      end_date: '2027-06-01',
      terms: '월 50만원'
    };
    const result = await makeRequest('POST', '/api/contracts', contractData);
    if (result.status === 200 && result.data.success) {
      console.log('✓ 통과: 계약 추가 성공');
      console.log(`  - 계약 ID: ${result.data.id}\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 계약 추가 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 8: 이메일 로그 추가
  try {
    console.log('📍 테스트 8: 이메일 로그 추가');
    const emailData = {
      academy_id: 1,
      recipient_email: 'test@example.com',
      subject: '테스트 이메일',
      body: '테스트 이메일 본문',
      email_type: 'introduction'
    };
    const result = await makeRequest('POST', '/api/email-logs', emailData);
    if (result.status === 200 && result.data.success) {
      console.log('✓ 통과: 이메일 로그 추가 성공');
      console.log(`  - 이메일 ID: ${result.data.id}\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 이메일 로그 추가 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 9: 통계 조회
  try {
    console.log('📍 테스트 9: 통계 조회');
    const result = await makeRequest('GET', '/api/statistics/gangnam');
    if (result.status === 200 && result.data.total_academies !== undefined) {
      console.log('✓ 통과: 통계 조회 성공');
      console.log(`  - 총 학원: ${result.data.total_academies}`);
      console.log(`  - 응답률: ${result.data.response_rate}%\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 통계 조회 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 10: 리포트 생성
  try {
    console.log('📍 테스트 10: 리포트 생성');
    const reportData = {
      report_type: 'weekly',
      region: 'gangnam',
      report_date: new Date().toISOString().split('T')[0],
      total_academies: 10,
      contacted_count: 5,
      responded_count: 3,
      contracted_count: 1,
      response_rate: 50,
      contract_rate: 10,
      total_revenue: 500,
      report_data: { test: true }
    };
    const result = await makeRequest('POST', '/api/reports', reportData);
    if (result.status === 200 && result.data.success) {
      console.log('✓ 통과: 리포트 생성 성공');
      console.log(`  - 리포트 ID: ${result.data.id}\n`);
      passedTests++;
    } else {
      console.log('✗ 실패: 리포트 생성 실패\n');
      failedTests++;
    }
  } catch (error) {
    console.log(`✗ 오류: ${error.message}\n`);
    failedTests++;
  }

  // 테스트 결과 요약
  console.log('═══════════════════════════════════════');
  console.log('📊 테스트 결과 요약');
  console.log('═══════════════════════════════════════');
  console.log(`✓ 통과: ${passedTests}개`);
  console.log(`✗ 실패: ${failedTests}개`);
  console.log(`📈 성공률: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  console.log('═══════════════════════════════════════\n');

  if (failedTests === 0) {
    console.log('🎉 모든 테스트를 통과했습니다!');
  } else {
    console.log('⚠️ 일부 테스트가 실패했습니다.');
  }
}

// 테스트 실행
runTests().catch(console.error);
