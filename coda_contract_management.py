#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
CODA 계약 관리 시스템
계약 정보 관리 및 상태 추적
"""

import json
import csv
from datetime import datetime, timedelta
from typing import List, Dict

class ContractManagement:
    def __init__(self):
        self.contracts = [
            {
                'id': 'CONTRACT_001',
                'academy': '파주 보컬 아카데미',
                'contact_person': '김원장',
                'email': 'info@pajuvocal.com',
                'phone': '031-1234-5678',
                'status': 'negotiating',
                'contract_type': 'annual',
                'contract_value': 5000000,
                'students': 45,
                'start_date': None,
                'end_date': None,
                'negotiation_stage': 'pricing_discussion',
                'notes': '높은 관심, 가격 협상 중',
                'created_date': datetime.now().isoformat(),
                'last_updated': datetime.now().isoformat(),
                'payment_status': 'pending'
            },
            {
                'id': 'CONTRACT_002',
                'academy': '파주 성악학원',
                'contact_person': '이원장',
                'email': 'contact@pajuvoice.com',
                'phone': '031-2345-6789',
                'status': 'interested',
                'contract_type': 'trial',
                'contract_value': 0,
                'students': 32,
                'start_date': None,
                'end_date': (datetime.now() + timedelta(days=14)).isoformat(),
                'negotiation_stage': 'trial_period',
                'notes': '2주 무료 체험 중',
                'created_date': datetime.now().isoformat(),
                'last_updated': datetime.now().isoformat(),
                'payment_status': 'free_trial'
            },
            {
                'id': 'CONTRACT_003',
                'academy': '파주 음악학원',
                'contact_person': '박원장',
                'email': 'director@pajumusic.com',
                'phone': '031-3456-7890',
                'status': 'trial',
                'contract_type': 'monthly',
                'contract_value': 2500000,
                'students': 28,
                'start_date': (datetime.now() - timedelta(days=7)).isoformat(),
                'end_date': (datetime.now() + timedelta(days=7)).isoformat(),
                'negotiation_stage': 'trial_period',
                'notes': '체험 만족도 높음, 계약 가능성 높음',
                'created_date': (datetime.now() - timedelta(days=7)).isoformat(),
                'last_updated': datetime.now().isoformat(),
                'payment_status': 'trial_active'
            }
        ]
        
        self.contract_history = []
        self.payment_schedule = []
    
    def create_contract(self, academy_data: Dict) -> Dict:
        """새로운 계약 생성"""
        contract_id = f"CONTRACT_{len(self.contracts) + 1:03d}"
        
        contract = {
            'id': contract_id,
            'academy': academy_data.get('name'),
            'contact_person': academy_data.get('contact_person'),
            'email': academy_data.get('email'),
            'phone': academy_data.get('phone'),
            'status': 'interested',
            'contract_type': 'annual',
            'contract_value': academy_data.get('contract_value', 0),
            'students': academy_data.get('students', 0),
            'start_date': None,
            'end_date': None,
            'negotiation_stage': 'initial_contact',
            'notes': academy_data.get('notes', ''),
            'created_date': datetime.now().isoformat(),
            'last_updated': datetime.now().isoformat(),
            'payment_status': 'pending'
        }
        
        self.contracts.append(contract)
        return contract
    
    def update_contract_status(self, contract_id: str, new_status: str, notes: str = '') -> Dict:
        """계약 상태 업데이트"""
        for contract in self.contracts:
            if contract['id'] == contract_id:
                old_status = contract['status']
                contract['status'] = new_status
                contract['last_updated'] = datetime.now().isoformat()
                
                if notes:
                    contract['notes'] = notes
                
                # 상태 변경 이력 기록
                history_entry = {
                    'contract_id': contract_id,
                    'academy': contract['academy'],
                    'old_status': old_status,
                    'new_status': new_status,
                    'timestamp': datetime.now().isoformat(),
                    'notes': notes
                }
                self.contract_history.append(history_entry)
                
                return contract
        
        return None
    
    def update_negotiation_stage(self, contract_id: str, stage: str) -> Dict:
        """협상 단계 업데이트"""
        stages = {
            'initial_contact': '초기 접촉',
            'needs_analysis': '필요도 분석',
            'proposal': '제안서 제시',
            'pricing_discussion': '가격 협상',
            'trial_period': '체험 기간',
            'final_negotiation': '최종 협상',
            'contract_ready': '계약 준비',
            'contracted': '계약 완료'
        }
        
        for contract in self.contracts:
            if contract['id'] == contract_id:
                contract['negotiation_stage'] = stage
                contract['last_updated'] = datetime.now().isoformat()
                return contract
        
        return None
    
    def generate_payment_schedule(self, contract_id: str) -> List[Dict]:
        """결제 일정 생성"""
        for contract in self.contracts:
            if contract['id'] == contract_id and contract['status'] == 'contracted':
                contract_value = contract['contract_value']
                contract_type = contract['contract_type']
                
                schedule = []
                
                if contract_type == 'annual':
                    # 연간 계약: 12개월 분할
                    monthly_amount = contract_value // 12
                    for month in range(1, 13):
                        payment_date = datetime.now().replace(day=1) + timedelta(days=30 * (month - 1))
                        schedule.append({
                            'contract_id': contract_id,
                            'academy': contract['academy'],
                            'payment_number': month,
                            'amount': monthly_amount,
                            'due_date': payment_date.isoformat(),
                            'status': 'pending'
                        })
                
                elif contract_type == 'monthly':
                    # 월간 계약: 1개월
                    schedule.append({
                        'contract_id': contract_id,
                        'academy': contract['academy'],
                        'payment_number': 1,
                        'amount': contract_value,
                        'due_date': (datetime.now() + timedelta(days=30)).isoformat(),
                        'status': 'pending'
                    })
                
                self.payment_schedule.extend(schedule)
                return schedule
        
        return []
    
    def get_contract_summary(self) -> Dict:
        """계약 요약 정보"""
        summary = {
            'total_contracts': len(self.contracts),
            'by_status': {
                'negotiating': len([c for c in self.contracts if c['status'] == 'negotiating']),
                'trial': len([c for c in self.contracts if c['status'] == 'trial']),
                'interested': len([c for c in self.contracts if c['status'] == 'interested']),
                'contracted': len([c for c in self.contracts if c['status'] == 'contracted'])
            },
            'total_value': sum(c['contract_value'] for c in self.contracts if c['status'] == 'contracted'),
            'potential_value': sum(c['contract_value'] for c in self.contracts if c['status'] in ['negotiating', 'trial', 'interested']),
            'total_students': sum(c['students'] for c in self.contracts),
            'by_contract_type': {
                'annual': len([c for c in self.contracts if c['contract_type'] == 'annual']),
                'monthly': len([c for c in self.contracts if c['contract_type'] == 'monthly']),
                'trial': len([c for c in self.contracts if c['contract_type'] == 'trial'])
            }
        }
        
        return summary
    
    def run_contract_management(self):
        """계약 관리 실행"""
        print("=" * 60)
        print("📋 CODA 계약 관리 시스템")
        print("=" * 60)
        
        # 1단계: 계약 현황
        print("\n[1단계] 계약 현황")
        print("-" * 60)
        summary = self.get_contract_summary()
        print(f"📊 총 계약: {summary['total_contracts']}개")
        print(f"  • 협상 중: {summary['by_status']['negotiating']}개")
        print(f"  • 체험 중: {summary['by_status']['trial']}개")
        print(f"  • 관심: {summary['by_status']['interested']}개")
        print(f"  • 계약 완료: {summary['by_status']['contracted']}개")
        print(f"\n💰 계약 가치")
        print(f"  • 계약 완료: ₩{summary['total_value']:,}")
        print(f"  • 잠재 가치: ₩{summary['potential_value']:,}")
        print(f"\n👥 총 학생 수: {summary['total_students']}명")
        
        # 2단계: 계약 상세 정보
        print("\n[2단계] 계약 상세 정보")
        print("-" * 60)
        for contract in self.contracts:
            print(f"\n📌 {contract['academy']}")
            print(f"   ID: {contract['id']}")
            print(f"   담당자: {contract['contact_person']}")
            print(f"   상태: {contract['status']}")
            print(f"   협상 단계: {contract['negotiation_stage']}")
            print(f"   계약 유형: {contract['contract_type']}")
            print(f"   계약 금액: ₩{contract['contract_value']:,}")
            print(f"   학생 수: {contract['students']}명")
            print(f"   비고: {contract['notes']}")
        
        # 3단계: 상태 업데이트 시뮬레이션
        print("\n[3단계] 계약 상태 업데이트")
        print("-" * 60)
        
        # 파주 음악학원 계약 완료로 업데이트
        updated = self.update_contract_status(
            'CONTRACT_003',
            'contracted',
            '체험 만족도 높음, 계약 완료'
        )
        if updated:
            print(f"✅ {updated['academy']} 계약 상태 변경: {updated['status']}")
        
        # 파주 성악학원 협상 단계 업데이트
        updated = self.update_negotiation_stage('CONTRACT_002', 'proposal')
        if updated:
            print(f"✅ {updated['academy']} 협상 단계 변경: {updated['negotiation_stage']}")
        
        # 4단계: 결제 일정 생성
        print("\n[4단계] 결제 일정 생성")
        print("-" * 60)
        payment_schedule = self.generate_payment_schedule('CONTRACT_003')
        if payment_schedule:
            print(f"✅ {payment_schedule[0]['academy']} 결제 일정 생성")
            print(f"   계약 유형: 월간")
            print(f"   결제 금액: ₩{payment_schedule[0]['amount']:,}")
            print(f"   결제 예정일: {payment_schedule[0]['due_date'][:10]}")
        
        # 5단계: 데이터 저장
        print("\n[5단계] 계약 데이터 저장")
        print("-" * 60)
        
        # 계약 정보 저장
        contracts_file = '/home/ubuntu/coda_contracts.json'
        with open(contracts_file, 'w', encoding='utf-8') as f:
            json.dump(self.contracts, f, ensure_ascii=False, indent=2)
        print(f"✅ 계약 정보 저장: {contracts_file}")
        
        # 계약 요약 저장
        summary_file = '/home/ubuntu/coda_contract_summary.json'
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
        print(f"✅ 계약 요약 저장: {summary_file}")
        
        # 계약 이력 저장
        history_file = '/home/ubuntu/coda_contract_history.json'
        with open(history_file, 'w', encoding='utf-8') as f:
            json.dump(self.contract_history, f, ensure_ascii=False, indent=2)
        print(f"✅ 계약 이력 저장: {history_file}")
        
        # 결제 일정 저장
        payment_file = '/home/ubuntu/coda_payment_schedule.json'
        with open(payment_file, 'w', encoding='utf-8') as f:
            json.dump(self.payment_schedule, f, ensure_ascii=False, indent=2)
        print(f"✅ 결제 일정 저장: {payment_file}")
        
        # CSV로도 저장
        contracts_csv = '/home/ubuntu/coda_contracts.csv'
        with open(contracts_csv, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['id', 'academy', 'contact_person', 'status', 'contract_type', 'contract_value', 'students', 'negotiation_stage'])
            writer.writeheader()
            for contract in self.contracts:
                writer.writerow({
                    'id': contract['id'],
                    'academy': contract['academy'],
                    'contact_person': contract['contact_person'],
                    'status': contract['status'],
                    'contract_type': contract['contract_type'],
                    'contract_value': contract['contract_value'],
                    'students': contract['students'],
                    'negotiation_stage': contract['negotiation_stage']
                })
        print(f"✅ 계약 정보 CSV 저장: {contracts_csv}")
        
        print("\n" + "=" * 60)
        print("✅ 계약 관리 완료!")
        print("=" * 60)
        
        return {
            'contracts': self.contracts,
            'summary': summary,
            'history': self.contract_history,
            'payment_schedule': self.payment_schedule
        }

if __name__ == '__main__':
    contract_mgmt = ContractManagement()
    result = contract_mgmt.run_contract_management()
