import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';

import "swiper/css";
import "swiper/css/free-mode";
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay } from "swiper";
import classes from './Tables.module.css'

const Tables = (props) => {
  return (
    <Swiper
      // slidesPerView={8}
      // spaceBetween={30}
      freeMode={true}
      grabCursor={true}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Autoplay, Pagination]}
      breakpoints={{
        300: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        400: {
          slidesPerView: 4,
          spaceBetween: 35,
        },
        768: {
          slidesPerView: 6,
          spaceBetween: 40,
        },
        992: {
          slidesPerView: 8,
          spaceBetween: 35,
        },

        1200: {
          slidesPerView: 10,
          spaceBetween: 35,
        },
      }}
      // autoplay={{
      //     delay: 3000,
      //     disableOnInteraction: false,
      //     pauseOnMouseEnter: true,
      // }}
      // loop={true}
      className="mySwiper"
    >
      {props.tables.map((table, index) => (
        <SwiperSlide className={classes["res-table-container"]} key={table._id}>
          <div
            className={`
              ${classes["res-table"]} 
              ${table.status == 'active' ? classes.active : ''} 
              ${table.status == 'finish' ? classes["finish-noti"] : ''}
            `}
            onClick={() =>
              table.status == "active" || table.status == "finish"
                ? props.onShowTable(table, "active")
                : props.onShowTable(table, "inactive")
            }
          >
            {table.code}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Tables;
