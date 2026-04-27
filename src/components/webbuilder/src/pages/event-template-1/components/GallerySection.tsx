import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Play } from 'lucide-react';

const GallerySection: React.FC = () => {
  const galleryItems = [
    {
      type: 'video',
      src: 'https://www.youtube.com/embed/tZw1ouQhef0?autoplay=0&mute=1&controls=1&loop=1&playlist=tZw1ouQhef0',
      title: 'Drone Innovation Video 1'
    },
    {
      type: 'video',
      src: 'https://www.youtube.com/embed/Mwn-_bvzkYA?autoplay=0&mute=1&controls=1&loop=1&playlist=Mwn-_bvzkYA',
      title: 'Drone Innovation Video 2'
    },
    {
      type: 'video',
      src: 'https://www.youtube.com/embed/UBf6wACbMwY?autoplay=0&mute=1&controls=1&loop=1&playlist=UBf6wACbMwY',
      title: 'Drone Innovation Video 3'
    },
    {
      type: 'video',
      src: 'https://www.youtube.com/embed/4lMdajZ0kGg?autoplay=0&mute=1&controls=1&loop=1&playlist=4lMdajZ0kGg',
      title: 'Drone Innovation Video 4'
    },
    {
      type: 'video',
      src: 'https://www.youtube.com/embed/KL-vhCrcWjY?autoplay=0&mute=1&controls=1&loop=1&playlist=KL-vhCrcWjY',
      title: 'Drone Innovation Video 5'
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-black mb-4">
            Exhibitors <span className="text-[#FF0000]">Interview</span>
          </h2>
          <div data-aos="fade-up" data-aos-delay="200" className="w-24 h-1 bg-[#FFD400] mx-auto mb-6"></div>
          <p data-aos="fade-up" data-aos-delay="400" className="text-gray-600 text-lg max-w-2xl mx-auto">

            Catch our exclusive interviews with top exhibitors sharing their insights and innovations.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="600">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className="gallery-swiper"
          >
            {galleryItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <iframe
                    src={item.src}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-64 rounded-xl"
                  ></iframe>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>


      </div>

     <style jsx>{`
  .gallery-swiper .swiper-button-next,
  .gallery-swiper .swiper-button-prev {
    color: #FF0000;
  }
  .gallery-swiper .swiper-pagination {
    bottom: -20px !important; /* This moves the dots lower */
  }
  .gallery-swiper .swiper-pagination-bullet {
    background: #FFD400;
    opacity: 0.5;
  }
  .gallery-swiper .swiper-pagination-bullet-active {
    background: #FF0000;
    opacity: 1;
  }
`}</style>

    </section>
  );
};

export default GallerySection;
