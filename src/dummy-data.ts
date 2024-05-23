import type { ManyWeeksData } from "./types";

export const BalancedExample: ManyWeeksData = {
  "May 5, 2024": {
    sunday: {
      morning: { positive: ["ronnie"], negative: [] },
      evening: { positive: ["ronnie", "imma"], negative: ["shahar"] },
    },
    monday: {
      morning: { positive: ["tal", "shahar"], negative: [] },
      evening: { positive: ["shahar", "ronnie", "imma", "tal"], negative: ["nitsan"] },
    },
    tuesday: {
      morning: { positive: ["shahar", "tal", "imma", "ronnie"], negative: ["nitsan"] },
      evening: { positive: [], negative: ["imma"] },
    },
    wednesday: {
      morning: { positive: ["ronnie", "tal"], negative: ["nitsan", "imma"] },
      evening: { positive: [], negative: [] },
    },
    thursday: {
      morning: { positive: ["shahar", "ronnie", "nitsan"], negative: [] },
      evening: { positive: ["imma", "shahar"], negative: ["ronnie"] },
    },
    friday: {
      morning: { positive: ["imma"], negative: ["shahar", "tal"] },
      evening: { positive: ["shahar", "ronnie"], negative: ["imma", "tal"] },
    },
    saturday: {
      morning: { positive: ["nitsan", "ronnie"], negative: [] },
      evening: { positive: ["ronnie", "nitsan", "tal"], negative: ["shahar"] },
    },
  },
  "May 12, 2024": {
    sunday: {
      morning: { positive: ["shahar", "nitsan", "imma"], negative: ["ronnie"] },
      evening: { positive: [], negative: ["nitsan"] },
    },
    monday: {
      morning: { positive: ["tal", "ronnie", "shahar", "imma"], negative: ["nitsan"] },
      evening: { positive: ["ronnie", "shahar", "nitsan"], negative: ["imma"] },
    },
    tuesday: {
      morning: { positive: ["imma", "tal"], negative: ["shahar"] },
      evening: { positive: ["imma"], negative: ["tal", "ronnie"] },
    },
    wednesday: {
      morning: { positive: ["shahar"], negative: ["nitsan", "tal"] },
      evening: { positive: [], negative: ["ronnie"] },
    },
    thursday: {
      morning: { positive: ["ronnie", "tal", "nitsan"], negative: ["shahar"] },
      evening: { positive: ["ronnie", "imma", "tal"], negative: ["shahar"] },
    },
    friday: {
      morning: { positive: ["imma", "ronnie", "nitsan", "tal"], negative: ["shahar"] },
      evening: { positive: ["nitsan", "imma", "tal", "ronnie"], negative: ["shahar"] },
    },
    saturday: {
      morning: { positive: ["ronnie", "imma"], negative: ["nitsan"] },
      evening: { positive: ["imma", "nitsan"], negative: ["tal", "ronnie"] },
    },
  },
  "May 19, 2024": {
    sunday: {
      morning: { positive: ["nitsan", "tal"], negative: [] },
      evening: { positive: [], negative: [] },
    },
    monday: {
      morning: { positive: ["imma"], negative: ["ronnie"] },
      evening: { positive: ["shahar", "tal", "nitsan"], negative: [] },
    },
    tuesday: {
      morning: { positive: ["shahar", "ronnie"], negative: [] },
      evening: { positive: ["tal", "ronnie"], negative: ["shahar"] },
    },
    wednesday: {
      morning: { positive: ["shahar"], negative: [] },
      evening: { positive: ["nitsan", "shahar"], negative: ["tal"] },
    },
    thursday: {
      morning: { positive: ["imma"], negative: ["ronnie", "shahar"] },
      evening: { positive: ["shahar"], negative: ["ronnie"] },
    },
    friday: {
      morning: { positive: [], negative: [] },
      evening: { positive: ["ronnie", "tal", "shahar", "nitsan"], negative: ["imma"] },
    },
    saturday: {
      morning: { positive: ["imma", "ronnie", "nitsan", "shahar"], negative: ["tal"] },
      evening: { positive: [], negative: ["tal"] },
    },
  },
  "May 26, 2024": {
    sunday: {
      morning: { positive: ["tal", "ronnie", "imma"], negative: ["nitsan"] },
      evening: { positive: ["shahar"], negative: ["nitsan"] },
    },
    monday: {
      morning: { positive: ["nitsan", "shahar"], negative: ["tal"] },
      evening: { positive: ["ronnie", "nitsan"], negative: ["imma"] },
    },
    tuesday: {
      morning: { positive: ["nitsan", "shahar", "ronnie", "imma"], negative: ["tal"] },
      evening: { positive: ["imma", "shahar", "ronnie"], negative: ["tal", "nitsan"] },
    },
    wednesday: {
      morning: { positive: ["shahar", "nitsan"], negative: [] },
      evening: { positive: ["imma", "shahar", "tal", "nitsan"], negative: ["ronnie"] },
    },
    thursday: {
      morning: { positive: ["tal", "ronnie"], negative: ["nitsan", "imma"] },
      evening: { positive: ["imma", "ronnie", "nitsan"], negative: ["shahar"] },
    },
    friday: {
      morning: { positive: ["nitsan", "ronnie"], negative: ["imma"] },
      evening: { positive: [], negative: [] },
    },
    saturday: {
      morning: { positive: [], negative: [] },
      evening: { positive: [], negative: ["imma"] },
    },
  },
};

export const FullToTheMaxExample: ManyWeeksData = {
  "May 19, 2024": {
    sunday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    monday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    tuesday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    wednesday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    thursday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    friday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    saturday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
  },
  "May 26, 2024": {
    sunday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    monday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    tuesday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    wednesday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    thursday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    friday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
    saturday: {
      morning: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
      evening: { positive: ["imma", "nitsan", "tal", "ronnie", "shahar"], negative: [] },
    },
  },
};
