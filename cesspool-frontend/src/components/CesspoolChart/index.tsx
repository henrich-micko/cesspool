import React from "react";
import { Record } from "@types";
import useAxios from "@hooks/useAxios";
import { Chart as ChartJS, registerables, ChartOptions, ActiveElement } from 'chart.js';
import { Chart } from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import { blue } from "../../settings";
import styles from "@components/CesspoolChart/styles.module.scss";
import TheBox from "@components/TheBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import TheDate from "@components/TheDate";


ChartJS.register(...registerables);


interface _CesspoolChart {
    code: string;
}


const CesspoolChart: React.FC<_CesspoolChart> = (props) => {
    const [records, setRecords] = React.useState<Record[]>([]);
    const [field, setField] = React.useState<string>("level_percent");

    const [tf, setTf] = React.useState<string>("day"); // date/ for date

    const [tfDaySup, setTfDaySup] = React.useState<boolean>(false);
    const [tfWeekSup, setTfWeekSup] = React.useState<boolean>(false);
    const [tfMonthSup, setTfMonthSup] = React.useState<boolean>(false);
    const [tfAllSup, setTfAllSup] = React.useState<boolean>(false);

    const [error, setError] = React.useState<string|null>(null);

    const axios = useAxios();

    const fetchTfSupport = () => {
        axios.get("cesspool/c/" + props.code + "/records/support")
             .then(res => {
                setTfDaySup(res.data.day);
                setTfWeekSup(res.data.week);
                setTfMonthSup(res.data.month);
                setTfAllSup(res.data.all);
             })
             .catch(err => setError("Došlo ku chybe."))
    }

    const fetchData = () => {
        axios.get("cesspool/c/" + props.code + "/records/" + tf)
             .then(res => setRecords(res.data))
             .catch(err => setError("Došlo ku chybe."));
    }

    React.useEffect(() => {
        fetchTfSupport();
        fetchData();
    }, [tf])

    const handlePointClick = (e: any, element: ActiveElement[]) => {
        if (tf === "day" || tf == "date" || !records)
            return;
        
        const index = element.length !== 0 ? element[0].index : undefined;
        const record = index !== undefined ? records.at(index) : undefined;

        if (record !== undefined) {
            const date = record.date.split("T").at(0);
            if (date !== undefined) 
                setTf("date/" + date);
        }
    }

    const getRecordField= (record: Record): number => {
        const output = field === "level_percent" ? record.level_percent :
            field === "level_m" ? record.level_m :
            field === "battery" ? record.battery : null
        return output !== null ? output : 0
    }

    // Chart options
    const unit = tf === "all" ? "month" :
                 tf === "month" ? "week" :
                 tf === "week" ? "day" : "hour"

    const options: ChartOptions = {
        scales: {
            x: {
                min: records && records.length !== 0 ? records.at(0)?.date : "",
                type: "time",
                ticks: {
                    font: {
                        size: 16,
                    }
                },
                time: {
                    unit: unit
                }
            },
            y: {
                min: 0,
                max: 100,
                ticks: {
                    font: {
                        size: 16,
                    }
                },
            }
        },

        plugins: {
            legend: {
                display: false,
            } 
        },

        onClick: handlePointClick
    };

    const data = {
        datasets: [{
            pointRadius: unit === "hour" ? 5 : 1,
            pointHoverRadius: 10,
            label: "Hodnota",
            backgroundColor: blue,
            borderColor: blue,
            data: records.map(record => [record.date, getRecordField(record)]),
        }]
    };

    return (
        <TheBox style={{"width": "100%", "margin": 0, "padding": 0}}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.selector}>
                        <span>Zobraziť</span> 
                        <select onChange={(e) => setField(e.target.value)}>
                            <option value="battery">Bateriu</option>
                            <option value="level_m">Hladinu m</option>
                            <option selected value="level_percent">Hladinu %</option>
                        </select>
                    </div>

                    <div className={styles.selector}>
                        { tf.startsWith("date/") 
                            ? <>
                                <span>z dňa</span> 
                                <span className={styles.date}>
                                    <TheDate date={tf.split("/").at(1)} />
                                    
                                    <FontAwesomeIcon 
                                        className={styles.closeIcon}
                                        icon={faX}
                                        onClick={() => setTf("day")}
                                    />
                                </span>
                            </>
                                    
                            : <>
                                <span>za posledný</span> 
                                    <select onChange={(e) => setTf(e.target.value)}>
                                        {tfAllSup && <option value="all">Všetky</option>}
                                        {tfMonthSup && <option value="month">Mesiac</option>}
                                        {tfWeekSup && <option value="week">Tyždeň</option>}
                                        {tfDaySup && <option selected value="day">Deň</option>}
                                    </select>
                            </> }
                    </div>
                </div>
                
                <Chart
                    type="line"
                    redraw={false} 
                    options={options}
                    data={data}
                />
            </div>
        </TheBox>
    )   
}

export default CesspoolChart;