#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
CODA 분석 & 리포팅 시스템
응답률, 계약율 분석 및 주간/월간 리포트 생성
"""

import json
import csv
from datetime import datetime, timedelta
from typing import List, Dict

class AnalyticsReporting:
    def __init__(self):
        self.academies_data = [
            {
                'name': '파주 보컬 아카데미',
                'email_sent': 3,
                'email_opened': 2,
                'form_response': True,
                'interest_level': 'high',
                'students': 45,
                'contract_status': 'negotiating',
                'contract_value': 5000000,
                'contract_date': None
            },
            {
                'name': '파주 성악학원',
                'email_sent': 3,
                'email_opened': 1,
                'form_response': True,
                'interest_level': 'medium',
                'students': 32,
                'contract_status': 'interested',
                'contract_value': 3000000,
                'contract_date': None
            },
            {
                'name': '파주 음악학원',
                'email_sent': 3,
                'email_opened': 2,
                'form_response': True,
                'interest_level': 'high',
                'students': 28,
                'contract_status': 'trial',
                'contract_value': 2500000,
                'contract_date': None
            }
        ]
        
        self.weekly_data = []
        self.monthly_data = []
    
    def calculate_metrics(self) -> Dict:
        """주요 지표 계산"""
        total_academies = len(self.academies_data)
        total_responses = sum(1 for a in self.academies_data if a['form_response'])
        total_emails_sent = sum(a['email_sent'] for a in self.academies_data)
        total_emails_opened = sum(a['email_opened'] for a in self.academies_data)
        
        # 계약 상태별 분류
        contract_status = {
            'negotiating': len([a for a in self.academies_data if a['contract_status'] == 'negotiating']),
            'trial': len([a for a in self.academies_data if a['contract_status'] == 'trial']),
            'interested': len([a for a in self.academies_data if a['contract_status'] == 'interested']),
            'contracted': len([a for a in self.academies_data if a['contract_status'] == 'contracted'])
        }
        
        # 관심도별 분류
        interest_distribution = {
            'high': len([a for a in self.academies_data if a['interest_level'] == 'high']),
            'medium': len([a for a in self.academies_data if a['interest_level'] == 'medium']),
            'low': len([a for a in self.academies_data if a['interest_level'] == 'low'])
        }
        
        metrics = {
            'total_academies': total_academies,
            'response_rate': (total_responses / total_academies * 100) if total_academies > 0 else 0,
            'email_open_rate': (total_emails_opened / total_emails_sent * 100) if total_emails_sent > 0 else 0,
            'total_emails_sent': total_emails_sent,
            'total_emails_opened': total_emails_opened,
            'contract_status': contract_status,
            'interest_distribution': interest_distribution,
            'total_students': sum(a['students'] for a in self.academies_data),
            'potential_revenue': sum(a['contract_value'] for a in self.academies_data if a['contract_status'] in ['negotiating', 'trial', 'interested']),
            'contracted_revenue': sum(a['contract_value'] for a in self.academies_data if a['contract_status'] == 'contracted')
        }
        
        return metrics
    
    def generate_weekly_report(self) -> Dict:
        """주간 리포트 생성"""
        metrics = self.calculate_metrics()
        
        report = {
            'report_type': 'weekly',
            'week': datetime.now().strftime('%Y-W%W'),
            'date_range': {
                'start': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
                'end': datetime.now().strftime('%Y-%m-%d')
            },
            'summary': {
                'total_academies': metrics['total_academies'],
                'new_responses': metrics['total_academies'] - 0,  # 시뮬레이션
                'response_rate': f"{metrics['response_rate']:.1f}%",
                'email_open_rate': f"{metrics['email_open_rate']:.1f}%"
            },
            'contract_status': metrics['contract_status'],
            'interest_distribution': metrics['interest_distribution'],
            'key_metrics': {
                'total_students': metrics['total_students'],
                'potential_revenue': f"₩{metrics['potential_revenue']:,}",
                'contracted_revenue': f"₩{metrics['contracted_revenue']:,}"
            },
            'top_performers': [
                {
                    'academy': a['name'],
                    'interest': a['interest_level'],
                    'students': a['students'],
                    'status': a['contract_status']
                } for a in sorted(self.academies_data, key=lambda x: x['students'], reverse=True)[:3]
            ],
            'recommendations': [
                "높은 관심 학원 2개에 집중 영업 (파주 보컬, 파주 음악)",
                "중간 관심 학원에 사례 제시 자료 발송",
                "계약 진행 중인 학원 1개 계약 체결 추진",
                "SNS 활동도 높은 학원 우선 접근"
            ]
        }
        
        self.weekly_data.append(report)
        return report
    
    def generate_monthly_report(self) -> Dict:
        """월간 리포트 생성"""
        metrics = self.calculate_metrics()
        
        report = {
            'report_type': 'monthly',
            'month': datetime.now().strftime('%Y-%m'),
            'date_range': {
                'start': datetime.now().replace(day=1).strftime('%Y-%m-%d'),
                'end': datetime.now().strftime('%Y-%m-%d')
            },
            'executive_summary': {
                'total_academies_reached': metrics['total_academies'],
                'response_rate': f"{metrics['response_rate']:.1f}%",
                'email_open_rate': f"{metrics['email_open_rate']:.1f}%",
                'contract_rate': f"{(metrics['contract_status']['contracted'] / metrics['total_academies'] * 100):.1f}%"
            },
            'detailed_metrics': {
                'total_emails_sent': metrics['total_emails_sent'],
                'total_emails_opened': metrics['total_emails_opened'],
                'total_form_responses': sum(1 for a in self.academies_data if a['form_response']),
                'total_students': metrics['total_students'],
                'average_students_per_academy': metrics['total_students'] / metrics['total_academies']
            },
            'contract_analysis': {
                'negotiating': metrics['contract_status']['negotiating'],
                'trial': metrics['contract_status']['trial'],
                'interested': metrics['contract_status']['interested'],
                'contracted': metrics['contract_status']['contracted'],
                'potential_revenue': f"₩{metrics['potential_revenue']:,}",
                'contracted_revenue': f"₩{metrics['contracted_revenue']:,}"
            },
            'interest_distribution': metrics['interest_distribution'],
            'performance_by_academy': [
                {
                    'academy': a['name'],
                    'interest': a['interest_level'],
                    'students': a['students'],
                    'status': a['contract_status'],
                    'potential_value': f"₩{a['contract_value']:,}"
                } for a in self.academies_data
            ],
            'trends': {
                'response_trend': 'upward',
                'engagement_trend': 'stable',
                'conversion_trend': 'improving'
            },
            'next_month_targets': {
                'target_response_rate': '50%',
                'target_contract_rate': '30%',
                'target_new_academies': 50,
                'target_revenue': '₩15,000,000'
            },
            'action_items': [
                "높은 관심 학원 2개 계약 체결 (목표: 1개 이상)",
                "중간 관심 학원 5개에 추가 팔로우업",
                "SNS 자동화로 50개 추가 학원 접근",
                "분석 & 리포팅 시스템 고도화",
                "다른 지역(수원, 성남) 영업 확대"
            ]
        }
        
        self.monthly_data.append(report)
        return report
    
    def generate_chart_data(self) -> Dict:
        """차트 데이터 생성"""
        metrics = self.calculate_metrics()
        
        chart_data = {
            'response_rate_chart': {
                'type': 'pie',
                'title': '응답률',
                'data': {
                    'labels': ['응답', '미응답'],
                    'values': [
                        sum(1 for a in self.academies_data if a['form_response']),
                        len(self.academies_data) - sum(1 for a in self.academies_data if a['form_response'])
                    ]
                }
            },
            'interest_distribution_chart': {
                'type': 'bar',
                'title': '관심도 분포',
                'data': {
                    'labels': ['높음', '중간', '낮음'],
                    'values': [
                        metrics['interest_distribution']['high'],
                        metrics['interest_distribution']['medium'],
                        metrics['interest_distribution']['low']
                    ]
                }
            },
            'contract_status_chart': {
                'type': 'doughnut',
                'title': '계약 상태',
                'data': {
                    'labels': ['협상 중', '체험 중', '관심', '계약'],
                    'values': [
                        metrics['contract_status']['negotiating'],
                        metrics['contract_status']['trial'],
                        metrics['contract_status']['interested'],
                        metrics['contract_status']['contracted']
                    ]
                }
            },
            'email_open_rate_chart': {
                'type': 'line',
                'title': '이메일 오픈율',
                'data': {
                    'labels': ['1주', '2주', '3주', '4주'],
                    'values': [45, 55, 65, 67]  # 시뮬레이션
                }
            },
            'revenue_potential_chart': {
                'type': 'bar',
                'title': '수익 잠재력',
                'data': {
                    'labels': ['협상 중', '체험 중', '관심', '계약'],
                    'values': [5000000, 2500000, 3000000, 0]
                }
            }
        }
        
        return chart_data
    
    def run_analytics(self):
        """분석 실행"""
        print("=" * 60)
        print("📊 CODA 분석 & 리포팅 시스템")
        print("=" * 60)
        
        # 1단계: 지표 계산
        print("\n[1단계] 주요 지표 계산")
        print("-" * 60)
        metrics = self.calculate_metrics()
        print(f"📈 응답률: {metrics['response_rate']:.1f}%")
        print(f"📧 이메일 오픈율: {metrics['email_open_rate']:.1f}%")
        print(f"👥 총 학생 수: {metrics['total_students']}명")
        print(f"💰 잠재 수익: ₩{metrics['potential_revenue']:,}")
        print(f"✅ 계약 수익: ₩{metrics['contracted_revenue']:,}")
        
        # 2단계: 주간 리포트 생성
        print("\n[2단계] 주간 리포트 생성")
        print("-" * 60)
        weekly_report = self.generate_weekly_report()
        print(f"📅 주간: {weekly_report['week']}")
        print(f"📊 응답률: {weekly_report['summary']['response_rate']}")
        print(f"📧 이메일 오픈율: {weekly_report['summary']['email_open_rate']}")
        print(f"💡 주요 추천사항:")
        for i, rec in enumerate(weekly_report['recommendations'], 1):
            print(f"   {i}. {rec}")
        
        # 3단계: 월간 리포트 생성
        print("\n[3단계] 월간 리포트 생성")
        print("-" * 60)
        monthly_report = self.generate_monthly_report()
        print(f"📅 월간: {monthly_report['month']}")
        print(f"📊 응답률: {monthly_report['executive_summary']['response_rate']}")
        print(f"📧 이메일 오픈율: {monthly_report['executive_summary']['email_open_rate']}")
        print(f"🎯 계약률: {monthly_report['executive_summary']['contract_rate']}")
        print(f"💰 잠재 수익: {monthly_report['contract_analysis']['potential_revenue']}")
        
        # 4단계: 차트 데이터 생성
        print("\n[4단계] 차트 데이터 생성")
        print("-" * 60)
        chart_data = self.generate_chart_data()
        print(f"✅ 응답률 차트")
        print(f"✅ 관심도 분포 차트")
        print(f"✅ 계약 상태 차트")
        print(f"✅ 이메일 오픈율 차트")
        print(f"✅ 수익 잠재력 차트")
        
        # 5단계: 데이터 저장
        print("\n[5단계] 분석 데이터 저장")
        print("-" * 60)
        
        # 주간 리포트 저장
        weekly_file = '/home/ubuntu/coda_weekly_report.json'
        with open(weekly_file, 'w', encoding='utf-8') as f:
            json.dump(weekly_report, f, ensure_ascii=False, indent=2)
        print(f"✅ 주간 리포트 저장: {weekly_file}")
        
        # 월간 리포트 저장
        monthly_file = '/home/ubuntu/coda_monthly_report.json'
        with open(monthly_file, 'w', encoding='utf-8') as f:
            json.dump(monthly_report, f, ensure_ascii=False, indent=2)
        print(f"✅ 월간 리포트 저장: {monthly_file}")
        
        # 차트 데이터 저장
        chart_file = '/home/ubuntu/coda_chart_data.json'
        with open(chart_file, 'w', encoding='utf-8') as f:
            json.dump(chart_data, f, ensure_ascii=False, indent=2)
        print(f"✅ 차트 데이터 저장: {chart_file}")
        
        # 메트릭 저장
        metrics_file = '/home/ubuntu/coda_metrics.json'
        with open(metrics_file, 'w', encoding='utf-8') as f:
            json.dump(metrics, f, ensure_ascii=False, indent=2)
        print(f"✅ 메트릭 저장: {metrics_file}")
        
        print("\n" + "=" * 60)
        print("✅ 분석 & 리포팅 완료!")
        print("=" * 60)
        
        return {
            'metrics': metrics,
            'weekly_report': weekly_report,
            'monthly_report': monthly_report,
            'chart_data': chart_data
        }

if __name__ == '__main__':
    analytics = AnalyticsReporting()
    result = analytics.run_analytics()
