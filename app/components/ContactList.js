'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import contact from '../../public/information/contact.json';
import links from '../../public/information/links.json';

const ListItems = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index} className="mb-2">
          {item.link ? (
            <Link href={item.link} target="_blank" rel="noopener noreferrer" className="text-black hover:underline">
              <div>{item.name}</div>
            </Link>
          ) : (
            <div>{item.name}</div>
          )}
        </li>
      ))}
    </ul>
  );
};

const ContactList = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center mt-16">
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-8`}>
        <div>
          <h2 className="text-center text-2xl font-bold mb-4">Connect</h2>
          <div className="flex flex-col items-center space-y-2 mb-8">
            <ListItems items={contact} />
          </div>
        </div>
        <div>
          <h2 className="text-center text-2xl font-bold mb-4">Quick Links</h2>
          <div className="flex flex-col items-center space-y-2 mb-8">
            <ListItems
              items={links
                .filter((each) => !each.link.includes("calendly"))
                .flatMap((link) => link.ids)
                .map((each) => ({
                  link: `/${each}`,
                  name: `moisestrejo.com/${each}`,
                }))}
            />
          </div>
        </div>
      </div>

      {/* {[
        { text: "moisestrejo.com/contact", imgSrc: "/images/qr-code.png" },
        { text: "moisestrejo.com/linkedin", imgSrc: "/images/linkedinQR.png" },
      ].map((item, index) => (
        <div key={index} className="flex flex-col items-center mb-32">
          <p className="mb-4">{item.text}</p>
          <Image
            src={item.imgSrc}
            alt="qr-code"
            width={isMobile ? 300 : 400}
            height={isMobile ? 300 : 400}
            className="w-auto h-auto"
          />
        </div>
      ))} */}
    </div>
  );
};

export default ContactList;
