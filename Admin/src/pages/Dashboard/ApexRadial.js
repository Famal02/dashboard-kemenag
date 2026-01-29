import React from 'react';
import ReactApexChart from "react-apexcharts"

const ApexRadial = ({ InvestedData }) => {
    const radialchartColors = ["#5156be", "#34c38f"]
    // const series = [80]
    const options = {
        chart: {
            height: 380, // UBAH DISINI: Diperbesar dari 270 menjadi 380 agar chart lebih tinggi
            type: 'radialBar',
            offsetY: -10
        },
        plotOptions: {
            radialBar: {
                startAngle: -130,
                endAngle: 150,
                dataLabels: {
                    name: {
                        show: false
                    },
                    value: {
                        offsetY: 10,
                        fontSize: '32px', // UBAH DISINI: Diperbesar dari 18px menjadi 32px agar angka persen lebih besar
                        fontWeight: 'bold', // Opsi tambahan: Menebalkan huruf
                        color: undefined,
                        formatter: function (val) {
                            return val + "%";
                        }
                    }
                },
                // Opsi tambahan: Memperbesar ukuran lingkaran dalam (hollow) agar terlihat lebih lebar
                hollow: {
                    size: '65%', 
                }
            }
        },
        colors: [radialchartColors[0]],
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                gradientToColors: [radialchartColors[1]],
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [20, 60]
            },
        },
        stroke: {
            dashArray: 4,
        },
        legend: {
            show: false
        },
        labels: ['Series A'],
    };
    return (
        <ReactApexChart
            options={options}
            series={InvestedData || []}
            type="radialBar"
            height="380" // UBAH DISINI: Samakan dengan chart.height di atas (sebelumnya 263)
            className="apex-charts"
        />
    );
}

export default ApexRadial;