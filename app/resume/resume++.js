"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from "lucide-react";

const sections = [
  { name: "Work Experience", id: "work" },
  { name: "Education", id: "education" },
  { name: "Projects", id: "projects" },
  { name: "Leadership", id: "leadership" },
  { name: "Skills", id: "skills" },
  { name: "Awards & Honors", id: "awards" },
  { name: "Press", id: "press" },
];

export default function ResumePlusPlus() {
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = {};
        await Promise.all(
          sections.map(async (section) => {
            const response = await fetch(`/information/${section.id}.json`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            data[section.id] = await response.json();
          }),
        );
        setSectionData(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          data={sectionData[section.id]}
        />
      ))}
    </div>
  );
}

function Section({ section, data }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!data) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center w-full text-left text-2xl font-bold mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        aria-expanded={isExpanded}
      >
        <span>{section.name}</span>
        {isExpanded ? (
          <ChevronUpIcon className="h-6 w-6" />
        ) : (
          <ChevronDownIcon className="h-6 w-6" />
        )}
      </button>
      {isExpanded && (
        <ul className="space-y-6">
          {data.map((item, index) => (
            <ResumeItem key={`${item.name}-${index}`} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ResumeItem({ item }) {
  return (
    <li className="border-l-4 border-gray-200 pl-4 transition-all duration-300 hover:border-blue-500">
      <h3 className="text-xl font-semibold">{item.name}</h3>
      <p className="text-gray-600">{item.year}</p>
      {item.description && item.description.length > 0 && (
        <ul className="list-disc list-inside mt-2 space-y-1">
          {item.description.map((desc, index) =>
            desc.length ? (
              <li key={index} className="text-gray-700">
                {desc}
              </li>
            ) : null,
          )}
        </ul>
      )}
      {item.links && item.links.length > 0 && (
        <ul className="mt-2 space-y-1">
          {item.links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.link}
                className="text-blue-500 hover:underline inline-flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.name}
                <ExternalLinkIcon className="ml-1 h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {item.sub_items && item.sub_items.length > 0 && (
        <ul className="mt-4 space-y-4">
          {item.sub_items.map((subItem, index) => (
            <ResumeItem key={`${subItem.name}-${index}`} item={subItem} />
          ))}
        </ul>
      )}
    </li>
  );
}
