import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to send your message.",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours."
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <section id="contact" className="py-20 bg-gradient-to-b from-transparent to-prosignature/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Get <span className="text-gradient">in Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to transform your email signature? Have questions? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} className="bg-gray-800/50 border-gray-700 focus:border-prosignature text-white" placeholder="Your full name" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="bg-gray-800/50 border-gray-700 focus:border-prosignature text-white" placeholder="your.email@example.com" />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} className="bg-gray-800/50 border-gray-700 focus:border-prosignature text-white min-h-[120px]" placeholder="Tell us about your project or ask any questions..." />
              </div>
              
              <Button type="submit" className="w-full bg-prosignature-gradient hover:opacity-90" size="lg">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">Get in touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-gray-300">support@prosignature.lovable.app</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📍</div>
                  <div>
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p className="text-gray-300">India (expanding globally)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🕐</div>
                  <div>
                    <h4 className="font-semibold mb-1">Response Time</h4>
                    <p className="text-gray-300">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6">Follow us</h3>
              
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-prosignature-gradient rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
                  <span className="text-white text-xl">📘</span>
                </a>
                <a href="#" className="w-12 h-12 bg-prosignature-gradient rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
                  <span className="text-white text-xl">📷</span>
                </a>
                <a href="#" className="w-12 h-12 bg-prosignature-gradient rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
                  <span className="text-white text-xl">🐦</span>
                </a>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 py-0 mx-[6px]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient px-0 ">10K+</div>
                  <div className="text-sm text-gray-400">Happy Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient">20+</div>
                  <div className="text-sm text-gray-400">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;