import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import MonitoringApiClient from '../../service/MonitoringApiClient';

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const LINE_COLORS = [
    'rgba(54, 162, 235, 0.8)'
];

const datalabelsOptions = {
    datalabels: {
        display: false // 라인에서는 너무 많으면 글씨가 겹치므로 기본은 off, 필요하면 true로!
    }
};

const PERIOD_OPTIONS = [
    { label: '시간별', value: 'hour' },
    { label: '일별', value: 'day' },
    { label: '월별', value: 'month' },
];

const formatLabel = (label, period) => {
    if (period === 'hour') {
        return label.slice(11, 16); // '14:00'
    }
    if (period === 'day') {
        return label.slice(0, 10); // '2025-06-26'
    }
    if (period === 'month') {
        return label.slice(0, 7); // '2025-06'
    }
    return label;
};

const PageVisitStatsDashboard = () => {
    const [period, setPeriod] = useState('day');
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [period]);

    const fetchData = () => {
        setIsLoading(true);
        MonitoringApiClient.getVisit({period})
            .then(res => res.json())
            .then(data => {
                console.log(data);
                const labels = data.map(item => formatLabel(item.period, period));
                const counts = data.map(item => item.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: '메인 페이지 방문자 수',
                            data: counts,
                            fill: false,
                            borderColor: LINE_COLORS[0],
                            backgroundColor: LINE_COLORS[0],
                            tension: 0.3,
                        }
                    ]
                });
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div style={{ width: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32 }}>
                <select
                    value={period}
                    onChange={e => setPeriod(e.target.value)}
                    className="form-select"
                    style={{ width: 150 }}
                >
                    {PERIOD_OPTIONS.map(opt => (
                        <option value={opt.value} key={opt.value}>{opt.label}</option>
                    ))}
                </select>
                {isLoading && <span>로딩중...</span>}
            </div>
            {chartData && (
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: datalabelsOptions,
                        scales: {
                            x: { title: { display: true, text: `${PERIOD_OPTIONS.find(opt => opt.value === period)?.label} 기준` } },
                            y: { title: { display: true, text: '방문자 수' } }
                        }
                    }}
                />
            )}
        </div>
    );
};

export default PageVisitStatsDashboard;
