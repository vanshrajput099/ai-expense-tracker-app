"use client"
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from '@/components/ui/button';
import { Check, Pencil, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import useFetch from '@/hooks/useFetch';
import { updateBudget } from '@/app/actions/budget';
import { toast } from 'sonner';
import colors from '@/colors';


const BudgetProgress = ({ initialBudget, currentExpenses }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(initialBudget?.amount.toString() || "");

    const percentageUsed = initialBudget ? (currentExpenses / initialBudget.amount) * 100 : 0;

    const { data, loading, fn, error } = useFetch(updateBudget);

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        await fn(amount);
    }

    useEffect(() => {
        if (data && !loading) {
            toast.success("Budget Updated Successfully !!");
            setIsEditing(false);
        }
    }, [data, loading])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Error while updating or creating the budget");
        }
    }, [error])

    const handleCancel = () => {
        setNewBudget(initialBudget?.amount.toString() || "");
        setIsEditing(false);
    }

    return (
        <Card style={{ background: colors.cardBase, border: `1px solid ${colors.border}` }}>
            <CardHeader>
                <CardTitle style={{ color: colors.textPrimary }}>Monthly Budget (Default Account)</CardTitle>
                <div>
                    {
                        isEditing ? (
                            <div className='flex w-1/6 gap-2'>
                                <Input placeholder="Enter the budget" disabled={loading} type={"number"} value={newBudget} onChange={(e) => { setNewBudget(e.target.value) }} />
                                <Button disabled={loading} onClick={handleUpdateBudget} variant={'ghost'} size={'icon'}>
                                    <Check className='text-green-600' />
                                </Button>
                                <Button disabled={loading} onClick={handleCancel} variant={'ghost'} size={'icon'}>
                                    <X className='text-red-600' />
                                </Button>
                            </div>
                        ) :
                            <>
                                <CardDescription style={{ color: colors.textSecondary }} className={'flex gap-2 items-center'}>
                                    {
                                        initialBudget ? `$${currentExpenses.toFixed(2)} of ${initialBudget.amount.toFixed(2)} spent`
                                            :
                                            "No budget set"
                                    }
                                    <Button variant={'ghost'} onClick={() => setIsEditing(true)} size={'icon'}>
                                        <Pencil />
                                    </Button>
                                </CardDescription>
                            </>
                    }
                </div>
            </CardHeader>
            <CardContent>
                <Progress
                    value={percentageUsed}
                    progressValue={percentageUsed}
                />
                <div style={{ color: colors.textSecondary }} className='flex justify-end text-muted-foreground mt-1'>
                    {percentageUsed.toFixed(1)}% used
                </div>
            </CardContent>
        </Card>
    )
}

export default BudgetProgress