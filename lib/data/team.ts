import type { TeamMember } from "@/lib/types";
import { wix } from "@/lib/data/wix-pool";

export const team: TeamMember[] = [
  {
    name: "Founder & CEO",
    role: "Founder & Chief Executive Officer",
    photo: wix.team,
    bio: "Visionary entrepreneur who identified the coworking opportunity in Tamil Nadu's tier-2 cities and built NammaOffice from the ground up across Salem, Trichy, and Tirupur.",
  },
  {
    name: "Operations Head",
    role: "Head of Operations",
    photo: wix.team,
    bio: "Ensures seamless operations across all 7 NammaOffice centres, maintaining the highest standards of service and member experience.",
  },
  {
    name: "Sales Director",
    role: "Director of Sales & Partnerships",
    photo: wix.team,
    bio: "Drives enterprise and franchise partnerships, helping businesses of all sizes find the perfect workspace solution at NammaOffice.",
  },
  {
    name: "Community Manager",
    role: "Community & Events Manager",
    photo: wix.team,
    bio: "Builds the NammaOffice community through networking events, workshops, and member-centric initiatives across all centres.",
  },
];

export const milestones = [
  {
    year: "2019",
    title: "Founded in Salem",
    description:
      "NammaOffice opened its first coworking centre on Brindavan Road, Salem, with 50 seats and a vision to transform how Tamil Nadu works.",
  },
  {
    year: "2020",
    title: "Resilience Through the Pandemic",
    description:
      "Adapted quickly to serve remote workers and hybrid teams, introducing flexible day passes and virtual office services.",
  },
  {
    year: "2021",
    title: "Salem Expansion",
    description:
      "Opened 2 new centres in Salem — Ramakrishna Road and New Bus Stand — responding to growing demand from Salem's MSME community.",
  },
  {
    year: "2022",
    title: "Entered Trichy & Tirupur",
    description:
      "Expanded beyond Salem with flagship centres at Asha Grand (Trichy) and TIDEL NEO (Tirupur), establishing a 3-city presence.",
  },
  {
    year: "2023",
    title: "TIDEL NEO Salem & Fort Hosur",
    description:
      "Partnered with TIDEL NEO in Salem's IT corridor and opened the Fort Hosur centre, bringing the total to 7 centres.",
  },
  {
    year: "2024",
    title: "500+ Members & Franchise Launch",
    description:
      "Crossed 500 active members and launched the NammaOffice franchise programme to accelerate growth across Tamil Nadu.",
  },
];
