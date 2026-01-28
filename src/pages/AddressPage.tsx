import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockAddresses, mockDeliverySlots } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Plus, Check, Home, Briefcase, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Address, DeliverySlot } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AddressPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(
    mockDeliverySlots.find((s) => s.isAvailable) || null
  );
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const getAddressIcon = (label: string) => {
    if (label.toLowerCase().includes('home')) return Home;
    if (label.toLowerCase().includes('office') || label.toLowerCase().includes('work')) return Briefcase;
    return MapPin;
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-4 max-w-lg mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 pt-2 safe-top">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Addresses</h1>
            <p className="text-sm text-muted-foreground">Manage delivery locations</p>
          </div>
        </header>

        {/* Address List */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Saved Addresses
          </h2>
          
          {addresses.map((address) => {
            const Icon = getAddressIcon(address.label);
            return (
              <div
                key={address.id}
                className={cn(
                  'flex items-start gap-3 p-4 rounded-xl transition-smooth',
                  address.isDefault ? 'bg-primary/5 ring-2 ring-primary' : 'bg-card hover:bg-secondary/50'
                )}
              >
                <div
                  className={cn(
                    'rounded-lg p-2',
                    address.isDefault ? 'bg-primary/10' : 'bg-secondary'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      address.isDefault ? 'text-primary' : 'text-foreground'
                    )}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{address.label}</p>
                    {address.isDefault && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {address.fullAddress}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    {!address.isDefault && (
                      <DropdownMenuItem onClick={() => handleSetDefault(address.id)}>
                        <Check className="h-4 w-4 mr-2" />
                        Set as Default
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}

          <Button
            variant="outline"
            className="w-full gap-2 border-dashed"
            onClick={() => setShowAddAddress(true)}
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        </section>

        {/* Delivery Slots */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Preferred Delivery Time
          </h2>

          <div className="space-y-2">
            {mockDeliverySlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.isAvailable && setSelectedSlot(slot)}
                disabled={!slot.isAvailable}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-xl transition-smooth text-left',
                  selectedSlot?.id === slot.id && 'bg-primary/5 ring-2 ring-primary',
                  selectedSlot?.id !== slot.id && slot.isAvailable && 'bg-card hover:bg-secondary/50',
                  !slot.isAvailable && 'bg-muted opacity-50 cursor-not-allowed'
                )}
              >
                <div>
                  <p className="font-medium text-foreground">{slot.label}</p>
                  <p className="text-sm text-muted-foreground">{slot.timeRange}</p>
                </div>
                {selectedSlot?.id === slot.id && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                {!slot.isAvailable && (
                  <span className="text-xs text-muted-foreground">Unavailable</span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Add Address Dialog */}
        <Dialog open={showAddAddress} onOpenChange={setShowAddAddress}>
          <DialogContent className="max-w-sm mx-4">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Label</label>
                <Input
                  placeholder="e.g., Home, Office, Gym"
                  value={newAddressLabel}
                  onChange={(e) => setNewAddressLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Address</label>
                <Input
                  placeholder="Enter complete address with landmark"
                  value={newAddressText}
                  onChange={(e) => setNewAddressText(e.target.value)}
                />
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Use current location
                </span>
              </div>
              <Button className="w-full" disabled={!newAddressLabel || !newAddressText}>
                Save Address
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
