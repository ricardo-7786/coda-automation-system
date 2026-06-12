import { useEffect, useRef } from 'react';

export default function ResponseChart({ region }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // 캔버스 초기화
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);

    // 데이터 (예시)
    const stages = ['1단계\n(초기 접촉)', '2단계\n(응답 추적)', '3단계\n(계약 체결)'];
    const contacted = [100, 50, 25];
    const responded = [50, 30, 15];
    const contracted = [25, 15, 8];

    const barWidth = width / (stages.length * 4);
    const maxValue = 100;
    const chartHeight = height - 80;

    // 제목
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('단계별 응답 추이', width / 2, 30);

    // 범례
    ctx.font = '12px Arial';
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(50, 45, 12, 12);
    ctx.fillStyle = '#1f2937';
    ctx.textAlign = 'left';
    ctx.fillText('연락함', 70, 54);

    ctx.fillStyle = '#10b981';
    ctx.fillRect(150, 45, 12, 12);
    ctx.fillStyle = '#1f2937';
    ctx.fillText('응답함', 170, 54);

    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(250, 45, 12, 12);
    ctx.fillStyle = '#1f2937';
    ctx.fillText('계약함', 270, 54);

    // 차트 그리기
    const startX = 40;
    const startY = height - 40;

    stages.forEach((stage, i) => {
      const x = startX + i * (width - 80) / stages.length + (width - 80) / (stages.length * 2);

      // 연락함 바
      const bar1Height = (contacted[i] / maxValue) * chartHeight;
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x - barWidth * 1.5, startY - bar1Height, barWidth, bar1Height);

      // 응답함 바
      const bar2Height = (responded[i] / maxValue) * chartHeight;
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x - barWidth / 2, startY - bar2Height, barWidth, bar2Height);

      // 계약함 바
      const bar3Height = (contracted[i] / maxValue) * chartHeight;
      ctx.fillStyle = '#8b5cf6';
      ctx.fillRect(x + barWidth / 2, startY - bar3Height, barWidth, bar3Height);

      // X축 레이블
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(stage, x, startY + 30);
    });

    // Y축 그리기
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(startX - 10, startY);
    ctx.lineTo(startX - 10, 70);
    ctx.stroke();

    // Y축 레이블
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = startY - (i / 5) * chartHeight;
      const value = (i / 5) * maxValue;
      ctx.fillText(value.toFixed(0), startX - 15, y + 3);
    }
  }, [region]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">단계별 응답 추이</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full border border-gray-200 rounded-lg"
      />
    </div>
  );
}
