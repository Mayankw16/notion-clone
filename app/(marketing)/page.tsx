import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";

const MarketingPage = () => {
  return (
    <div className="flex flex-col items-center gap-y-8 text-center px-6 pb-10">
      <Heading />
      <Heroes />
    </div>
  );
};

export default MarketingPage;
