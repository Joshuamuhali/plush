import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface SellerDocument {
  id: string;
  seller_id: string;
  document_type: 'id_card' | 'passport' | 'title_deed' | 'proof_of_ownership' | 'utility_bill' | 'other';
  document_url: string;
  document_name: string;
  upload_date: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  review_notes?: string;
  expiry_date?: string;
}

export interface SellerKYCStatus {
  kyc_status: 'not_started' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  required_documents: string[];
  uploaded_documents: SellerDocument[];
  verification_score: number;
  last_updated: string;
}

export function useSellerKYC() {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState<SellerKYCStatus | null>(null);
  const [documents, setDocuments] = useState<SellerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchKYCStatus();
    fetchDocuments();
  }, [user]);

  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('kyc_status, verification_score, updated_at')
        .eq('id', user?.id)
        .single();

      if (fetchError) throw fetchError;

      setKycStatus({
        kyc_status: data?.kyc_status || 'not_started',
        required_documents: ['id_card', 'title_deed'],
        uploaded_documents: [],
        verification_score: data?.verification_score || 0,
        last_updated: data?.updated_at || new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch KYC status');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('seller_documents')
        .select('*')
        .eq('seller_id', user?.id)
        .order('upload_date', { ascending: false });

      if (fetchError) throw fetchError;
      setDocuments(data || []);

      // Update KYC status with uploaded documents
      if (kycStatus) {
        setKycStatus(prev => prev ? {
          ...prev,
          uploaded_documents: data || [],
        } : null);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const uploadDocument = async (file: File, documentType: SellerDocument['document_type']) => {
    try {
      // Upload file to Supabase storage
      const fileName = `${user?.id}/${documentType}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('seller-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('seller-documents')
        .getPublicUrl(fileName);

      // Save document record
      const { data, error: insertError } = await supabase
        .from('seller_documents')
        .insert({
          seller_id: user?.id,
          document_type: documentType,
          document_url: publicUrl,
          document_name: file.name,
          status: 'pending',
          upload_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setDocuments(prev => [data, ...prev]);
      
      // Update KYC status if all required documents are uploaded
      await updateKYCStatus();
      
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to upload document');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      // Delete from database
      const { error: deleteError } = await supabase
        .from('seller_documents')
        .delete()
        .eq('id', id)
        .eq('seller_id', user?.id);

      if (deleteError) throw deleteError;

      setDocuments(prev => prev.filter(doc => doc.id !== id));
      await updateKYCStatus();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  const updateKYCStatus = async () => {
    try {
      const currentDocuments = await supabase
        .from('seller_documents')
        .select('document_type')
        .eq('seller_id', user?.id);

      const uploadedTypes = currentDocuments.data?.map(doc => doc.document_type) || [];
      const requiredTypes = ['id_card', 'title_deed'];
      
      let newStatus: SellerKYCStatus['kyc_status'] = 'not_started';
      if (uploadedTypes.length > 0) {
        newStatus = uploadedTypes.length >= requiredTypes.length ? 'submitted' : 'submitted';
      }

      await supabase
        .from('profiles')
        .update({ 
          kyc_status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      await fetchKYCStatus();
    } catch (err) {
      console.error('Failed to update KYC status:', err);
    }
  };

  const getDocumentProgress = () => {
    if (!kycStatus) return 0;
    return (kycStatus.uploaded_documents.length / kycStatus.required_documents.length) * 100;
  };

  const isKYCComplete = () => {
    if (!kycStatus) return false;
    return kycStatus.kyc_status === 'approved';
  };

  return {
    kycStatus,
    documents,
    loading,
    error,
    fetchKYCStatus,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    updateKYCStatus,
    getDocumentProgress,
    isKYCComplete,
  };
}
