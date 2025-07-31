'use client';

export default function RegionalImpactMeter() {
  return (
    <div className="p-4 bg-blue-100 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">📊 Regional Impact Meter</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Participantes ativos:</span>
          <span className="font-bold">1,247</span>
        </div>
        <div className="flex justify-between">
          <span>Eventos confirmados:</span>
          <span className="font-bold">23</span>
        </div>
        <div className="flex justify-between">
          <span>Impacto regional:</span>
          <span className="font-bold text-green-600">85%</span>
        </div>
      </div>
    </div>
  );
}