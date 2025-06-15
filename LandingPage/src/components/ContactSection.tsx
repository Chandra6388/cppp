
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Facebook } from "lucide-react";
import { addContactUs } from "@/service/apiService"
import Swal from 'sweetalert2';
const ContactSection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        title: "Please fill in all fields!",
        text: "All fields are required to send your message.",
        icon: "warning",
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
    setLoading(true);
    const req = { name: formData?.name, email: formData?.email, message: formData?.message }
    await addContactUs(req)
      .then((res) => {
        if (res.status) {
          Swal.fire({
            title: "Message sent successfully!",
            text: res?.message,
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
          });
          setLoading(false);
          setFormData({ name: '', email: '', message: '' });
        }
        else {
          setLoading(false);
          Swal.fire({
            title: "Error",
            text: "Please try again later.",
            icon: "error",
            timer: 2000,
            timerProgressBar: true,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("error in adding countact us", error)
      })

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return <section id="contact" className="py-20 bg-gradient-to-b from-transparent to-prosignature/10 mt-20">
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
        <div className="glass-card p-8 rounded-3xl">
          <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
          <div className="space-y-6">
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
            <Button onClick={handleSubmit} disabled={loading} className="w-full bg-prosignature-gradient hover:opacity-90" size="lg">
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send Message"
              )}
            </Button>

          </div>
        </div>
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6">Get in touch</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📧</div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-gray-300">support@prosignature.ai</p>
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
              <a href="https://www.facebook.com/profile.php?id=61572224159494" target="_blank"  className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg flex items-center justify-center hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 border border-gray-700 hover:border-cyan-400/40">
                <Instagram className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
              </a>
              <a href="https://www.instagram.com/prosignature.io/" target="_blank"  className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg flex items-center justify-center hover:from-cyan-500/20 hover:to-purple-500/20 transition-all duration-300 border border-gray-700 hover:border-cyan-400/40">
                <Facebook className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
};

export default ContactSection;
