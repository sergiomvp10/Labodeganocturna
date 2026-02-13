import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import AllProducts from "@/components/AllProducts";
import OffersSection from "@/components/OffersSection";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <OffersSection />
      <AllProducts />
    </>
  );
}
