function ContactSection() {
  const whatsappNumber = "1234567890"; // Replace with actual WhatsApp number
  const email = "info@asktours.com"; // Replace with actual email

  return (
    <section id="contact" className="relative py-20 px-4 overflow-hidden bg-gray-900">

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Main Glass Card */}
        <div className="text-center">

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 drop-shadow-md">
            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-400">Adventure</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Ready to explore Sri Lanka? We are just one click away.
            <br className="hidden md:block" />
            Reach out to us for personalized tour packages.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">

            {/* WhatsApp Contact */}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hello! I would like to inquire about your tourism packages.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="bg-white/10 p-5 rounded-full mb-4 group-hover:bg-white/20 transition-colors ring-1 ring-white/30">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">WhatsApp</h3>
              <p className="text-gray-400 text-sm mb-2">Chat with us instantly</p>
              <div className="text-white font-semibold tracking-wide">
                {whatsappNumber}
              </div>
            </a>

            {/* Email Contact */}
            <a
              href={`mailto:${email}?subject=Tourism Package Inquiry`}
              className="group flex flex-col items-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="bg-white/10 p-5 rounded-full mb-4 group-hover:bg-white/20 transition-colors ring-1 ring-white/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Email</h3>
              <p className="text-gray-400 text-sm mb-2">Send us your inquiry</p>
              <div className="text-white font-semibold tracking-wide">
                {email}
              </div>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
