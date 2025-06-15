import { Users, Target, Lightbulb, Award, Rocket, Heart, Globe, Code } from "lucide-react";
import { useEffect, useState } from "react";
const About = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, {
      threshold: 0.1
    });
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const isSectionVisible = (sectionId: string) => visibleSections.has(sectionId);
  return <div className="min-h-screen pt-20 creative-gradient">
      {/* Hero Section */}
      <section className="py-32 section-dark">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-light mb-8 text-white">
              About <span className="text-gradient-primary font-extrabold">ProSignature</span>
            </h1>
            <p className="text-2xl text-gray-400 mb-12 font-light leading-relaxed">
              We're revolutionizing email communication through cutting-edge AI technology and innovative design thinking.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" data-section className="py-32 section-dark">
        <div className="container mx-auto px-4">
          <div className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isSectionVisible('mission') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div>
              <h2 className="text-5xl font-light mb-8 text-white">
                Our <span className="text-gradient-secondary">Mission</span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 font-light leading-relaxed">
                To transform the way professionals communicate through intelligent, beautiful, and data-driven email signatures 
                that create meaningful connections and drive business growth.
              </p>
              <p className="text-lg text-gray-500 font-light leading-relaxed">
                We believe every email is an opportunity to make an impact. Our AI-powered platform empowers businesses 
                to turn their email communication into a strategic advantage.
              </p>
            </div>
            <div className="creative-card p-12 rounded-3xl">
              <div className="text-center">
                <Target className="w-20 h-20 text-cyan-300 mx-auto mb-8" />
                <h3 className="text-3xl font-light text-white mb-6">Precision-Driven Results</h3>
                <p className="text-gray-400 font-light leading-relaxed">
                  Every feature we build is designed with one goal: to maximize your email's impact and drive measurable business outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" data-section className="py-32 section-dark">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('values') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-5xl font-light mb-8 text-white">
              Our <span className="text-gradient-accent font-extrabold">Core Values</span>
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto">
              The principles that guide everything we do and shape our company culture
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            icon: Lightbulb,
            title: "Innovation First",
            desc: "We constantly push the boundaries of what's possible in email technology",
            gradient: "from-yellow-500/20 to-orange-500/20"
          }, {
            icon: Heart,
            title: "Customer Obsession",
            desc: "Every decision we make is driven by our commitment to customer success",
            gradient: "from-red-500/20 to-pink-500/20"
          }, {
            icon: Code,
            title: "Technical Excellence",
            desc: "We maintain the highest standards in code quality and system reliability",
            gradient: "from-blue-500/20 to-cyan-500/20"
          }, {
            icon: Globe,
            title: "Global Impact",
            desc: "We're building technology that transforms communication worldwide",
            gradient: "from-emerald-500/20 to-teal-500/20"
          }].map((value, index) => <div key={index} className={`creative-card p-8 rounded-3xl text-center transition-all duration-700 ${isSectionVisible('values') ? 'animate-scale-in' : 'opacity-0'}`} style={{
            animationDelay: `${index * 150}ms`
          }}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${value.gradient} flex items-center justify-center backdrop-blur-sm`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-light mb-4 text-white">{value.title}</h3>
                <p className="text-gray-400 font-light leading-relaxed">{value.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section id="team" data-section className="py-32 section-dark">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('team') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-5xl font-light mb-8 text-white">
              Meet Our <span className="text-gradient-primary font-extrabold">Visionaries</span>
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto">
              A diverse team of innovators, engineers, and designers working to shape the future of communication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[{
            name: "Sarah Chen",
            role: "Chief Executive Officer",
            bio: "Former VP of Product at TechCorp with 15+ years in AI and communication technology",
            avatar: "SC",
            gradient: "from-purple-500 to-pink-500"
          }, {
            name: "David Kumar",
            role: "Chief Technology Officer",
            bio: "Ex-Google engineer specializing in machine learning and distributed systems architecture",
            avatar: "DK",
            gradient: "from-cyan-500 to-blue-500"
          }, {
            name: "Emma Rodriguez",
            role: "Head of Design",
            bio: "Award-winning UX designer with expertise in creating intuitive and beautiful user experiences",
            avatar: "ER",
            gradient: "from-emerald-500 to-teal-500"
          }].map((member, index) => <div key={index} className={`creative-card p-8 rounded-3xl text-center transition-all duration-700 ${isSectionVisible('team') ? 'animate-scale-in' : 'opacity-0'}`} style={{
            animationDelay: `${index * 200}ms`
          }}>
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${member.gradient} flex items-center justify-center text-white font-light text-2xl`}>
                  {member.avatar}
                </div>
                <h3 className="text-2xl font-light mb-2 text-white">{member.name}</h3>
                <p className="text-cyan-300 font-light mb-4">{member.role}</p>
                <p className="text-gray-400 font-light leading-relaxed">{member.bio}</p>
              </div>)}
          </div>
        </div>
      </section> */}

      {/* Journey Section */}
      <section id="journey" data-section className="py-32 section-dark">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-20 transition-all duration-1000 ${isSectionVisible('journey') ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-5xl font-light mb-8 text-white">
              Our <span className="text-gradient-secondary font-extrabold">Journey</span>
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto">
              From a simple idea to revolutionizing email communication worldwide
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[{
            year: "2020",
            title: "The Vision",
            desc: "Founded with the mission to transform email communication through intelligent design and AI technology.",
            icon: Lightbulb
          }, {
            year: "2021",
            title: "First Launch",
            desc: "Released our MVP and gained our first 500 users who believed in our vision for smarter email signatures.",
            icon: Rocket
          }, {
            year: "2022",
            title: "AI Integration",
            desc: "Introduced machine learning capabilities and predictive analytics, revolutionizing signature performance.",
            icon: Code
          }, {
            year: "2023",
            title: "Global Expansion",
            desc: "Reached 10,000+ users across 5+ countries, establishing ourselves as the leading signature platform.",
            icon: Globe
          }, {
            year: "2024",
            title: "Industry Recognition",
            desc: "Received multiple awards for innovation and became the preferred choice for enterprise customers.",
            icon: Award
          }].map((milestone, index) => <div key={index} className={`flex items-center mb-12 transition-all duration-700 ${isSectionVisible('journey') ? 'animate-fade-in-up' : 'opacity-0'}`} style={{
            animationDelay: `${index * 200}ms`
          }}>
                <div className="creative-card p-6 rounded-2xl mr-8 flex-shrink-0">
                  <milestone.icon className="w-8 h-8 text-cyan-300" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-light text-gradient-primary mr-4">{milestone.year}</span>
                    <h3 className="text-xl font-light text-white">{milestone.title}</h3>
                  </div>
                  <p className="text-gray-400 font-light leading-relaxed">{milestone.desc}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>
    </div>;
};
export default About;