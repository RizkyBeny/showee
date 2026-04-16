"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/services/api";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function WithdrawPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const [wData, eData] = await Promise.all([
        api.getWithdrawals(),
        api.getEvents()
      ]);
      const totalRevenue = eData.reduce((acc, ev) => 
        acc + ev.tickets.reduce((tAcc, tk) => tAcc + (tk.price * tk.sold), 0)
     , 0);
   
     const withdrawnAmount = wData
        .filter(w => w.status === 'completed' || w.status === 'pending')
        .reduce((acc, w) => acc + w.amount, 0);
   
     setAvailableBalance(totalRevenue - withdrawnAmount);
    };
    fetchBalance();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const fd = new FormData(e.currentTarget);
    const amountStr = fd.get("amount") as string;
    const amount = parseInt(amountStr.replace(/\D/g, ''), 10);
    const bankName = fd.get("bankName") as string;
    const accountNumber = fd.get("accountNumber") as string;

    if (amount > availableBalance) {
        toast.error("Requested amount exceeds available balance");
        return;
    }
    if (amount < 50000) {
        toast.error("Minimum withdrawal amount is Rp 50.000");
        return;
    }

    setIsLoading(true);
    try {
        await api.requestWithdrawal({ amount, bankName, accountNumber });
        toast.success("Withdrawal request submitted successfully!");
        router.push("/finance");
    } catch {
        toast.error("Failed to process withdrawal");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <Card>
         <CardHeader>
            <CardTitle>Request Withdrawal</CardTitle>
            <CardDescription>Transfer your funds to your bank account.</CardDescription>
         </CardHeader>
         <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                    <span className="text-sm font-medium">Available Balance</span>
                    <span className="text-xl font-bold text-primary">Rp {availableBalance.toLocaleString('id-ID')}</span>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amount">Amount to Withdraw</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground font-medium">Rp</span>
                        <Input id="amount" name="amount" type="number" min="50000" max={availableBalance} className="pl-9 font-medium" placeholder="0" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select name="bankName" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a bank" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BCA">BCA - Bank Central Asia</SelectItem>
                            <SelectItem value="Mandiri">Bank Mandiri</SelectItem>
                            <SelectItem value="BNI">BNI - Bank Negara Indonesia</SelectItem>
                            <SelectItem value="BRI">BRI - Bank Rakyat Indonesia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input id="accountNumber" name="accountNumber" placeholder="e.g. 1234567890" required />
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading || availableBalance < 50000}>
                    {isLoading ? "Processing..." : "Submit Request"}
                </Button>
            </CardFooter>
         </form>
      </Card>
    </div>
  );
}
