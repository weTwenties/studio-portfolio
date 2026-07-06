export type CaseStudy = {
  kicker: string;
  title: string;
  text: string;
  points: string[][];
  images?: { url: string }[];
};

export type CaseStudiesMap = Record<string, CaseStudy>;
