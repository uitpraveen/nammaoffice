import type { Metadata } from "next";
import "@/components/studio/studio.css";
export const metadata: Metadata = {title:"Content studio",robots:{index:false,follow:false}};
export default function AdminLayout({children}:{children:React.ReactNode}){return children;}
