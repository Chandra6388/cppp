import { getFinalHtml } from '../../../Utils/CommonFunctions'
interface SignatureDetails {
  name: string;
  jobTitle: string;
  company: string;
  email: string;
  phone?: string;
  website?: string;
  layout: string;
  headshot_url?: string;
  buttons?: Array<{
    id: string;
    text: string;
    type: string;
    connect_with: string;
    icon?: any;
    color?: string;
    fontStyle?: string;
  }>;
  [key: string]: any;
}

interface Signature {
  _id: string;
  SignatureName: string;
  templateInfo: { TemplatesName: string };
  createdAt: string;
  usageCount: number;
  details?: SignatureDetails;
}





export const generateSignatureHtml = (signature: Signature ): string => {
  const details = signature.details;
  if (!details) return '';
  const background = details.background?.background_value || '#ffffff';
  return getFinalHtml(details.html, background , signature?._id)
};






export const filterSignatures = (signatures: Signature[], searchQuery: string): Signature[] => {
  if (!searchQuery) return signatures;

  const lowerCaseQuery = searchQuery.toLowerCase();
  return signatures.filter(signature =>
    signature.SignatureName.toLowerCase().includes(lowerCaseQuery) ||
    signature?.templateInfo?.TemplatesName.toLowerCase().includes(lowerCaseQuery)
  );
};
export const generateStandaloneSignatureHtml = (signature: Signature): string => {
  const signatureHtml = generateSignatureHtml(signature);
  return signatureHtml;
};
