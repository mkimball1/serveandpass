// Import the Line element from the react-chartjs-2 package, which is a React wrapper for Chart.js
import {Line} from 'react-chartjs-2';
import {Chart as chartjs} from 'chart.js/auto';
import './App.css';

function Graph(my_data) {    
    my_data = my_data['my_data']
    let labels = my_data.map(i => i.date.slice(0,4));
    let passdata = my_data.map(i => i.average);

    const calculateAverage = (arr) => {
      const total = arr.reduce((acc, num) => acc + num, 0);
      return total / arr.length;
    };

    
    let average = Array(passdata.length).fill(calculateAverage(passdata));
    let averagelabels = average.map(i => 'Lifetime Average');

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Session Passing Average',
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
                data: passdata
            },
            {
              label: 'Lifetime Passing Average',
              fill: true,
              borderDash: [5, 5],
              backgroundColor: 'rgba(232, 28, 31, 0.4)',
              borderColor: 'rgba(232, 28, 31, 0.7)',
              data: average,  // The array of averages
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
                  return `${
                    'Sample Size of: ' + my_data[pointIndex].count + '\n' +
                    '3: ' + my_data[pointIndex].passes['3'] + '\n' +
                    '2: ' + my_data[pointIndex].passes['2'] + '\n' +
                    '1: ' + my_data[pointIndex].passes['1'] + '\n' +
                    '0: ' + my_data[pointIndex].passes['0']
                  }`;
                }
              }
            }
          },
        scales: {
            y: {
                min: 0,
                max: 3,
                ticks: {
                    stepSize: 0.10
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        
    };

    // Return the Line element with the data and options as props
    return <div className='mygraph'>
        <Line data={data} options={options} />
    </div>;
}

export default Graph;
