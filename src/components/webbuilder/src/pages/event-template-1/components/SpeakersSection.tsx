import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const allSpeakers = [
  {
    day: "Day 1 (24th April’25)",
    speakers: [
      { id: 1, name: "Commodore Santosh", title: "Executive Director", company: "ECIL, Hyderabad" },
      { id: 2, name: "Dr. Nagendra Babu", company: "Zen Technologies" },
      { id: 3, name: "Dr. Samir V. Kamat", title: "Chairman", company: "DRDO" },
      { id: 4, name: "Lt. Gen. Manish Erry", title: "AVSM, SM", company: "DG Strategic Planning" },
      { id: 5, name: "Lt. Gen. Neeraj Varshney", title: "VSM", company: "Commandant MCEME" },
      { id: 6, name: "Lt. Gen. V.G. Khandare", title: "PVSM, AVSM, SM", company: "Principal Advisor (USG), Dept. of Defence" },
      { id: 7, name: "Maj Gen (Dr.) RK Raina", title: "Director", company: "SISDSS" },
      { id: 8, name: "Maj Gen MLN Sravan Kumar (Retd)", company: "" },
      { id: 9, name: "Mr. A B Mathur", title: "Member", company: "NSAB" },
      { id: 10, name: "Mr. Thummala Vikram", title: "IG", company: "CRPF" },
      { id: 11, name: "Prof. (Dr.) Kalpesh. H. Wandra", title: "Pro Vice Chancellor", company: "RRU" },
      { id: 12, name: "Shri Alok Bansal", title: "Director", company: "India Foundation" },
      { id: 13, name: "Shri Govind Mohan", title: "Hon’ble Home Secretary of India" },
      { id: 14, name: "Shri Harsh V Pant", title: "Visiting Professor", company: "ORF" }
    ]
  },
  {
    day: "Day 2 (25th April’25)",
    speakers: [
      { id: 15, name: "Col Harison Verma (Retd.)", title: "COO", company: "Aerospace Services India Ltd" },
      { id: 16, name: "Dr. (Smt.) Chandrika Kaushik", title: "DG PC & SI", company: "DRDO" },
      { id: 17, name: "Dr. Girish Kant Pandey", title: "Principal", company: "Govt. KRD College" },
      { id: 18, name: "Dr. P. Rajalakshmi", company: "NMICPS TiHAN Foundation, IIT Hyderabad" },
      { id: 19, name: "Dr. Sangita Rao Achary Addanki", company: "DLIC, DRDO" },
      { id: 20, name: "Lt. Gen. Sanjay Verma", title: "PVSM, AVSM, VSM, Bar to VSM" },
      { id: 21, name: "Maj Gen. C. Mani", company: "Zen Technologies" },
      { id: 22, name: "Mr. Mridul Vashisht", company: "Indrones Solutions" },
      { id: 23, name: "Mr. Vedant Ahluwalia", company: "Dataviv Technology" },
      { id: 24, name: "Rear Admiral V Ramakrishnan", company: "Indian Navy" },
      { id: 25, name: "Shri B. C. Parida", company: "Survey of India" },
      { id: 26, name: "Shri Pravin Wagh, Sc G", company: "Director DRDL" },
      { id: 27, name: "Shri Y. Nagi Reddy, IPS", company: "DG, Telangana State Disaster Response & Fire Services" }
    ]
  },
  {
    day: "Day 3 (26th April’25)",
    speakers: [
      { id: 28, name: "Dr Pranay Kumar" },
      { id: 29, name: "Dr. Sunil Khetarpal", title: "Director", company: "Association of Healthcare Providers India" },
      { id: 30, name: "Mr. Anuraag Tiwari", title: "Director", company: "GKD Tactix.ai" },
      { id: 31, name: "Mr. Arul Rajesh Gedala", title: "Race director", company: "FPV India" },
      { id: 32, name: "Mr. Sanjay Kumar", title: "Co-Founder", company: "EON Space Labs Pvt. Ltd." },
      { id: 33, name: "Mr. Vishal Saurav", title: "CEO-founder", company: "XBOOM" },
      { id: 34, name: "Ms. Preet Sandhuu", company: "AVPL International (AITMC Ventures Ltd.)" },
      { id: 35, name: "Ms. Rini Bansal", title: "Co-founder and BD Director", company: "Carbon Light Pvt. Ltd." },
      { id: 36, name: "Shri Nalamada Uttam Kumar Reddy", title: "Irrigation Minister" },
      { id: 37, name: "Shri. Shubham Jaiswal", title: "Embedded Engineer", company: "Macfos Limited (Robu.in)" }
    ]
  }
];

const SpeakersSection = () => {
  return (
    <section id="speakers" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">
          <span className="text-[#FFD400]">Drone Expo 2025</span> Speakers
        </h2>

        {allSpeakers.map((dayGroup, index) => (
          <div key={index} className="mb-16">
            <h3 className="text-2xl font-bold text-black mb-6">{dayGroup.day}</h3>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              navigation={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
            >
              {dayGroup.speakers.map((spk) => (
                <SwiperSlide key={spk.id}>
                  <div className="bg-white rounded-2xl shadow-lg p-6 text-center h-full hover:shadow-2xl transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-[#FF0000] text-white flex items-center justify-center mx-auto font-bold mb-4">
                      {spk.id}
                    </div>
                    <h4 className="text-lg font-semibold text-black mb-1">{spk.name}</h4>
                    {spk.title && <p className="text-sm text-[#FFD400] font-medium">{spk.title}</p>}
                    {spk.company && <p className="text-sm text-gray-600">{spk.company}</p>}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpeakersSection;
