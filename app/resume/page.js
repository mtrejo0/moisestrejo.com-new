import Resume from "./Resume";

export const metadata = {
  title: "Resume | Moises Trejo",
  description:
    "View my professional resume detailing my skills, experience, and qualifications. Download or preview my CV to learn more about my background.",
  openGraph: {
    title: "Resume | Moises Trejo",
    description:
      "View my professional resume detailing my skills, experience, and qualifications. Download or preview my CV to learn more about my background.",
  },
};

const Page = () => {
  return (
    <div>
      <Resume />
    </div>
  );
};

export default Page;
