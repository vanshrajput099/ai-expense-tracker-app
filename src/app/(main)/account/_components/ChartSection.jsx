"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useMemo, useState } from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import colors from "@/colors";

const DATE_RANGES = {
    "7D": { label: "Last 7 Days", days: 7 },
    "1M": { label: "Last Month", days: 30 },
    "3M": { label: "Last 3 Months", days: 90 },
    "6M": { label: "Last 6 Months", days: 180 },
    ALL: { label: "All Time", days: null },
}

const ChartSection = ({ transactions }) => {

    const [dateRange, setDateRange] = useState("1M");
    const filteredData = useMemo(() => {
        const range = DATE_RANGES[dateRange];
        const now = new Date();
        const startDate = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));

        const filtered = transactions.filter((tx) => new Date(tx.date) >= startDate && new Date(tx.date) <= endOfDay(now));

        const grouped = filtered.reduce((acc, transactions) => {
            const date = format(new Date(transactions.date), "MMM dd");

            if (!acc[date]) {
                acc[date] = { date, income: 0, expense: 0 };
            }

            if (transactions.type === "INCOME") {
                acc[date].income += transactions.amount;
            } else {
                acc[date].expense += transactions.amount;
            }

            return acc;
        }, {})

        return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [transactions, dateRange]);

    const totals = useMemo(() => {
        return filteredData.reduce((acc, day) => ({
            income: acc.income + day.income,
            expense: acc.expense + day.expense
        }))
    }, [])

    return (
        <div style={{ width: '100%', height: 400 }}>
            <div className="flex justify-center">
                <div className="w-5/6 max-lg:w-[95%]">
                    <Card style={{ background: colors.cardBase, border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className={'text-2xl font-bold max-lg:text-xl'}>Transaction Overview</CardTitle>
                                <Select defaultValue={dateRange} onValueChange={setDateRange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            Object.entries(DATE_RANGES).map((data, index) => {
                                                return <SelectItem key={index} value={data[0]}>{data[1].label}</SelectItem>
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-around">
                                <div className="text-center">
                                    <p className="text-muted-foreground">Total Income</p>
                                    <p className="text-green-600 text-lg font-bold">$ {totals.income.toFixed(2)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground">Total Expense</p>
                                    <p className="text-red-600 text-lg font-bold">$ {totals.expense.toFixed(2)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground">Net</p>
                                    <p className={`${totals.income.toFixed(2) - totals.expense.toFixed(2) < 0 ? "text-red-600" : "text-green-600"} text-lg font-bold`}>$ {(totals.income.toFixed(2) - totals.expense.toFixed(2)).toFixed(2)}</p>
                                </div>
                            </div>
                        </CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={filteredData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: 10,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" />
                                    <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, undefined]} />
                                    <Legend />
                                    <Bar name={"Income"} dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    <Bar name={"Expense"} dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>

        </div>
    )
}

export default ChartSection