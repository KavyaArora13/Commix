'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const withScrollAnimation = (WrappedComponent, { delay = 0 } = {}) => {
  return (props) => {
    const [ref, inView] = useInView({
      threshold: 0.2,
      triggerOnce: false,
      rootMargin: '-50px 0px'
    });

    const containerVariants = {
      hidden: { 
        opacity: 0,
        y: 30
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.215, 0.610, 0.355, 1.000],
          delay: delay * 0.5
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <WrappedComponent {...props} />
      </motion.div>
    );
  };
};

export default withScrollAnimation; 