import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact | My Blog",
  description: "Get in touch with me",
};

export default function ContactPage() {
  return <ContactForm />;
}
