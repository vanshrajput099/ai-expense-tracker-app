"use client";
import { getUserAccounts } from '@/app/actions/accounts'
import CreateAccountDrawer from '@/components/CreateAccountDrawer';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import useFetch from '@/hooks/useFetch';
import { transactionSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useRouter, useSearchParams } from 'next/navigation';
import { createTransaction, updateTransaction } from '@/app/actions/transactions';
import { toast } from 'sonner';
import AIReciept from './AIReciept';
import colors from '@/colors';


const AddTransactionForm = ({ accounts, categories, editMode = false, initialData = null }) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const { register, setValue, handleSubmit, formState: { errors }, watch, getValues, reset } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: editMode && initialData ?
      {
        type: initialData.type,
        amount: initialData.amount.toString(),
        description: initialData.description,
        accountId: initialData.accountId,
        category: initialData.category,
        date: new Date(initialData.date),
        isRecurring: initialData.isRecurring,
        ...(initialData.recurringInterval && {
          recurringInterval: initialData.recurringInterval,
        }),
      }
      : {
        type: "EXPENSE",
        amount: "",
        description: "",
        accountId: accounts.find((ac) => ac.isDefault)?.id,
        date: new Date(),
        isRecurring: false
      }
  })

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount)
    }

    if (editMode) {
      fn(editId, formData);
    } else {
      await fn(formData)
    }
  }

  const { loading, fn, data } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter((category) => category.type === type)

  useEffect(() => {
    if (data?.success && !loading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${data.data.accountId}`);
    }
  }, [data, loading, editMode]);

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };

  return (
    <div className='w-full text-white'>
      {
        !editMode && <AIReciept onScanComplete={handleScanComplete} />
      }
      <form className='w-full flex flex-col gap-6 mt-5' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-3'>
          <label className='font-bold' htmlFor="">Type</label>
          <Select defaultValue={type} onValueChange={(value) => setValue("type", value)}>
            <SelectTrigger className="w-full" id="type">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
          {
            errors.type && (<p className='text-sm text-red-500'>{errors.type.message}</p>)
          }
        </div>
        <div className='flex justify-between gap-5'>
          <div className='w-1/2 flex flex-col gap-2'>
            <label className='font-bold' htmlFor="">Amount</label>
            <Input type={'number'} placeholder={'0.00'} {...register("amount")} />
            {
              errors.amount && (<p className='text-sm text-red-500'>{errors.amount.message}</p>)
            }
          </div>
          <div className='w-1/2 flex flex-col gap-2'>
            <label className='font-bold' htmlFor="">Account</label>
            <Select defaultValue={getValues("accountId")} onValueChange={(value) => setValue("accountId", value)}>
              <SelectTrigger className="w-full" id="type">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {
                  accounts.map((account) => {
                    return <SelectItem key={account.id} value={account.id}>{account.name} (${parseFloat(account.balance).toFixed(2)})</SelectItem>
                  })
                }
                <CreateAccountDrawer>
                  <Button className={'w-full'} variant={'ghost'}>+ Create Account</Button>
                </CreateAccountDrawer>
              </SelectContent>
            </Select>
            {
              errors.accountId && (<p className='text-sm text-red-500'>{errors.accountId.message}</p>)
            }
          </div>
        </div>
        <div className='w-full flex flex-col gap-2'>
          <label className='font-bold' htmlFor="">Category</label>
          <Select defaultValue={getValues("category")} onValueChange={(value) => setValue("category", value)}>
            <SelectTrigger className="w-full" id="type">
              <SelectValue placeholder="Select your category" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {
                filteredCategories.map((value, index) => <SelectItem key={index} value={value.id}>{value.name}</SelectItem>)
              }
            </SelectContent>
          </Select>
          {
            errors.category && (<p className='text-sm text-red-500'>{errors.category.message}</p>)
          }
        </div>
        <div className='flex flex-col gap-2'>
          <label className='font-bold' htmlFor="">Date</label>
          <Popover className="bg-red-500">
            <PopoverTrigger asChild>
              <Button className={'flex justify-between w-full'} variant={'outline'}>
                {date ? format(date, "PPP") : <span>Pick A Date</span>}
                <CalendarIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                className="rounded-md"
                selected={date}
                onSelect={(date) => setValue("date", date)}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {
            errors.date && (<p className='text-sm text-red-500'>{errors.date.message}</p>)
          }
        </div>
        <div className='flex flex-col gap-2'>
          <label className='font-bold' htmlFor="">Description</label>
          <Input placeholder={'Enter Your Description'} {...register("description")} />
          {
            errors.description && (<p className='text-sm text-red-500'>{errors.description.message}</p>)
          }
        </div>
        <div className={'rounded-sm flex justify-between items-center border px-4 py-2'}>
          <div>
            <h1 className='font-bold'>Recurring Transactions</h1>
            <h2 className='text-muted-foreground'>Set up as recurring schedule for this transaction</h2>
          </div>
          <div>
            <Switch checked={isRecurring} onCheckedChange={(checked) => setValue("isRecurring", checked)} />
          </div>
        </div>
        {
          isRecurring && <div className='flex flex-col gap-2'>
            <label className='font-bold' htmlFor="">Recurring Interval</label>
            <Select defaultValue={getValues("recurringInterval")} onValueChange={(value) => setValue("recurringInterval", value)}>
              <SelectTrigger className="w-full" id="type">
                <SelectValue placeholder="Select Interval" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {
              errors.recurringInterval && (<p className='text-sm text-red-500'>{errors.recurringInterval.message}</p>)
            }
          </div>
        }
        <div className='w-full flex gap-5'>
          <Button type='button' onClick={() => router.back()} variant={'ghost'} className={'w-1/2'}>Cancel</Button>
          <Button type='submit' disabled={loading} className={'w-1/2'} style={{ background: colors.blueAccent, border: `1px solid ${colors.border}` }} >
            {
              loading ?
                <>
                  <Loader2 className='animate-spin' /> {editMode ? "Updating Transaction" : "Creating Transaction"}
                </>
                :
                editMode ? "Update Transaction" : "Create Transaction"
            }
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AddTransactionForm