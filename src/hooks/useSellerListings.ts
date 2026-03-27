import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface SellerListing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  type: 'house' | 'apartment' | 'plot' | 'commercial';
  location: string;
  price: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  images: string[];
  status: 'draft' | 'submitted' | 'approved' | 'active' | 'paused' | 'sold' | 'archived';
  verification_status: 'pending' | 'submitted' | 'approved' | 'rejected';
  views: number;
  saves: number;
  inquiries: number;
  offers: number;
  created_at: string;
  updated_at: string;
}

export function useSellerListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchListings();
  }, [user]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('seller_listings')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setListings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (listingData: Omit<SellerListing, 'id' | 'seller_id' | 'created_at' | 'updated_at' | 'views' | 'saves' | 'inquiries' | 'offers'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('seller_listings')
        .insert({
          ...listingData,
          seller_id: user?.id,
          views: 0,
          saves: 0,
          inquiries: 0,
          offers: 0,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      setListings(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create listing');
    }
  };

  const updateListing = async (id: string, updates: Partial<SellerListing>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('seller_listings')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('seller_id', user?.id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setListings(prev => prev.map(listing => 
        listing.id === id ? data : listing
      ));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update listing');
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('seller_listings')
        .delete()
        .eq('id', id)
        .eq('seller_id', user?.id);

      if (deleteError) throw deleteError;
      
      setListings(prev => prev.filter(listing => listing.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete listing');
    }
  };

  const updateListingStatus = async (id: string, status: SellerListing['status']) => {
    return updateListing(id, { status });
  };

  return {
    listings,
    loading,
    error,
    fetchListings,
    createListing,
    updateListing,
    deleteListing,
    updateListingStatus,
  };
}
