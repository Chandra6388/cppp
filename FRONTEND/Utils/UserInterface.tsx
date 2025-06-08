import type { LucideIcon } from "lucide-react";

export interface EditableFieldProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  onSave: (value: string) => void;
  type?: string;
  placeholder?: string;
  isEditable?: boolean;
  name?: string;
}


export interface ButtonOption {
  id: string;
  text: string;
  type: string;
  connect_with: string;
  color: string;
  fontStyle: "normal" | "italic" | "bold" | "boldItalic";
}

export interface SocialMediaOption {
  id: string;
  type: string;
  link: string;
  icon: string;
}

export interface BackgroundOption {
  id: string;
  background_type: 'color' | 'gradient' | 'image';
  background_value: string;
  label?: string;
}

export interface FormData {
  fullName: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  headshot_url?: string;
  address: string;
}

export interface SingleSignature {
  _id: string,
  SignatureName: string,
  Templates_Id: string,
  details: {
    html: string;
    background: {
      background_value: string
    }
  }
}