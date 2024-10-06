'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(0);

  const interests = [
    "Computer Science",
    "Design",
    "Entrepreneurship",
    "Making: 3D printing, laser cutting, embedded systems",
    "Cooking",
    "Art and its various forms: Painting, Digital Design",
    "Sports: Kickboxing, Brazilian Jiu Jitsu, Basketball, Soccer",
    "Dancing: Contemporary Dance, Salsa, Merengue, Cumbias, Breakdancing",
    "Skateboarding",
    "Philosophy, Ethics, Theology, Psychology",
    "Anthropology",
    "Natural Sciences: Mathematics, Chemistry, Biology, Physics",
    "Music: Music Producing, DJing",
    "Comedy",
    "Video Editing",
    "Literature",
    "Urban Planning",
    "the list goes on...",
  ];

  useEffect(() => {
    axios
      .get(`https://2r2wddk4i6.execute-api.us-east-2.amazonaws.com/test`)
      .then((res) => {
        setLoading(false);
        setUsers(res.data.body.userCount);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-12">
        <div className="flex flex-col items-center mb-6">
          <Image
            alt="Moises Trejo"
            src="/images/portrait.png"
            width={200}
            height={200}
            className="rounded-full border-4 border-white shadow-lg mb-6"
          />
          <h1 className="text-3xl font-bold text-center mb-2">Moises Trejo</h1>
          <p className="text-lg text-center">
            You are the {loading ? "Loading..." : users.toLocaleString()}th
            person to visit this page!
          </p>
        </div>
        <h2 className="text-2xl font-semibold mb-4">A little about me:</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Software Engineer at Instacart on the Catalog Enrichment Team</li>
          <li>Based in Dallas, Texas</li>
          <li>MIT Class of 2022 BS in Computer Science</li>
          <li>Enjoy cooking Mexican food and working out</li>
          <li>Love making generative art using P5.js</li>
          <li>Enjoy building:
            <ul className="list-disc list-inside ml-6">
              <li>Health and wellness tech</li>
              <li>Applicant filtering web apps</li>
              <li>Music and rhyming tech</li>
              <li>Productivity tools</li>
              <li>Data visualization projects</li>
              <li>Social impact applications</li>
            </ul>
          </li>
        </ul>
        <h2 className="text-2xl font-semibold mb-4">I love all of the following:</h2>
        <ul className="list-disc list-inside space-y-2">
          {interests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
