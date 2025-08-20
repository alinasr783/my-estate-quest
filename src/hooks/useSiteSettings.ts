import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ContactInfo {
  company_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  working_hours: string;
  social_media: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

interface FooterInfo {
  about_text: string;
  services: string[];
  quick_links: Array<{
    title: string;
    url: string;
  }>;
}

export const useSiteSettings = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [footerInfo, setFooterInfo] = useState<FooterInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', ['contact_info', 'footer_info']);

      if (error) throw error;

      data?.forEach((item) => {
        if (item.key === 'contact_info') {
          setContactInfo(item.value as unknown as ContactInfo);
        } else if (item.key === 'footer_info') {
          setFooterInfo(item.value as unknown as FooterInfo);
        }
      });
    } catch (error) {
      console.error('Error loading site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    contactInfo,
    footerInfo,
    loading,
    refetch: loadSiteSettings
  };
};