"use client"
import React, { useEffect, useMemo, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select'
import { Checkbox } from "@/components/ui/checkbox"
import { format } from 'date-fns'
import { categoryColors } from '@/data/categories'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Clock, Loader2, MoreHorizontal, MoveRight, Search, Trash } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import useFetch from '@/hooks/useFetch'
import { toast } from 'sonner'
import { BarLoader } from 'react-spinners'
import { bulkDeleteTransactions } from '@/app/actions/accounts'
import { MoveLeft } from 'lucide-react';
import colors from '@/colors'

const TransactionTable = ({ transactions }) => {

    const router = useRouter();

    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");
    const [pageArrayLength, setPageArrayLength] = useState(Math.ceil(transactions.length / 10));
    const [tablePageIndex, setTablePageIndex] = useState(0);
    const [pageArray, setPageArray] = useState([])
    const maxArrLength = 10;

    const { data, loading, fn, error } = useFetch(bulkDeleteTransactions);

    useEffect(() => {
        const newPageArray = Array.from({ length: pageArrayLength }, (_, index) => index);
        setPageArray(newPageArray);
    }, [pageArrayLength]);

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are your sure want to delete ${selectedTransactions.length} transactions ?`)) {
            return;
        }
        await fn(selectedTransactions);
        setSelectedTransactions([]);
    }

    useEffect(() => {
        if (data && !loading) {
            toast.success("Transactions deleted succesfully !!");
        }
    }, [loading, data])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Error occured while deleting transactions.");
        }
    }, [error])

    const [sortConfig, setSortConfig] = useState({
        field: 'date',
        direction: 'desc'
    })

    const filteredAndSortedTransactions = useMemo(() => {

        let result = [...transactions];

        if (searchTerm) {
            const seachLower = searchTerm.toLowerCase();
            result = result.filter((transaction) => transaction.description?.toLowerCase().includes(seachLower));
            setPageArrayLength(Math.ceil(result.length / 10));
        }

        if (recurringFilter) {
            result = result.filter((transaction) => {
                if (recurringFilter === "recurring") {
                    return transaction.isRecurring;
                }
                return !transaction.isRecurring;
            });
            setPageArrayLength(Math.ceil(result.length / 10));
        }

        if (typeFilter) {
            result = result.filter((transaction) => transaction.type === typeFilter);
            setPageArrayLength(Math.ceil(result.length / 10));
        }

        result = result.slice(
            tablePageIndex * maxArrLength,
            (tablePageIndex + 1) * maxArrLength
        );

        result.sort((a, b) => {
            let comparison = 0;
            switch (sortConfig.field) {
                case "date":
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case "amount":
                    comparison = a.amount - b.amount;
                    break;
                case "category":
                    comparison = a.category.localeCompare(b.category);
                    break;
                default:
                    comparison = 0;
                    break;
            }

            return sortConfig.direction === "asc" ? comparison : -comparison;
        })
        return result;
    }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig, tablePageIndex]);

    const handleClearFilter = () => {
        setRecurringFilter("");
        setSearchTerm("");
        setTypeFilter("");
        setSelectedTransactions([]);
    }

    const handleSort = (field) => {
        setSortConfig((prev) => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }))
        setTablePageIndex(0);
    }

    const handleSelect = (id) => {
        setSelectedTransactions(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    };

    const handleSelectAll = () => {
        setSelectedTransactions(current => current.length === filteredAndSortedTransactions.length ? [] : filteredAndSortedTransactions.map((t) => t.id));
    };

    return (
        <>
            <div className='w-full flex justify-center'>
                <div className='w-5/6 flex gap-2 justify-center items-center'>
                    {
                        tablePageIndex > 0 && <MoveLeft onClick={() => { setTablePageIndex((oldValue) => oldValue - 1) }} className='hover:cursor-pointer' color='white' />
                    }
                    {
                        pageArray.map((ele, idx) => {
                            return <div onClick={() => { setTablePageIndex(ele) }} className='text-white px-4 py-1 font-bold hover:cursor-pointer max-lg:text-sm max-lg:px-0'>{ele + 1}</div>
                        })
                    }
                    {
                        tablePageIndex !== pageArrayLength - 1 && <MoveRight onClick={() => { setTablePageIndex((oldValue) => oldValue + 1) }} className='hover:cursor-pointer' color='white' />
                    }
                </div>
            </div>

            <div className='w-full flex justify-center mt-5'>

                <div className='w-5/6'>
                    {loading && <BarLoader width={'100%'} className='mb-2' />}
                    <div className='flex gap-3'>

                        <div className='relative flex-1 rounded-xl'>
                            <Search size={'15'} className='absolute left-2 top-2.5 text-muted-foreground' />
                            <Input onChange={(e) => { setSearchTerm(e.target.value) }} placeholder={'Search Transactions...'} className={'pl-7'} />
                        </div>

                        <div className='flex gap-2'>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[130px] text-white">
                                    <SelectValue placeholder="All Types" className="text-white" />
                                </SelectTrigger>
                                <SelectContent className="text-white bg-gray-800">
                                    <SelectItem value="INCOME" className="text-white">Income</SelectItem>
                                    <SelectItem value="EXPENSE" className="text-white">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={recurringFilter} onValueChange={setRecurringFilter}>
                                <SelectTrigger className="w-[130px] text-white">
                                    <SelectValue placeholder="All Transactions" className="text-white" />
                                </SelectTrigger>
                                <SelectContent className="text-white bg-gray-800">
                                    <SelectItem value="recurring" className="text-white">Recurring</SelectItem>
                                    <SelectItem value="non-recurring" className="text-white">Non-Recurring</SelectItem>
                                </SelectContent>
                            </Select>
                            {
                                selectedTransactions.length > 0 ?
                                    <Button onClick={handleBulkDelete} variant={'destructive'} disabled={loading}>
                                        {loading ?
                                            <> <Loader2 className='animate-spin' /> Deleting... </>
                                            :
                                            <> <Trash /> Delete Selected ({selectedTransactions.length})</>
                                        }
                                    </Button>
                                    : null
                            }
                            {
                                [typeFilter, recurringFilter, searchTerm].some((ele) => ele.trim() !== "") ?
                                    <Button variant={'outline'} onClick={handleClearFilter}>X</Button>
                                    : null
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-5 pb-15'>
                <Table style={{ background: colors.cardBase, border: `1px solid ${colors.border}`, color: colors.textPrimary }} className={'w-5/6 mx-auto border text-white'}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox onCheckedChange={handleSelectAll} checked={selectedTransactions.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0} />
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                                <div className='flex items-center text-white'>Date
                                    {sortConfig.field === 'date' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp /> : <ChevronDown />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead>
                                <div className='flex items-center text-white'>Description</div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                                <div className='flex items-center text-white'>Category</div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                                <div className='flex items-center text-white'>Amount
                                    {sortConfig.field === 'amount' && (
                                        sortConfig.direction === 'asc' ? <ChevronUp /> : <ChevronDown />
                                    )}
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("recurring")}>
                                <div className='flex items-center text-white'>Recurring</div>
                            </TableHead>
                            <TableHead className="w-[50px]" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filteredAndSortedTransactions.length === 0 ?
                                <TableRow>
                                    <TableCell colSpan={7} className="font-medium">No Transactions Found</TableCell>
                                </TableRow> :
                                filteredAndSortedTransactions.map((transaction, index) => {
                                    return (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">
                                                <Checkbox
                                                    onCheckedChange={() => handleSelect(transaction.id)}
                                                    checked={selectedTransactions.includes(transaction.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{format(new Date(transaction.date), "PP")}</TableCell>
                                            <TableCell>{transaction.description}</TableCell>
                                            <TableCell className={'capitalize'}>
                                                <span className='px-2 py-1 text-white rounded-md text-sm' style={{ background: categoryColors[transaction.category] }}>
                                                    {transaction.category}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-medium" style={{ color: transaction.type === "EXPENSE" ? "red" : "green" }}>
                                                {transaction.type === 'EXPENSE' ? '-' : ''}
                                                ${transaction.amount.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                {transaction.isRecurring ?
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Badge variant={'outline'} className={'flex gap-2 text-white'}> <Clock /> Recurring</Badge>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{transaction.recurringInterval}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    :
                                                    <Badge variant={'outline'} className={'flex gap-2 text-white'}> <Clock /> One-Time</Badge>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger>
                                                        <Button variant={'ghost'}>
                                                            <MoreHorizontal />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={async () => {
                                                            if (window.confirm("Are you sure you want to delete this transaction?")) {
                                                                await fn([transaction.id]);
                                                            }
                                                        }} className={'text-destructive'}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                        }
                    </TableBody>
                </Table>
            </div>

        </>
    )
}

export default TransactionTable
