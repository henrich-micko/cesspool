import React, { useEffect, useState, ChangeEvent } from "react"

// styles && icons
import styles from "@styles/components/machine/machineChart.module.scss"
import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

// types && hooks
import { MachineAdminType, MachineType, RecordType } from "@types"
import useAxios from "@hooks/useAxios"
import useIsMobile from "@hooks/useIsMobile"

// charts
import { Chart as ChartJS, registerables, ChartOptions } from 'chart.js';
import { Chart } from 'react-chartjs-2'
import 'chartjs-adapter-moment';

ChartJS.register(...registerables);


interface Props {
    code: string
}

const MachineChart: React.FC<Props> = (props) => {
    const [records, setRecords] = useState<RecordType[]>([])

    const [timePeriod, setTimePeriod] = useState<String>("day") // data/22-1-1 means spec date
    const [recordData, setRecordData] = useState<String>("level_percent")

    const [yearSupport, setYearSupport] = useState<boolean>(false)
    const [monthSupport, setMonthSupport] = useState<boolean>(false)
    const [weekSupport, setWeekSupport] = useState<boolean>(false)
    const [daySupport, setDaySupport] = useState<boolean>(false)

    const axios = useAxios()
    const isMobile = useIsMobile()

    useEffect(() => {
        axios.get("/machine/" + props.code + "/records/" + timePeriod)
            .then(res => setRecords(res.data))
            .catch(error => console.log(error))

        axios.get("/machine/" + props.code + "/records/support/")
            .then(res => {
                setYearSupport(res.data.year)
                setMonthSupport(res.data.month)
                setWeekSupport(res.data.week)
                setDaySupport(res.data.day)
            })
            .catch(error => console.log(error))

    }, [timePeriod, props.code])

    const getDate = () => {
        const date = timePeriod.split("/").at(1)
        if (date === undefined) return 

        const datetime = date.split("T").at(0)
        if (datetime === undefined) return

        const year = datetime.split("-").at(0)
        const month = datetime.split("-").at(1)
        const day = datetime.split("-").at(2)

        return day + "." + month + "." + year
    }

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
                min: -10,
                max: 110,
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
        <div className={styles.machineChart}>
            <div className={classNames(styles.optionPanel, isMobile && styles.mobile)}>
                <div>    
                    <span>Zobraziť</span> 
                    <select onChange={handleRecordData}>
                        <option value="battery">Bateriu</option>
                        <option value="level">Hladinu m</option>
                        <option selected value="level_percent">Hladinu %</option>
                    </select>
                </div>

                <div>
                    { timePeriod.startsWith("date/")
                        ? <div>
                            <span>z dňa</span> 
                            <span className={styles.date}>
                                {getDate()}
                                
                                <FontAwesomeIcon 
                                    className={styles.closeIcon}
                                    icon={faX}
                                    onClick={() => {setTimePeriod("day")}}
                                />
                            </span>
                        </div>
                                
                        : <div>
                            <span>Za posledný</span> 
                                <select onChange={handleTimePeriod}>
                                    {yearSupport && <option value="year">Rok</option>}
                                    {monthSupport && <option value="month">Mesiac</option>}
                                    {weekSupport && <option value="week">Tyždeň</option>}
                                    {daySupport && <option selected value="day">Deň</option>}
                                </select>
                        </div>
                    }
                </div>
            </div>
            
            <Chart
                type="line"
                redraw={false} 
                options={options}
                data={data}
            />
        </div>
    )
}

export default MachineChart