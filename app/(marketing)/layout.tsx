import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-full flex flex-col bg-background dark:bg-[#1F1F1F]">
    <Navbar />
    <main className="h-full flex-grow pt-40">{children}</main>
    <Footer />
  </div>
);

export default MarketingLayout;
