import React, { useRef } from "react";
import { Box, Container, Stack } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PetsIcon from "@mui/icons-material/Pets";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./../../../css/events.css";

// ─── Types ───────────────────────────────────────────────────────
interface EventItem {
  id: number;
  img: string;
  title: string;
  author: string;
  desc: string;
  date: string;
  location: string;
  tag: string;
}

// ─── Mock data ────────────────────────────────────────────────────
const PET_EVENTS: EventItem[] = [
  {
    id: 1,
    img: "/img/events/event1.png",
    title: "PetFood Annual Festival",
    author: "Tatyana Karimova",
    desc: "Join us for the biggest pet food festival of the year! Discover premium nutrition, taste tests, and exciting giveaways for your beloved pets.",
    date: "June 15, 2025",
    location: "Tashkent, Uzbekistan",
    tag: "Festival",
  },
  {
    id: 2,
    img: "/img/events/event2.png",
    title: "Healthy Paws Workshop",
    author: "Kavin Robertson",
    desc: "A hands-on workshop about pet nutrition and wellness. Learn how to choose the right food for your dog or cat from certified veterinarians.",
    date: "July 3, 2025",
    location: "Samarkand, Uzbekistan",
    tag: "Workshop",
  },
  {
    id: 3,
    img: "/img/events/event3.png",
    title: "Adopt & Care Day",
    author: "Lina Akhmedova",
    desc: "A community event dedicated to pet adoption and responsible pet care. Free nutrition consultations and food samples for all attendees.",
    date: "August 20, 2025",
    location: "Namangan, Uzbekistan",
    tag: "Community",
  },
  {
    id: 4,
    img: "/img/events/event4.png",
    title: "Cat & Dog Expo 2025",
    author: "Sara Akhmedova",
    desc: "The premier exhibition showcasing the latest in pet food technology, organic treats, and sustainable packaging for a greener pet world.",
    date: "September 10, 2025",
    location: "Bukhara, Uzbekistan",
    tag: "Expo",
  },
];

// ─── Component ────────────────────────────────────────────────────
export default function Events(): React.JSX.Element {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="events-frame">
      <Stack className="events-main">
        {/* ── Section title ── */}
        <Box className="events-text">
          <Box className="events-title-wrap">
            <span className="category-title">Our Events</span>
            <span className="category-title__line" />
          </Box>
          <p className="events-subtitle">
            Stay connected with the PetFood community
          </p>
        </Box>

        {/* ── Swiper ── */}
        <Swiper
          modules={[Autoplay, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="events-info"
          slidesPerView={"auto"}
          centeredSlides={true}
          spaceBetween={28}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
          }}
        >
          {PET_EVENTS.map((event) => (
            <SwiperSlide key={event.id} className="events-info-frame">
              {/* Image */}
              <Box className="events-img-wrap">
                <img src={event.img} alt={event.title} className="events-img" />
                {/* Tag badge */}
                <span className="events-tag">{event.tag}</span>
              </Box>

              {/* Content */}
              <Box className="events-desc">
                <Box className="events-bott">
                  <Box className="bott-left">
                    {/* Title + author */}
                    <Box className="event-title-speaker">
                      <strong className="event-title">{event.title}</strong>
                      <Box className="event-organizator">
                        <PetsIcon className="event-speaker-icon" />
                        <p className="spec-text-author">{event.author}</p>
                      </Box>
                    </Box>

                    {/* Description */}
                    <p className="text-desc">{event.desc}</p>

                    {/* Date + Location */}
                    <Box className="bott-info">
                      <Box className="bott-info-main">
                        <CalendarMonthIcon className="bott-icon" />
                        <span>{event.date}</span>
                      </Box>
                      <Box className="bott-info-main">
                        <LocationOnIcon className="bott-icon" />
                        <span>{event.location}</span>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Prev / Pagination / Next ── */}
        <Container>
          <Box className="prev-next-frame">
            <Box
              className="events-nav-btn"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ArrowBackIosNewIcon className="nav-arrow-icon" />
            </Box>
            <div className="dot-frame-pagination swiper-pagination" />
            <Box
              className="events-nav-btn"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ArrowForwardIosIcon className="nav-arrow-icon" />
            </Box>
          </Box>
        </Container>
      </Stack>
    </div>
  );
}
