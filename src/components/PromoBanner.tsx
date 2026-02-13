export default function PromoBanner() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-brand-gold overflow-hidden">
      <div
        className="whitespace-nowrap py-2 text-sm font-semibold text-brand-black tracking-wide"
        style={{ animation: "marquee 18s linear infinite" }}
      >
        Obtén envío gratis por tus compras mayores a $150.000 &nbsp;&nbsp;&nbsp;★&nbsp;&nbsp;&nbsp; Obtén envío gratis por tus compras mayores a $150.000 &nbsp;&nbsp;&nbsp;★&nbsp;&nbsp;&nbsp; Obtén envío gratis por tus compras mayores a $150.000 &nbsp;&nbsp;&nbsp;★&nbsp;&nbsp;&nbsp; Obtén envío gratis por tus compras mayores a $150.000
      </div>
    </div>
  );
}
