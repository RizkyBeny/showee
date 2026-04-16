"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { Withdrawal, EventData } from "@/types";
import { Wallet, ArrowUpRight, ArrowDownToLine, Clock } from "lucide-react";

export default function FinancePage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [wData, eData] = await Promise.all([
        api.getWithdrawals(),
        api.getEvents()
      ]);
      setWithdrawals(wData);
      setEvents(eData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const totalRevenue = events.reduce((acc, ev) => 
     acc + ev.tickets.reduce((tAcc, tk) => tAcc + (tk.price * tk.sold), 0)
  , 0);

  const withdrawnAmount = withdrawals
     .filter(w => w.status === 'completed' || w.status === 'pending')
     .reduce((acc, w) => acc + w.amount, 0);

  const availableBalance = totalRevenue - withdrawnAmount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
        <p className="text-muted-foreground">Manage your revenue and withdrawals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Available Balance
              <Wallet className="w-4 h-4 opacity-70" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Rp {availableBalance.toLocaleString('id-ID')}</div>
            <Link href="/finance/withdraw" className="block w-full mt-4">
               <Button variant="secondary" className="w-full text-primary">Request Withdrawal</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Revenue
              <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime earnings from all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Withdrawn
              <ArrowDownToLine className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {withdrawnAmount.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground mt-1">Include pending requests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Past withdrawal requests and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bank Account</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Loading...</TableCell>
                  </TableRow>
              ) : withdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No withdrawal history found.</TableCell>
                  </TableRow>
              ) : withdrawals.map(w => (
                 <TableRow key={w.id}>
                    <TableCell>{new Date(w.requestedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">Rp {w.amount.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{w.bankName} - {w.accountNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        w.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                        w.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'
                      }>
                        {w.status === 'pending' && <Clock className="w-3 h-3 mr-1 inline" />}
                        {w.status}
                      </Badge>
                    </TableCell>
                 </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
