// Import the Line element from the react-chartjs-2 package, which is a React wrapper for Chart.js
import {Line} from 'react-chartjs-2';
import {Chart as chartjs} from 'chart.js/auto';

function Graph(my_data) {
    my_data = my_data['my_data']
    console.log(my_data)
    let labels = my_data.map(i => i.date);
    let passdata = my_data.map(i => i.average);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Session Passing Average',
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                data: passdata
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
              enabled: true,
              callbacks: {
                beforeBody: function(context) {
                  // This will be displayed before the body section of the tooltip
                  const pointIndex = context[0].dataIndex;
                  return `${'Sample Size of: ' + my_data[pointIndex].count}`;
                }
              }
            }
          },
        scales: {
            y: {
                min: 0,
                max: 3,
                ticks: {
                    stepSize: 0.05
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        
    };

    // Return the Line element with the data and options as props
    return <div style={{ height: '90vh', width: '90vw' }}>
        <Line data={data} options={options} />
    </div>;
}

export default Graph;
