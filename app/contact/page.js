import ContactList from "../components/ContactList";
import EmailForm from "../components/EmailForm";

// export const metadata = {
//   title: 'Contact Me | Moises Trejo',
//   description: 'Get in touch with me through various social media platforms or send me an email directly.',
//   openGraph: {
//     title: 'Contact Me | Moises Trejo',
//     description: 'Get in touch with me through various social media platforms or send me an email directly.'
//   }
// }

const Page = () => {
  return (
    <div>
      <ContactList />
      <EmailForm />
    </div>
  );
};

export default Page;
