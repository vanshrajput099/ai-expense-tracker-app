"use client";
import { scanReceipt } from '@/app/actions/transactions';
import colors from '@/colors';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import { CameraIcon, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';

const AIReciept = ({ onScanComplete }) => {
    const fileInputRef = useRef(null);

    const { loading, data, error, fn } = useFetch(scanReceipt);

    const handleScanReciept = async (file) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5mb");
            return;
        }

        await fn(file);
    }

    useEffect(() => {
        if (data && !loading) {
            onScanComplete(data);
            toast.success("Reciept Scanned Successfully !!");
        }
    }, [data, loading])

    return (
        <div className='w-full'>
            <input ref={fileInputRef} className='hidden' capture="environment" accept='image/*' type="file"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleScanReciept(file);
                }}
            />
            <Button style={{ background: colors.blueAccent }} disabled={loading} className={'w-full'} onClick={() => fileInputRef.current.click()}>
                {loading ?
                    <>
                        <Loader2 className='animate-spin' />
                        <span>Scanning Reciept...</span>
                    </>
                    :
                    <>
                        <CameraIcon />
                        <span>Scan Reciept With AI</span>
                    </>
                }
            </Button>
        </div>
    )
}

export default AIReciept