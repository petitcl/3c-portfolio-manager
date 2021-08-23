import React, { useState } from 'react';
import { format } from 'date-fns';
import dotProp from 'dot-prop';

import './Stats.scss'
import { Button, ButtonGroup } from '@material-ui/core';

import { RiskMonitor, SummaryStatistics, PerformanceMonitor } from './Views/Index';
import { UpdateDataButton } from '@/app/Components/Buttons/Index'

// import './Stats.scss'
import { useGlobalState } from '@/app/Context/Config';
import { useGlobalData } from '@/app/Context/DataContext';

import { 
    Card_ActiveDeals, Card_totalInDeals, Card_MaxDca, 
    Card_TotalBankRoll, Card_TotalProfit, Card_MaxRiskPercent, 
    Card_TotalBoughtVolume, Card_TotalDeals, Card_TotalRoi, 
    Card_AverageDailyProfit, Card_AverageDealHours 
} from '@/app/Components/Charts/DataCards';

import { getLang } from '@/utils/helperFunctions';
const lang = getLang()

const buttonElements = [
    {
        name: 'Summary Statistics',
        id: 'summary-stats'
    },
    {
        name: 'Risk Monitor',
        id: 'risk-monitor'
    },
    {
        name: 'Performance Monitor',
        id: 'performance-monitor'
    }
]

const StatsPage = () => {
    const configState = useGlobalState()
    const { config, state: { reservedFunds } } = configState
    const state = useGlobalData()
    const { data: { metricsData, isSyncing }, actions: { updateAllData } } = state
    const { activeDealCount, totalInDeals, maxRisk, totalBankroll, position, on_orders, totalProfit, totalBoughtVolume, reservedFundsTotal, maxRiskPercent, totalDeals, boughtVolume, totalProfit_perf, averageDailyProfit, averageDealHours } = metricsData

    const [currentView, changeView] = useState('summary-stats')
    const date: undefined | number = dotProp.get(config, 'statSettings.startDate')

    // const account_id = findAccounts(config, 'statSettings.account_id')


    const returnAccountNames = () => {
        if (reservedFunds.length > 0) {
            // @ts-ignore
            return reservedFunds.filter(account => account.is_enabled).map(account => account.account_name).join(', ')
        } else {
            return "n/a"
        }
    }

    const returnCurrencyValues = () => {
        const currencyValues: string[] | undefined = dotProp.get(config, 'general.defaultCurrency')
        if (currencyValues != undefined && currencyValues.length > 0) {
            // @ts-ignore
            return currencyValues.join(', ')
        } else {
            return "n/a"
        }
    }

    // this needs to stay on this page
    const viewChanger = (newView: string) => {
        changeView(newView)
    }
    // this needs to stay on this page
    const currentViewRender = () => {
        if (currentView === 'risk-monitor') {
            return <RiskMonitor key="riskmonitor"
            />
        } else if (currentView === 'performance-monitor') {
            return <PerformanceMonitor key="perfmonitor"

            />
        }

        return <SummaryStatistics key="summaryStats"

        />
    }

    const additionalMetrics = () => {
        if (currentView === 'performance-monitor') {
            return (
            <>
                <Card_TotalBoughtVolume metric={boughtVolume} />
                <Card_TotalDeals metric={totalDeals} />
                <Card_TotalRoi additionalData={{ totalProfit_perf, boughtVolume }} />
                <Card_AverageDailyProfit metric={averageDailyProfit} />
                <Card_AverageDealHours metric={averageDealHours} />
            </>)
        }
    }

    const dateString = (date: undefined | number) => {

        if(date != undefined){
            const adjustedTime = date + ( (new Date()).getTimezoneOffset() * 60000 )
            const dateString = new Date(adjustedTime).toUTCString()
            return new Date(dateString).toLocaleString(lang, { month: '2-digit', day: '2-digit', year: 'numeric' })
        }

        return ""
        
    }


    return (
        <>
            <div className="flex-row statHeaderRow">
                <div className="flex-row menuButtons">
                    {/* This needs to be it's own div to prevent the buttons from taking on the flex properties. */}
                    <div>
                        <ButtonGroup aria-label="outlined primary button group" disableElevation disableRipple>
                            {
                                buttonElements.map(button => {
                                    if (button.id === currentView) return <Button onClick={() => viewChanger(button.id)} className="primaryButton-outline">{button.name}</Button>
                                    return <Button className="secondaryButton-outline" key={button.id} onClick={() => viewChanger(button.id)} >{button.name}</Button>

                                })
                            }
                        </ButtonGroup>
                        <UpdateDataButton className="CtaButton" style={{ margin: "auto", height: "36px", marginLeft: "15px", padding: "5px 15px" }} />
                        
                    </div>
                </div>

                <div className="flex-row filters" >
                    <p><strong>Account: </strong><br/>{returnAccountNames()}</p>
                    <p><strong>Start Date: </strong><br/>{dateString(date)} </p>
                    <p><strong>Default Currency: </strong><br/>{returnCurrencyValues()}</p>
                </div>

            </div>




            <div className="flex-column" style={{ alignItems: 'center' }}>

                <div className="riskDiv">
                    <Card_ActiveDeals metric={activeDealCount} />
                    <Card_totalInDeals metric={totalInDeals} additionalData={{ on_orders, totalBoughtVolume }} />
                    <Card_MaxDca metric={maxRisk} />
                    <Card_MaxRiskPercent metric={maxRiskPercent} additionalData={{totalBankroll, maxDCA: maxRisk}} />
                    <Card_TotalBankRoll metric={totalBankroll} additionalData={{ position, totalBoughtVolume, reservedFundsTotal }} />
                    <Card_TotalProfit metric={totalProfit} />
                    {additionalMetrics()}
                </div>

            </div>


            {/* // Returning the current view rendered in the function above. */}
            {currentViewRender()}
            

        </>

    )
}



export default StatsPage;