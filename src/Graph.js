import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function LineChart({ sessionsList }) {
    // key = date, value = passing that day
    let my_data = {};
    for (const session of sessionsList) {
        if (!my_data.hasOwnProperty(session.date)) {
            my_data[session.date] = {
                "total": Math.round(session.count * session.average),
                "count": session.count
            };
        } else {
            my_data[session.date]['total'] += Math.round(session.count * session.average);
            my_data[session.date]['count'] += session.count;
        }
    }

    let values = Object.values(my_data).map(day => day.total / day.count);

    const data = {
        labels: Object.keys(my_data),
        datasets: [
            {
                label: 'Serve Receive Rating',
                data: values,
                fill: true,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const options = {
        scales: {
            y: {
                min: 0,
                max: 3, // Assuming the max rating is 3
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const canvasRef = useRef(null);

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        const lineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options,
        });

        return () => lineChart.destroy(); // Clean-up function to destroy chart instance
    }, [data, options]); // Corrected the dependency array

    return (
        <div style={{ position: 'relative', height: '40vh', width: '80vw' }}>
            <canvas ref={canvasRef} />
        </div>
    );
}

export default LineChart;
