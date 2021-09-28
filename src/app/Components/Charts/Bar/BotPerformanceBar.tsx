import React, { useEffect, useState } from 'react';
import {InputLabel, MenuItem, FormControl, Select} from '@mui/material';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Scatter } from 'recharts';
import NoData from '@/app/Pages/Stats/Components/NoData';


import type { Type_Bot_Performance_Metrics } from '@/types/3Commas';
import type { Type_Tooltip, Type_BotPerformanceCharts } from '@/types/Charts';

import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';
import { parseNumber} from '@/utils/number_formatting';
import { dynamicSort } from '@/utils/helperFunctions';
import {filterData} from '@/app/Components/Charts/formatting'
import {currencyTickFormatter, currencyTooltipFormatter} from '@/app/Components/Charts/formatting'



const BotPerformanceBar = ({ data = [], defaultCurrency }: Type_BotPerformanceCharts) => {


    const defaultFilter = 'all';
    const defaultSort = '-total_profit';

    const localStorageFilterName = storageItem.charts.BotPerformanceBar.filter
    const localStorageSortName = storageItem.charts.BotPerformanceBar.sort

    const [sort, setSort] = useState(defaultSort);
    const [filter, setFilter] = useState(defaultFilter);

    useEffect(() => {
        const getFilterFromStorage = getStorageItem(localStorageFilterName);
        setFilter((getFilterFromStorage != undefined) ? getFilterFromStorage : defaultFilter);

        const getSortFromStorage = getStorageItem(localStorageSortName);
        setSort((getSortFromStorage != undefined) ? getSortFromStorage : defaultSort);

    }, [])

    const handleSortChange = (event:any) => {
        const selectedSort = (event.target.value != undefined) ? event.target.value : defaultSort;
        setSort(selectedSort);
        setStorageItem(localStorageSortName, selectedSort)
    };

    const handleFilterChange = (event: any) => {
        const selectedFilter = (event.target.value != undefined) ? event.target.value : defaultFilter;
        setFilter(selectedFilter);
        setStorageItem(localStorageFilterName, selectedFilter)
    };


    const hide = (id:string ) => {
        return id != sort
    }

    

    const renderChart = () => {
        if (data.length === 0) {
            return (<NoData />)
        }

        let newData = filterData(data, filter).sort(dynamicSort(sort))
        
        return (
        <ResponsiveContainer width="100%" height="90%" minHeight="800px">
            <ComposedChart

                data={newData}
                margin={{
                    top: 25,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
                layout="vertical"
                // stackOffset="expand"
            >
                <CartesianGrid opacity={.3} vertical={true} horizontal={false}/>
                <Legend verticalAlign="top" height={36} />
                {/* TODO - pass the custom props down properly here.  */}
                {/* @ts-ignore */}
                <Tooltip content={<CustomTooltip formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)} />} cursor={{ strokeDasharray: '3 3' }} />
                <YAxis
                    dataKey="bot_name"
                    type="category"
                    axisLine={false}
                    width={140}
                    textAnchor="end"

                    tickFormatter={(str) => {
                        return (str.length > 14 ) ? str.slice(0, 11) + "..." : str
                    }}

                    fontSize=".75em"
                    minTickGap={-80}

                />
                <XAxis
                    xAxisId="total_profit"
                    type="number"
                    hide={hide("-total_profit")}
                    domain={[0, 'auto']}
                    allowDataOverflow={true}
                    height={50}
                    allowDecimals={true}
                    label={{
                        value: "Total Profit",
                        position: "Bottom",
                        dx: 0,
                        dy: 20
                    }}
                    tickFormatter = {(value:any) => currencyTickFormatter(value, defaultCurrency)}


                    />
                <XAxis
                    xAxisId="avg_deal_hours"
                    type="number"
                    hide={hide("-avg_deal_hours")}
                    domain={[0, 'auto']}
                    allowDataOverflow={true}
                    height={50}
                    allowDecimals={false}
                    label={{
                        value: "Avg. Deal Hours",
                        position: "Bottom",
                        dx: 0,
                        dy: 20
                    }}

                    />
                <XAxis
                    xAxisId="bought_volume"
                    type="number"
                    hide={hide("-bought_volume")}
                    domain={[0, 'auto']}
                    allowDataOverflow={true}
                    height={50}
                    allowDecimals={false}

                    label={{
                        value: "Bought Volume",
                        position: "Bottom",
                        dx: 0,
                        dy: 20
                    }}

                    />
                <XAxis
                    xAxisId="avg_profit"
                    type="number"
                    hide={hide("-avg_profit")}
                    domain={[0, 'auto']}
                    allowDataOverflow={true}
                    height={50}
                    allowDecimals={false}

                    label={{
                        value: "Avg profit per deal",
                        position: "Bottom",
                        dx: 0,
                        dy: 20
                    }}

                    />


                <Bar name="Total Profit" dataKey="total_profit" fill="var(--color-CTA-dark25)"  xAxisId="total_profit" fillOpacity={.8} />
                <Scatter name="Bought Volume" xAxisId="bought_volume" dataKey="bought_volume" fillOpacity={.9} fill="var(--color-primary-light25-light25)"  />
                <Scatter name="Avg. Deal Hours" dataKey="avg_deal_hours"  fill="var(--color-secondary)" xAxisId="avg_deal_hours"/>
                <Scatter name="Avg. Profit" dataKey="avg_profit"  fill="#F87171" xAxisId="avg_profit"/>

            </ComposedChart>
        </ResponsiveContainer>)
    }

    return (
        <div className="boxData stat-chart  ">
            <div style={{position: "relative"}}>
                <h3 className="chartTitle">Bot Performance</h3>
                <div style={{ position:"absolute", right: 0, top: 0, height: "50px", zIndex: 5}}>
                <FormControl  >
                    <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                    <Select
                        variant="standard"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        onChange={handleSortChange}
                        style={{width: "150px"}}
                    >
                        <MenuItem value="-total_profit">Profit</MenuItem>
                        <MenuItem value="-bought_volume">Bought Volume</MenuItem>
                        <MenuItem value="-avg_deal_hours">Avg. Deal Hours</MenuItem>
                        <MenuItem value="-avg_profit">Avg. Profit</MenuItem>
                    </Select>
                </FormControl>
                </div>

                <div style={{ position:"absolute", left: 0, top: 0, height: "50px", zIndex: 5}}>
                <FormControl  >
                        <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
                        <Select
                            variant="standard"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            onChange={handleFilterChange}
                            style={{ width: "150px" }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="top20">Top 20%</MenuItem>
                            <MenuItem value="top50">Top 50%</MenuItem>
                            <MenuItem value="bottom50">Bottom 50%</MenuItem>
                            <MenuItem value="bottom20">Bottom 20%</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                   

                

            </div>
            {renderChart()}
        </div>
    )
}


function CustomTooltip({ active, payload, formatter}: Type_Tooltip) {
    if (!active || payload.length == 0 || payload[0] == undefined) {
        return null
    }

    const data: Type_Bot_Performance_Metrics = payload[0].payload
    const { total_profit, avg_deal_hours, bought_volume, number_of_deals, bot_name, type, avg_profit } = data
    return (
        <div className="tooltip">
            <h4>{bot_name}</h4>
            <p>{type}</p>
            <p><strong>Bought volume:</strong> {formatter(bought_volume)} </p>
            <p><strong>Deal count:</strong> {number_of_deals} </p>
            <p><strong>Avg profit per deal:</strong> {formatter(avg_profit)} </p>
            <p><strong>Total Profit:</strong> {formatter(total_profit)} </p>
            <p><strong>Avg deal hours:</strong> {parseNumber(avg_deal_hours, 2)} </p>
        </div>
    )

}

export default BotPerformanceBar;