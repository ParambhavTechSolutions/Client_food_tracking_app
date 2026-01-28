import { Wallet, Plus, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface WalletCardProps {
  balance: number;
  isLow?: boolean;
}

export function WalletCard({ balance, isLow = false }: WalletCardProps) {
  return (
    <Link to="/wallet" className="block">
      <div className="wallet-card rounded-2xl p-4 text-primary-foreground shadow-soft">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary-foreground/20 p-2">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-primary-foreground/80">Wallet Balance</span>
          </div>
          <button className="rounded-full bg-primary-foreground/20 p-2 transition-smooth hover:bg-primary-foreground/30">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-3">
          <span className="text-3xl font-bold">₹{balance.toLocaleString()}</span>
        </div>

        {isLow && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning/20 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-xs font-medium">Low balance - Add money for uninterrupted deliveries</span>
          </div>
        )}
      </div>
    </Link>
  );
}
