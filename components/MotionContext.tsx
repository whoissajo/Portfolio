"use client";

import { createContext, useContext } from "react";

export const MotionOffContext = createContext(false);
export const useMotionOff = () => useContext(MotionOffContext);
