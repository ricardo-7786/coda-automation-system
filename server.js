const express = require('express');
const cors = require('cors');
const path = require('path');
const { getRegionData } = require('./crawler_cache');
const db = require('./db');
const apiRoutes = require('./api_routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 지역별 학원 데이터 (폴백용)
const academiesData = {
  gangnam: {
    region: '강남권',
    academies: [
      { name: '남주희실용음악학원 강남점', address: '서울 강남구 선릉로 86길 15', phone: '02-6959-8899', email: 'info@namjuhee.com' },
      { name: '서초실용음악학원', address: '서울 서초구 서초동 1337-10', phone: '02-3486-1234', email: 'info@seocho.com' },
      { name: '온뮤직 강남본점', address: '서울 서초구 강남대로 23길 64', phone: '02-575-2015', email: 'info@onmusic.com' },
      { name: '보컬프렌즈실용음악학원', address: '서울 강남구 논현동 241-14', phone: '010-2410-4600', email: 'info@vocalfriends.com' },
      { name: 'DEF MUSIC ACADEMY', address: '서울 강남구 압구정로 54길 14', phone: '02-3445-3231', email: 'info@defmusic.com' },
      { name: '비뉴베 강남', address: '서울 강남구 테헤란로 152', phone: '02-529-1234', email: 'info@benuebe.com' },
      { name: 'SMS서울실용음악학원', address: '서울 강남구 강남대로 364', phone: '02-511-5678', email: 'info@smsmusic.com' },
      { name: '모어댄스뮤직', address: '서울 송파구 문정로', phone: '02-401-0620', email: 'info@moredance.com' },
      { name: '서울현대음악학원', address: '서울 강남구 압구정로 54길 14', phone: '02-3445-3231', email: 'info@modernmusic.com' }
    ]
  },
  busan: {
    region: '부산권',
    academies: [
      { name: '부산실용음악학원', address: '부산 해운대구 센텀시티', phone: '051-1234-5678', email: 'info@busan.com' },
      { name: '해운대음악학원', address: '부산 해운대구 우동', phone: '051-2345-6789', email: 'info@haeundae.com' },
      { name: '금정음악학원', address: '부산 금정구 부곡', phone: '051-3456-7890', email: 'info@geumjeong.com' }
    ]
  },
  daegu: {
    region: '대구권',
    academies: [
      { name: '대구실용음악학원', address: '대구 중구 동성로', phone: '053-1234-5678', email: 'info@daegu.com' },
      { name: '수성음악학원', address: '대구 수성구 범어', phone: '053-2345-6789', email: 'info@suseong.com' },
      { name: '달서음악학원', address: '대구 달서구 성서', phone: '053-3456-7890', email: 'info@dalseo.com' }
    ]
  },
  daejeon: {
    region: '대전권',
    academies: [
      { name: '대전실용음악학원', address: '대전 중구 중앙로', phone: '042-1234-5678', email: 'info@daejeon.com' },
      { name: '유성음악학원', address: '대전 유성구 봉명', phone: '042-2345-6789', email: 'info@yuseong.com' }
    ]
  },
  gwangju: {
    region: '광주권',
    academies: [
      { name: '광주실용음악학원', address: '광주 동구 충장로', phone: '062-1234-5678', email: 'info@gwangju.com' },
      { name: '남구음악학원', address: '광주 남구 봉선', phone: '062-2345-6789', email: 'info@namgu.com' }
    ]
  },
  incheon: {
    region: '인천권',
    academies: [
      { name: '인천실용음악학원', address: '인천 중구 신포로', phone: '032-1234-5678', email: 'info@incheon.com' },
      { name: '남동음악학원', address: '인천 남동구 만수', phone: '032-2345-6789', email: 'info@namdong.com' }
    ]
  }
};

// API: 지역 데이터 조회 (캐시 시스템)
app.get('/api/region/:region', (req, res) => {
  const region = req.params.region;
  
  try {
    // 캐시에서 데이터 조회
    const data = getRegionData(region);
    
    if (!data.academies || data.academies.length === 0) {
      return res.status(404).json({ error: '지역을 찾을 수 없습니다.' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('지역 데이터 조회 오류:', error.message);
    res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
  }
});

// API: 아웃리치 계획 생성
app.post('/api/outreach/:region', (req, res) => {
  const region = req.params.region;
  const data = academiesData[region];
  
  if (!data) {
    return res.status(404).json({ error: '지역을 찾을 수 없습니다.' });
  }
  
  const total = data.academies.length;
  const stage1_sent = total;
  const responses = Math.floor(total * 0.5);
  const stage2_sent = responses;
  const stage3_sent = Math.floor(total * 0.3);
  const contracts = Math.floor(stage3_sent * 0.5);
  const monthly_revenue = contracts * 100 + contracts * 50 * 10;
  
  res.json({
    status: 'success',
    region: data.region,
    total_academies: total,
    stage1_sent,
    stage2_sent,
    stage3_sent,
    responses,
    contracts,
    response_rate: `${Math.round((responses / total) * 100)}%`,
    contract_rate: `${Math.round((contracts / total) * 100)}%`,
    monthly_revenue: `${monthly_revenue}만 원`,
    annual_revenue: `${monthly_revenue * 12}만 원`
  });
});

// API: 모든 지역 목록
app.get('/api/regions', (req, res) => {
  const regions = Object.keys(academiesData).map(key => ({
    id: key,
    name: academiesData[key].region,
    count: academiesData[key].academies.length
  }));
  
  res.json(regions);
});

// CRM API 라우트 등록
app.use('/api', apiRoutes);

// 서버 시작
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🎤 CODA 웹 애플리케이션 서버 시작`);
  console.log(`📍 서버 주소: http://localhost:${PORT}`);
  console.log(`🔗 프론트엔드: http://localhost:3002`);
  console.log(`💾 캐시 시스템: 활성화`);
  console.log(`💬 CRM API: 활성화`);
});

// 그레이스풀 종료 처리
process.on('SIGTERM', () => {
  console.log('🛑 서버 종료 중...');
  server.close(() => {
    db.close();
    process.exit(0);
  });
});
