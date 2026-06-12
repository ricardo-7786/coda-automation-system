const fs = require('fs');
const path = require('path');

// 캐시 디렉토리
const CACHE_DIR = path.join(__dirname, '.cache');

// 캐시 초기화
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// 기본 학원 데이터 (실제 크롤링 결과를 시뮬레이션)
const DEFAULT_ACADEMIES = {
  gangnam: [
    { 
      name: '남주희실용음악학원 강남점', 
      address: '서울 강남구 선릉로 86길 15', 
      roadAddress: '서울 강남구 강남구 선릉로 86길 15',
      phone: '02-6959-8899', 
      email: 'info@namjuhee.com',
      url: 'https://namjuhee.com',
      region: '강남'
    },
    { 
      name: '서초실용음악학원', 
      address: '서울 서초구 서초동 1337-10', 
      roadAddress: '서울 서초구 강남대로 23길 64',
      phone: '02-3486-1234', 
      email: 'info@seocho.com',
      url: 'https://seocho.com',
      region: '서초'
    },
    { 
      name: '온뮤직 강남본점', 
      address: '서울 서초구 강남대로 23길 64', 
      roadAddress: '서울 서초구 강남대로 23길 64',
      phone: '02-575-2015', 
      email: 'info@onmusic.com',
      url: 'https://onmusic.com',
      region: '서초'
    },
    { 
      name: '보컬프렌즈실용음악학원', 
      address: '서울 강남구 논현동 241-14', 
      roadAddress: '서울 강남구 논현로 169',
      phone: '010-2410-4600', 
      email: 'info@vocalfriends.com',
      url: 'https://vocalfriends.com',
      region: '강남'
    },
    { 
      name: 'DEF MUSIC ACADEMY', 
      address: '서울 강남구 압구정로 54길 14', 
      roadAddress: '서울 강남구 압구정로 54길 14',
      phone: '02-3445-3231', 
      email: 'info@defmusic.com',
      url: 'https://defmusic.com',
      region: '강남'
    },
    { 
      name: '비뉴베 강남', 
      address: '서울 강남구 테헤란로 152', 
      roadAddress: '서울 강남구 테헤란로 152',
      phone: '02-529-1234', 
      email: 'info@benuebe.com',
      url: 'https://benuebe.com',
      region: '강남'
    },
    { 
      name: 'SMS서울실용음악학원', 
      address: '서울 강남구 강남대로 364', 
      roadAddress: '서울 강남구 강남대로 364',
      phone: '02-511-5678', 
      email: 'info@smsmusic.com',
      url: 'https://smsmusic.com',
      region: '강남'
    },
    { 
      name: '모어댄스뮤직', 
      address: '서울 송파구 문정로', 
      roadAddress: '서울 송파구 문정로 20',
      phone: '02-401-0620', 
      email: 'info@moredance.com',
      url: 'https://moredance.com',
      region: '송파'
    },
    { 
      name: '서울현대음악학원', 
      address: '서울 강남구 압구정로 54길 14', 
      roadAddress: '서울 강남구 압구정로 54길 14',
      phone: '02-3445-3231', 
      email: 'info@modernmusic.com',
      url: 'https://modernmusic.com',
      region: '강남'
    }
  ],
  busan: [
    { 
      name: '부산실용음악학원', 
      address: '부산 해운대구 센텀시티', 
      roadAddress: '부산 해운대구 센텀시티',
      phone: '051-1234-5678', 
      email: 'info@busan.com',
      url: 'https://busanmusic.com',
      region: '해운대'
    },
    { 
      name: '해운대음악학원', 
      address: '부산 해운대구 우동', 
      roadAddress: '부산 해운대구 우동',
      phone: '051-2345-6789', 
      email: 'info@haeundae.com',
      url: 'https://haeundaemusic.com',
      region: '해운대'
    },
    { 
      name: '금정음악학원', 
      address: '부산 금정구 부곡', 
      roadAddress: '부산 금정구 부곡',
      phone: '051-3456-7890', 
      email: 'info@geumjeong.com',
      url: 'https://geumjeongmusic.com',
      region: '금정'
    }
  ],
  daegu: [
    { 
      name: '대구실용음악학원', 
      address: '대구 중구 동성로', 
      roadAddress: '대구 중구 동성로',
      phone: '053-1234-5678', 
      email: 'info@daegu.com',
      url: 'https://daegumusic.com',
      region: '중구'
    },
    { 
      name: '수성음악학원', 
      address: '대구 수성구 범어', 
      roadAddress: '대구 수성구 범어',
      phone: '053-2345-6789', 
      email: 'info@suseong.com',
      url: 'https://suseongmusic.com',
      region: '수성'
    },
    { 
      name: '달서음악학원', 
      address: '대구 달서구 성서', 
      roadAddress: '대구 달서구 성서',
      phone: '053-3456-7890', 
      email: 'info@dalseo.com',
      url: 'https://dalseomusic.com',
      region: '달서'
    }
  ]
};

// 캐시 읽기
function getCache(region) {
  const cacheFile = path.join(CACHE_DIR, `${region}.json`);
  
  try {
    if (fs.existsSync(cacheFile)) {
      const data = fs.readFileSync(cacheFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`캐시 읽기 오류 (${region}):`, error.message);
  }
  
  return null;
}

// 캐시 저장
function setCache(region, data) {
  const cacheFile = path.join(CACHE_DIR, `${region}.json`);
  
  try {
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ 캐시 저장: ${region}`);
  } catch (error) {
    console.error(`캐시 저장 오류 (${region}):`, error.message);
  }
}

// 지역 데이터 조회 (캐시 또는 기본값)
function getRegionData(region) {
  // 먼저 캐시 확인
  let cachedData = getCache(region);
  if (cachedData) {
    return cachedData;
  }
  
  // 캐시 없으면 기본값 사용
  const academies = DEFAULT_ACADEMIES[region] || [];
  
  const regionNames = {
    gangnam: '강남권',
    busan: '부산권',
    daegu: '대구권',
    daejeon: '대전권',
    gwangju: '광주권',
    incheon: '인천권'
  };
  
  const data = {
    region: regionNames[region] || region,
    total_academies: academies.length,
    academies: academies,
    cached: false,
    timestamp: new Date().toISOString()
  };
  
  // 기본값을 캐시에 저장
  setCache(region, data);
  
  return data;
}

module.exports = {
  getRegionData,
  getCache,
  setCache
};
