"use client"

import { updateDefaultAccount } from '@/app/actions/accounts';
import colors from '@/colors';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import useFetch from '@/hooks/useFetch';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

const AccountCard = ({ accountData }) => {

    const { data, loading, fn, error } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (e) => {
        e.preventDefault();
        if (accountData.isDefault) {
            toast.warning("You need atleast 1 default account");
            return;
        }
        await updateDefaultAccount(accountData.id);
    }

    useEffect(() => {
        if (data?.success) {
            toast.success("Default Account updated successfully !!");
        }
    }, [data, loading])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Error while updating default account.");
        }
    }, [error])

    return (
        <Card className="hover:shadow-lg transition-shadow p-4" style={{ background: colors.cardBase, border: `1px solid ${colors.border}`, color: colors.textPrimary }}>
            <div className="flex justify-between items-center">
                <Link href={`account/${accountData.id}`} className="flex-1">
                    <CardHeader>
                        <CardTitle className="font-semibold text-2xl">{accountData.name}</CardTitle>
                    </CardHeader>
                </Link>
                <Switch checked={accountData.isDefault} onClick={handleDefaultChange} disabled={loading} />
            </div>
            <Link href={`account/${accountData.id}`} className="block">
                <CardContent className="mt-2">
                    <div className="font-bold text-3xl">
                        ${parseFloat(accountData.balance).toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">
                        {accountData.type.charAt(0) + accountData.type.slice(1).toLowerCase()} Account
                    </div>
                </CardContent>
                <CardFooter className="mt-2 flex justify-between">
                    <div className="flex items-center font-semibold">
                        <ArrowUpRight className="text-green-500" />
                        Income
                    </div>
                    <div className="flex items-center font-semibold">
                        <ArrowDownRight className="text-red-500" />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    );
};

export default AccountCard;
