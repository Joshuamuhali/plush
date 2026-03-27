import { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Download,
  Eye,
  Plus,
  User,
  Shield,
} from 'lucide-react';
import { useSellerKYC } from '@/hooks/useSellerKYC';

interface DocumentItem {
  id: string;
  type: string;
  name: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  uploadDate: string;
  reviewNotes?: string;
}

export default function KYCPage() {
  const { kycStatus, documents, isKYCComplete, uploadDocument, deleteDocument, getDocumentProgress } = useSellerKYC();
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploading(true);

    try {
      await uploadDocument(file, documentType as any);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset input
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'under_review': return Clock;
      case 'rejected': return AlertCircle;
      default: return FileText;
    }
  };

  const requiredDocuments = [
    { type: 'id_card', name: 'ID Card (NRC/Passport)', description: 'Government-issued identification' },
    { type: 'title_deed', name: 'Property Title Deed', description: 'Proof of property ownership' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Center</h1>
        <p className="text-gray-600">Complete your verification to unlock all seller features</p>
      </div>

      {/* Verification Status Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Status</h2>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full font-medium ${
                isKYCComplete() 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {kycStatus?.kyc_status?.replace('_', ' ').toUpperCase() || 'NOT STARTED'}
              </div>
              <div className="text-sm text-gray-500">
                {getDocumentProgress().toFixed(0)}% Complete
              </div>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${
            isKYCComplete() ? 'bg-green-100' : 'bg-yellow-100'
          }`}>
            {isKYCComplete() ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Verification Progress</span>
            <span>{getDocumentProgress().toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getDocumentProgress()}%` }}
            />
          </div>
        </div>

        {!isKYCComplete() && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm">
              Complete all required document uploads to fully verify your seller account.
            </p>
          </div>
        )}
      </div>

      {/* Required Documents */}
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Required Documents</h2>
        
        <div className="space-y-6">
          {requiredDocuments.map((doc) => {
            const uploadedDoc = documents.find(d => d.document_type === doc.type);
            const StatusIcon = getStatusIcon(uploadedDoc?.status || 'pending');
            
            return (
              <div key={doc.type} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.description}</p>
                  </div>
                  {uploadedDoc && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(uploadedDoc.status)}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {uploadedDoc.status.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {uploadedDoc ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Uploaded: {uploadedDoc.document_name}</span>
                      <span className="text-gray-500">
                        {new Date(uploadedDoc.upload_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {uploadedDoc.review_notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">
                          <strong>Review Notes:</strong> {uploadedDoc.review_notes}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteDocument(uploadedDoc.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload {doc.name}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        PDF, JPG, PNG up to 10MB
                      </p>
                      <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Choose File'}
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(e, doc.type)}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
