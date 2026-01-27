import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Send, Linkedin, Github, Youtube, Copy, Check, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import { useStore } from '../lib/store';

const Contact: React.FC = () => {
  const { data, addMessage } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'email' && emailError) setEmailError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setStatus('submitting');
    setTimeout(() => {
        addMessage(formData);
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  const contactEmail = data.settings?.email || 'contact@example.com';
  const location = data.settings?.location || "Northern region mzuzu malawi";

  const copyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="pt-16 pb-0 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden" aria-label="Contact Section">
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 dark:bg-primary/20 blur-[100px] rounded-full mix-blend-screen opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">Contact</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-3 mb-6">Get In Touch</h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-5">{data.settings.contactHeading || "Let's work together!"}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {data.settings.contactDescription || "I am currently available for freelance projects and full-time opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!"}
              </p>
            </div>

            <div className="space-y-6">
              <button 
                className="w-full text-left group flex items-start space-x-5 p-5 rounded-2xl bg-cream dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary" 
                onClick={copyEmail}
              >
                <div className="bg-primary/10 p-3.5 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <Mail size={26} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Email</p>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-slate-900 dark:text-white break-all">{contactEmail}</p>
                    {copied ? <Check size={18} className="text-green-500 flex-shrink-0" /> : <Copy size={18} className="text-slate-400 group-hover:text-primary flex-shrink-0" />}
                  </div>
                </div>
              </button>

              <div className="flex items-start space-x-5 p-5 rounded-2xl bg-cream dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all duration-300 shadow-sm">
                <div className="bg-secondary/10 p-3.5 rounded-xl text-secondary">
                  <MapPin size={26} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Location</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[2rem] pointer-events-none"></div>

              <form onSubmit={handleSubmit} className="space-y-7 relative z-10" noValidate>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-cream dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-5 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-cream dark:bg-slate-950 border rounded-xl px-5 py-3.5 text-slate-900 dark:text-white focus:ring-2 outline-none transition-all placeholder:text-slate-400 ${
                        emailError 
                          ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
                          : 'border-slate-300 dark:border-slate-800 focus:ring-primary/50 focus:border-primary'
                      }`}
                      placeholder="john@example.com"
                    />
                    {emailError && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none"><AlertCircle size={20} /></div>}
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-cream dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-5 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none placeholder:text-slate-400"
                    placeholder="How can I help you?"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full py-4 text-base font-semibold shadow-lg shadow-primary/25" 
                  disabled={status === 'submitting' || status === 'success'}
                  whileTap={{ scale: 1.05 }}
                  animate={status === 'submitting' ? { scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 1.5 } } : { scale: 1 }}
                >
                  {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                  {status === 'idle' && <Send className="ml-2 h-5 w-5" aria-hidden="true" />}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="flex flex-col items-center justify-center pt-4 pb-6 border-t border-slate-100 dark:border-slate-800/50"
        >
           <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Connect with me</p>
           <div className="flex space-x-6">
             {data.settings?.social.github && (
               <a href={data.settings.social.github} target="_blank" rel="noopener noreferrer" className="bg-cream dark:bg-slate-800 p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#333] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-400 shadow-sm border border-slate-100 dark:border-slate-700"><Github size={20} /></a>
             )}
             {data.settings?.social.linkedin && (
               <a href={data.settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="bg-cream dark:bg-slate-800 p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#0077b5] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm border border-slate-100 dark:border-slate-700"><Linkedin size={20} /></a>
             )}
             {data.settings?.social.youtube && (
               <a href={data.settings.social.youtube} target="_blank" rel="noopener noreferrer" className="bg-cream dark:bg-slate-800 p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-white hover:bg-[#FF0000] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm border border-slate-100 dark:border-slate-700"><Youtube size={20} /></a>
             )}
           </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;