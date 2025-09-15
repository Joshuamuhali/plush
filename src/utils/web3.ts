const API_KEY = "61168a52-5b26-4744-abe2-fc4d3950e704";
const API_ENDPOINT = "https://api.web3forms.com/submit";

export interface FormData {
  name: string;
  email: string;
  phone?: string;
  propertyType?: string;
  message: string;
  propertyId?: string;
  propertyTitle?: string;
}

export const submitFormData = async (formData: FormData): Promise<boolean> => {
  try {
    const payload = {
      access_key: API_KEY,
      ...formData,
      from_name: formData.name,
      subject: `Property Inquiry${formData.propertyTitle ? ` - ${formData.propertyTitle}` : ''}`,
    };

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      return true;
    } else {
      console.error("Form submission failed:", result);
      return false;
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    return false;
  }
};