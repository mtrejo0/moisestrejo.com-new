import React, { useState } from "react";

export default function EmailForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    fetch("https://formcarry.com/s/gTPAiMPp8kG", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.code === 200) {
          setSuccess(true);
          setName("");
          setEmail("");
          setMessage("");
        } else if (response.code === 422) {
          setError(response.message);
        } else {
          setError(response.message);
        }
      })
      .catch((error) => {
        setError(error.message ? error.message : error);
      });
  }

  return (
    <form
      onSubmit={(e) => onSubmit(e)}
      className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        How can I help?
      </h2>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Thank you for your message! I&apos;ll get back to you soon.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          placeholder="Your first and last name"
          className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:ring-blue-100"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          placeholder="john@doe.com"
          className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:ring-blue-100"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-gray-700 font-bold mb-2">
          Your Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="message"
          placeholder="Enter your message..."
          className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:ring-blue-100 h-32"
          required
        ></textarea>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}
