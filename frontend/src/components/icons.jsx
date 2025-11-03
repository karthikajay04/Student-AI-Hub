import React from 'react';

const Svg = ({ path, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d={path} fill="currentColor" />
  </svg>
);

export const IconWrite = () => (
  <Svg path="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.83H5.5v-.41l8.06-8.06.41.41-8.06 8.06zM20.71 7.04c.39-.39.39-1.02 0-1.41L18.37 3.3a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.84z" />
);

export const IconResearch = () => (
  <Svg path="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
);

export const IconCalendar = () => (
  <Svg path="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6c0-1.1-.9-2-2-2zm0 14H5V10h14v8z" />
);

export const IconNotes = () => (
  <Svg path="M14 2H6c-1.1 0-2 .9-2 2v16l4-4h6c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
);

export const IconIdeas = () => (
  <Svg path="M9 21h6v-1.5H9V21zm3-19C7.48 2 4 5.48 4 10c0 2.38 1.19 4.48 3 5.74V18h10v-2.26c1.81-1.26 3-3.36 3-5.74 0-4.52-3.48-8-8-8z" />
);

export const IconCode = () => (
  <Svg path="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41zM6 6h2v12H6z" />
);

export const IconBug = () => (
  <Svg path="M20 8h-2.81a6 6 0 0 0-10.38 0H4v2h1.09c-.06.33-.09.66-.09 1v1H4v2h1v1c0 .34.03.67.09 1H4v2h2.81A6 6 0 0 0 18 17h2v-2h-1v-1h1v-2h-1v-1c0-.34-.03-.67-.09-1H20V8z" />
);

export const IconRoadmap = () => (
  <Svg path="M4 6h6v12H4V6zm10 0h6v12h-6V6zM5 7v10h4V7H5zm10 0v10h4V7h-4z" />
);

export const IconVideo = () => (
  <Svg path="M17 10.5V7c0-1.1-.9-2-2-2H5C3.9 5 3 5.9 3 7v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-3.5l4 4v-11l-4 4z" />
);

export const IconGame = () => (
  <Svg path="M8 7H6v2H4v2h2v2h2v-2h2V9H8V7zm10 6h-4v4h4v-4zM14 3h-4v4h4V3z" />
);

export const IconRocket = () => (
  <Svg path="M12 2C8 5 6 9 6 12c0 2 1 4 3 6l3-3 3 3c2-2 3-4 3-6 0-3-2-7-6-10zm0 7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
);

export const IconTimer = () => (
  <Svg path="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-1-6h6v2h-6V2zM7.05 4.64 5.64 3.22 3.22 5.64l1.41 1.41L7.05 4.64zM20.78 5.64l-2.42-2.42-1.41 1.41 2.42 2.42 1.41-1.41zM12 22a10 10 0 1 0-10-10h2a8 8 0 1 1 8 8v2z" />
);


