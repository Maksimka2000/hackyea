/*
  Decorative ring behind the hero. It stretches from under the utility bar down to the hero's bottom edge
  and keeps a 1:1 ratio, so its size follows the hero height and it always stays a circle.
  Stacking: utility bar (z-20) > header content (z-10) > this ring > hero background.
*/
export function HeroDecoration() {
  return (
    <div
      aria-hidden="true"
      className="contrast-high:hidden pointer-events-none absolute -top-32 right-0 bottom-0 aspect-square max-h-[28rem] translate-x-[30%] rounded-full border-2 border-hero-foreground/20 shadow-[0_0_0_3rem] shadow-hero-foreground/5"
    />
  );
}
