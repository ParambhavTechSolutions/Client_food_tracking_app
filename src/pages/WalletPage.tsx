import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockUser, mockTransactions } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpRight, ArrowDownLeft, RotateCcw, AlertTriangle, Wallet, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { WalletTransaction } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const quickAmounts = [500, 1000, 2000, 5000];

export default function WalletPage() {
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
  const [customAmount, setCustomAmount] = useState('');
  const isLowBalance = mockUser.walletBalance < 300;

  const getTransactionIcon = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'credit':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case 'debit':
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case 'refund':
        return <RotateCcw className="h-4 w-4 text-info" />;
    }
  };

  const getTransactionColor = (type: WalletTransaction['type']) => {
    switch (type) {
      case 'credit':
        return 'text-success';
      case 'debit':
        return 'text-destructive';
      case 'refund':
        return 'text-info';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-lg mx-auto">
        {/* Header */}
        <header className="pt-2 safe-top">
          <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
        </header>

        {/* Balance Card */}
        <div className="wallet-card rounded-2xl p-6 text-primary-foreground shadow-elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-primary-foreground/20 p-3">
              <Wallet className="h-6 w-6" />
            </div>
            <span className="text-primary-foreground/80 font-medium">Available Balance</span>
          </div>
          
          <div className="text-4xl font-bold mb-6">
            ₹{mockUser.walletBalance.toLocaleString()}
          </div>

          {isLowBalance && (
            <div className="flex items-center gap-2 rounded-lg bg-warning/20 px-4 py-3 mb-4">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Low Balance Warning</p>
                <p className="text-xs text-primary-foreground/70">
                  Add money to avoid delivery interruption
                </p>
              </div>
            </div>
          )}

          <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="w-full gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Plus className="h-5 w-5" />
                Add Money
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-4">
              <DialogHeader>
                <DialogTitle>Add Money to Wallet</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                {/* Quick Amounts */}
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={cn(
                        'py-3 rounded-xl font-medium transition-smooth',
                        selectedAmount === amount && !customAmount
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      )}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Or enter custom amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(null);
                      }}
                      className="pl-8 h-12 text-lg"
                    />
                  </div>
                </div>

                {/* Amount Summary */}
                <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount to add</span>
                    <span className="font-medium">
                      ₹{(customAmount ? parseInt(customAmount) : selectedAmount) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">New balance</span>
                    <span className="font-semibold text-success">
                      ₹{mockUser.walletBalance + ((customAmount ? parseInt(customAmount) : selectedAmount) || 0)}
                    </span>
                  </div>
                </div>

                <Button className="w-full h-12 text-lg" size="lg">
                  Proceed to Pay
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Upcoming Delivery Warning */}
        {isLowBalance && (
          <div className="card-elevated p-4 border-l-4 border-warning">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Upcoming Delivery: Tomorrow</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You need ₹150 for tomorrow's delivery. Add money now to avoid interruption.
                </p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setIsAddMoneyOpen(true)}>
                  Add ₹500
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-primary">
              View All
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-card transition-smooth hover:shadow-soft"
              >
                <div className={cn(
                  'rounded-full p-2',
                  transaction.type === 'credit' && 'bg-success/10',
                  transaction.type === 'debit' && 'bg-destructive/10',
                  transaction.type === 'refund' && 'bg-info/10'
                )}>
                  {getTransactionIcon(transaction.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(transaction.date, 'MMM d, h:mm a')}
                  </p>
                </div>

                <span className={cn('font-semibold', getTransactionColor(transaction.type))}>
                  {transaction.type === 'debit' ? '-' : '+'}₹{transaction.amount}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
