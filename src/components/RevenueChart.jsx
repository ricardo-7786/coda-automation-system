import { useEffect, useRef } from 'react';

export default function RevenueChart({ region }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // 캔버스 초기화
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    // 데이터 (예시 - 월별 수익)
    const months = ['1월', '2월', '3월', '4월', '5월', '6월'];
    const revenue = [500, 750, 1000, 1200, 1500, 1800]; // 만 원

    const chartWidth = width - 80;
    const chartHeight = height - 80;
    const pointSpacing = chartWidth / (months.length - 1);
    const maxRevenue = 2000;

    // 제목
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('월별 수익 추이', width / 2, 30);

    // 그리드 라인
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = 60 + (i / 4) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // 선 그리기
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    revenue.forEach((value, i) => {
      const x = 40 + i * pointSpacing;
      const y = 60 + chartHeight - (value / maxRevenue) * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // 포인트 그리기
    ctx.fillStyle = '#3b82f6';
    revenue.forEach((value, i) => {
      const x = 40 + i * pointSpacing;
      const y = 60 + chartHeight - (value / maxRevenue) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // 값 표시
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value + '만', x, y - 12);
      ctx.fillStyle = '#3b82f6';
    });

    // X축 그리기
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 60 + chartHeight);
    ctx.lineTo(width - 20, 60 + chartHeight);
    ctx.stroke();

    // X축 레이블
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    months.forEach((month, i) => {
      const x = 40 + i * pointSpacing;
      ctx.fillText(month, x, height - 20);
    });

    // Y축 레이블
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = 60 + (i / 4) * chartHeight;
      const value = (i / 4) * maxRevenue;
      ctx.fillText(value.toFixed(0) + '만', 35, y + 3);
    }
  }, [region]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">월별 수익 추이</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full border border-gray-200 rounded-lg"
      />
    </div>
  );
}
