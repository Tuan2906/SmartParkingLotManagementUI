import React, { useEffect, useState } from 'react';

import OtpInput from './OTPForm';
import AutoCounter from './AutoCounter';
import Timer from './AutoCounter';

const OTP = ({ length}) => {
    const [timeLeft, setTimeLeft] = useState(30); // 3 phút = 180 giây

    useEffect(() => {
        if (timeLeft > 0) {
          const timer = setInterval(() => {
            setTimeLeft(timeLeft - 1);
          }, 1000);
    
          return () => clearInterval(timer); // Clear interval khi component bị unmount hoặc thời gian thay đổi
        }
      }, [timeLeft]);


    return (
        <div style={{display:"flex", justifyContent:"center", flexDirection:"column"}}>
            <OtpInput length={length} timeLeft = {timeLeft} setTimeLeft={setTimeLeft}/>
            <Timer timeLeft={timeLeft}/>
        </div>
      
    );
};

export default OTP;
