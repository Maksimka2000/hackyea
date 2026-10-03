import { notFound } from "next/navigation";

/** Any address no other page serves ends here, so the visitor sees the localized 404 page inside the site layout. */
export default function Page() {
  notFound();
}
