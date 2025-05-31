
import React from 'react';
import { Helmet } from 'react-helmet-async';


const descriptionMap = {
    MyAccount: "Access and manage your ProSignature account settings and preferences.",
    createSignature: "Create a professional email signature by choosing templates, adding your details, and customizing the design in ProSignature.",
    SignatureDashbaord: "Professional email signature dashboard for creating, managing, and tracking email signatures",
    Login: "Log in to your ProSignature account to access and manage your professional email signatures and account settings.",
    Register: "Create a new ProSignature account to start designing and managing your professional email signatures."
  };
  

export const SEO = ({ title, description }: { title: string; description: string }) => {
  
    return (
        <Helmet>
            <title>{`Pro Signatures - ${title}` || "Pro Signature"} </title>
            <meta name="description" content={descriptionMap[description]} />
        </Helmet>
    );
}