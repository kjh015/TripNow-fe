import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import MonitoringApiClient from '../../service/MonitoringApiClient';
import FilterApiClient from '../../service/FilterApiClient';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// 플러그인 및 차트 요소 등록
Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const COLORS = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
];
const BORDER_COLORS = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
];

const datalabelsOptions = {
    datalabels: {
        color: '#222',
        font: { size: 16 },
        anchor: 'end',
        align: 'top',
        formatter: (value) => value,
    },
    legend: { display: false },
    title: { display: false },
};

const TopFormatDashboard = () => {
    const [DATA_OPTIONS, setDATA_OPTIONS] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 옵션 목록 받아오기
    useEffect(() => {
        FilterApiClient.getFormatKeys(1)
            .then(res => res.json())
            .then(data => {
                const options = data.map(format => ({
                    label: format,
                    value: format
                }));
                setDATA_OPTIONS(options);
                if (options.length > 0) setSelectedType(options[0].value);
            });
    }, []);

    // 타입 변경 시 차트 리셋
    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        setChartData(null);
    };

    // 출력 버튼
    const handleFetchData = () => {
        if (!selectedType) return;
        setIsLoading(true);

        MonitoringApiClient.getDashboardData({ data: selectedType })
            .then(res => res.json()
            .then(data => {
                if (res.ok && Array.isArray(data.body)) {
                    // 각 item에서 selectedType 필드를 라벨로 사용
                    const labels = data.body.map(item => item[selectedType]);
                    const values = data.body.map(item => item.count);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: DATA_OPTIONS.find(opt => opt.value === selectedType)?.label || selectedType,
                                data: values,
                                backgroundColor: labels.map((_, i) => COLORS[i % COLORS.length]),
                                borderColor: labels.map((_, i) => BORDER_COLORS[i % BORDER_COLORS.length]),
                                borderWidth: 1,
                            }
                        ]
                    });
                } else {
                    setChartData(null);
                    alert('데이터를 불러오지 못했습니다.');
                }
            }))
            .catch(() => {
                setChartData(null);
                alert('에러가 발생했습니다.');
            })
            .finally(() => setIsLoading(false));
    };

    const chartOptions = {
        responsive: true,
        plugins: datalabelsOptions,
    };

    return (
        <div style={{ width: '800px', margin: '0 auto' }}>
            {/* 데이터 종류 선택 */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32 }}>
                <select
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="form-select"
                    style={{ width: 220 }}
                    disabled={DATA_OPTIONS.length === 0}
                >
                    {DATA_OPTIONS.map(opt => (
                        <option value={opt.value} key={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <button className="btn btn-primary" onClick={handleFetchData} disabled={isLoading || !selectedType}>
                    {isLoading ? '불러오는 중...' : '출력'}
                </button>
            </div>
            {/* 차트 출력 */}
            {chartData && (
                <div>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}
            {/* 로딩/데이터 없음 처리 */}
            {!chartData && !isLoading && <div className="text-center text-muted mt-4">출력할 데이터가 없습니다.</div>}
        </div>
    );
};

export default TopFormatDashboard;
