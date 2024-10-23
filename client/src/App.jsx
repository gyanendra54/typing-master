import { useState, useEffect, useRef } from 'react';

// Sample texts for English and Hindi
const texts = {
  english: [
    "The quick brown fox jumps over the lazy dog, showcasing agility and speed in its movements. The fox, known for its intelligence, swiftly maneuvers around obstacles, highlighting its graceful nature. Meanwhile, the lazy dog, representing calmness and relaxation, lies undisturbed by the fox's energetic performance. This classic sentence is often used for typing exercises because it contains every letter of the alphabet, making it a perfect practice for developing typing skills. The quick movements of the fox and the serene state of the dog create a simple yet meaningful image of balance and contrast.",
    "React and Vite are a powerful combination for modern web development, streamlining the development process by offering speed, flexibility, and efficiency. React, a popular JavaScript library for building user interfaces, allows developers to create dynamic, component-based web applications with ease. Paired with Vite, a modern build tool that offers blazing-fast bundling and hot module replacement, developers can significantly improve their workflow. Vite’s speed and ease of use enhance React's flexibility, making the development process smoother and faster. Together, they provide an optimal environment for creating responsive and interactive web applications in record time.",
    "JavaScript is a versatile and ubiquitous programming language that plays a pivotal role in modern web development. Known for its flexibility, it can be used on both the front-end, creating dynamic and interactive user interfaces, and the back-end, managing server-side logic. With the advent of Node.js, JavaScript extended its reach to back-end development, allowing developers to use a single language for full-stack development. JavaScript's versatility is further amplified by its ecosystem of libraries and frameworks, such as React, Angular, and Express.js, making it one of the most powerful languages in the world of software development.",
    "Typing speed tests help improve your accuracy and WPM.",
    "Web development involves both client-side and server-side technologies."
  ],
  hindi: [
    "सभी मनुष्यों को गौरव और अधिकारों के मामले में समान पैदा किया गया है।",
    "भारत की स्वतंत्रता 15 अगस्त 1947 को मिली थी।",
    "राष्ट्रपिता महात्मा गांधी का जन्म 2 अक्टूबर 1869 को हुआ था।",
    "विकास की गति को तेज़ करने के लिए नवाचार आवश्यक है।",
    "भारत की विविधता में एकता उसकी ताकत है।"
  ]
};

function App() {
  const [language, setLanguage] = useState("english"); // Default language is English
  const [text, setText] = useState("");
  const [time, setTime] = useState(60); // Time in seconds
  const [isStarted, setIsStarted] = useState(false);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [sampleText, setSampleText] = useState(texts.english[0]); // Set the initial text
  const [timer, setTimer] = useState(null);
  const [showResult, setShowResult] = useState(false); // For showing results after the test
  const inputRef = useRef(null);

  // Reset the game
  const resetGame = () => {
    setIsStarted(false);
    setText("");
    setTime(60);
    setWordsTyped(0);
    setCorrectChars(0);
    clearInterval(timer);
    setShowResult(false); // Hide result when resetting
    inputRef.current.disabled = false;
    inputRef.current.focus();
  };

  // Start typing test
  const startGame = () => {
    if (!isStarted) {
      setIsStarted(true);
      setTime(60);
      setWordsTyped(0);
      setCorrectChars(0);
      setShowResult(false); // Hide result if restarting
      const newTimer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(newTimer);
            setShowResult(true); // Show result when time is up
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      setTimer(newTimer);
      inputRef.current.disabled = false;
      inputRef.current.focus();
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    const words = value.trim().split(" ");
    setWordsTyped(words.filter(Boolean).length);

    // Calculate correct characters
    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === sampleText[i]) {
        correct++;
      }
    }
    setCorrectChars(correct);

    // Check if the user has finished typing the sample text
    if (value === sampleText) {
      clearInterval(timer); // Stop the timer when the text matches
      setShowResult(true); // Show the result
      inputRef.current.disabled = true; // Disable further typing
    }
  };

  // Calculate WPM
  const calculateWPM = () => {
    return Math.round((wordsTyped / (60 - time)) * 60);
  };

  // Calculate accuracy
  const calculateAccuracy = () => {
    if (text.length === 0) return 100;
    return Math.round((correctChars / text.length) * 100);
  };

  useEffect(() => {
    if (time === 0) {
      inputRef.current.disabled = true;
    }
  }, [time]);

  // Choose a random sample text for a new test based on language
  const giveAnotherTest = () => {
    const randomText = texts[language][Math.floor(Math.random() * texts[language].length)];
    setSampleText(randomText); // Update the sample text
    resetGame(); // Reset the game for a new test
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setSampleText(texts[selectedLanguage][0]); // Set the first sample text of the selected language
    resetGame(); // Reset for a fresh start with the new language
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat relative" 
      style={{ backgroundImage: `url('https://media.istockphoto.com/id/1157477242/photo/business-economic-and-technology-working-concept-close-up-keyboard-notebook-with-window-light.jpg?s=1024x1024&w=is&k=20&c=pZHJBW-T0WH2JetWz1BSZv4JyaeBI6H7xjeEJdtZKk8=')` }} // Add background image link here
    >
      {/* Logo */}
      <img 
        src="https://cdn-1.webcatalog.io/catalog/typingtest-com/typingtest-com-icon-filled-256.webp?v=1714776285985" // Add logo image link here
        alt="Typing Test Logo" 
        className="w-24 h-24 mb-6 rounded-full" 
      />

      <h1 className="text-4xl font-bold mb-4  ">Typing Test</h1>

      {/* Language Selection */}
      <div className="mb-4">
        <label htmlFor="language" className="mr-2 text-blue-800 font-medium">Choose Language:</label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="border p-2 rounded-md"
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>
      </div>

      {/* Sample text displayed */}
      <p className="text-lg mb-4 bg-white p-4 rounded-md shadow-lg w-full max-w-2xl text-center font-semibold text-gray-700">{sampleText}</p>

      {/* Text area to start the test */}
      <textarea
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onFocus={startGame} // Start the game when the text area is clicked/focused
        className="border p-4 w-full max-w-2xl h-32 text-lg mb-4 rounded-md shadow-lg"
        disabled={time === 0 || showResult} // Prevent typing if the time is up or test is done
        placeholder="Click here to start typing..."
      />

      {/* Timer and statistics */}
      <div className="mb-4 text-blue text-lg">
        <p className="font-bold text-red-600">Time Remaining: {time} seconds</p>
        <p>Words Typed: {wordsTyped}</p>
        <p>WPM: {isStarted && time > 0 ? calculateWPM() : 0}</p>
        <p className='text-green-400'>Accuracy: {calculateAccuracy()}%</p>
      </div>

      {/* Buttons on Left and Right sides */}
      <div className="absolute left-0 bottom-8">
        <button
          onClick={resetGame}
          className="bg-red-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-red-600 transition duration-300 ml-8"
        >
          Reset Test
        </button>
      </div>

      <div className="absolute right-0 bottom-8">
        <button
          onClick={giveAnotherTest}
          className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600 transition duration-300 mr-8"
        >
          Give Another Test
        </button>
      </div>

      {/* Show Results after the test ends */}
      {showResult && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Test Results</h2>
          <p className="text-lg text-gray-700">Words Per Minute (WPM): <span className="font-bold">{calculateWPM()}</span></p>
          <p className="text-lg text-gray-700">Accuracy: <span className="font-bold">{calculateAccuracy()}%</span></p>
        </div>
      )}
    </div>
  );
}

export default App;
