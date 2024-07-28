import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const PriceChart = ({ data }) => {
    const chartData = {
        labels: data.map(entry => entry.date), // กำหนด label เป็นวันที่
        datasets: [
            {
                label: 'ราคา',
                data: data.map(entry => entry.price), // กำหนดข้อมูลเป็นราคา
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `ราคา: ${tooltipItem.raw} บาท`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'วันที่',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'ราคา (บาท)',
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default PriceChart;
