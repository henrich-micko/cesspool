import React, { useEffect, useState, ChangeEvent } from "react"

// styles && icons
import styles from "@styles/components/machine/machineView.module.scss"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

// types && api
import { MachineType, RecordType } from "../../../types"
import useAxios from "../../../hooks/useAxios"

// charts
import { Chart as ChartJS, registerables, ChartOptions } from 'chart.js';
import { Chart } from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import useIsMobile from "../../../hooks/useIsMobile"

ChartJS.register(...registerables);


interface Props {
    machine: MachineType
}

const ChartsView: React.FC<Props> = (props) => {
    const [records, setRecords] = useState<RecordType[]>([])
    const [isEnought, setIsEnought] = useState<boolean>(false)

    const [timePeriod, setTimePeriod] = useState<String>("day") // data/22-1-1 means spec date
    const [recordData, setRecordData] = useState<String>(props.machine.max_level !== null ? "level_percent" : "level")

    const axios = useAxios()
    const isMobile = useIsMobile()

    useEffect(() => {
        axios.get("/machine/" + props.machine.code + "/records/" + timePeriod)
            .then(res => {
                setIsEnought(res.data.is_enought)
                setRecords(res.data.records)
            })
            .catch(error => console.log(error))
    }, [timePeriod, props.machine])

    const chartDataRecord= (record: RecordType): number => {
        const output = recordData === "level_percent" ? record.level_percent :
            recordData === "level" ? record.level :
            recordData === "battery" ? record.battery : null
        return output !== null ? output : 0
    }

    const unit = timePeriod === "year" ? "month" :
                 timePeriod === "month" ? "week" :
                 timePeriod === "week" ? "day" : "hour"

    const options: ChartOptions = {
        scales: {
            x: {
                min: records.length !== 0 ? records.at(0)?.date : "",
                type: "time", 
                time: {
                    unit: unit
                }
            },
        },

        plugins: {
            legend: {
                display: false,
            } 
        },

        onClick: (e, element) => {
            if (timePeriod === "day" || timePeriod.startsWith("date")) return
            const index = element.length !== 0 ? element[0].index : undefined
            const record = index !== undefined ? records.at(index) : undefined
            if (record !== undefined) setTimePeriod("date/" + record.date.split("T").at(0))
        },
    }

    const data = {
        datasets: [{
            pointRadius: unit === "hour" ? 5 : 1,
            pointHoverRadius: 10,
            label: "Hodnota",
            backgroundColor: "#61dafb",
            borderColor: "#61dafb",
            data: records.map(record => [record.date, chartDataRecord(record)]),
        }]
    };

    const handleRecordData = (event: ChangeEvent<HTMLSelectElement>) => {
        setRecordData(event.target.value)
    }

    const handleTimePeriod = (event: ChangeEvent<HTMLSelectElement>) => {
        setTimePeriod(event.target.value)
    }
    
    return (
        <div className={classNames(styles.machineView, styles.charts)}>
            <div className={classNames(styles.optionPanel, isMobile && styles.mobile)}>
                <div>    
                    <span>Zobraziť</span> 
                    <select onChange={handleRecordData}>
                        <option value="battery">Bateriu</option>
                        <option selected={props.machine.max_level === null} value="level">Hladinu l</option>
                        {props.machine.max_level !== null &&
                            <option selected value="level_percent">Hladinu %</option>
                        }
                    </select>
                </div>

                <div>
                    { timePeriod.startsWith("date/")
                        ? <div>
                            <span>z dňa</span> 
                            <span className={styles.date}>
                                {timePeriod.split("/").at(1)}
                                
                                <FontAwesomeIcon 
                                    className={styles.closeIcon}
                                    icon={faX}
                                    onClick={() => {setTimePeriod("day")}}
                                />
                            </span>
                        </div>
                                
                        : <div>
                            <span>v úseku</span> 
                                <select  onChange={handleTimePeriod}>
                                    <option value="year">Rok</option>
                                    <option value="month">Mesiac</option>
                                    <option value="week">Tyždeň</option>
                                    <option selected value="day">Deň</option>
                                </select>
                        </div>
                    }
                </div>
            </div>
            
            {isEnought ? 
                <Chart
                    type="line"
                    redraw={false} 
                    options={options}
                    data={data}
                />
              : <span className={styles.noRecords}>Nenašiel sa dostatok záznamov na tento výber</span>
            } 
        </div>
    )
}

export default ChartsView