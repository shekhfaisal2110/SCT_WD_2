// Full React Calculator App with Toggle Mode (Auto/Manual), Theme Switcher
// By Faisal Shaikh | SkillCraft Internship Task 02

import { useState, useEffect } from 'react';
import { FaBackspace, FaEquals, FaMoon, FaSun } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const buttons = [
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', 'C', '+',
];

const scientific = [
  'sin', 'cos', 'tan', 'log', 'sqrt', '^', '(', ')'
];

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [autoMode, setAutoMode] = useState(true);
  const [theme, setTheme] = useState('dark');

  const evaluateInput = (expression) => {
    try {
      const evalResult = eval(expression);
      setResult(evalResult);
      setError('');
    } catch {
      setResult('Error');
      setError('Invalid expression.');
    }
  };

  const handleClick = (val) => {
    setError('');
    if (val === 'C') {
      setInput('');
      setResult('');
    } else if (val === '^') {
      const newInput = input + '**';
      setInput(newInput);
      if (autoMode) evaluateInput(newInput);
    } else if (val === 'sqrt') {
      const newInput = input + 'Math.sqrt(';
      setInput(newInput);
    } else if (['sin', 'cos', 'tan', 'log'].includes(val)) {
      const fn = val === 'log' ? 'Math.log10(' : `Math.${val}(`;
      const newInput = input + fn;
      setInput(newInput);
    } else {
      const newInput = input + val;
      setInput(newInput);
      if (autoMode) evaluateInput(newInput);
    }
  };

  const handleBackspace = () => {
    const updated = input.slice(0, -1);
    setInput(updated);
    if (autoMode && updated.trim()) {
      evaluateInput(updated);
    } else {
      setResult('');
    }
  };

  const calculateResult = () => {
    if (input.trim() === '') {
      setResult('');
      setError('Please enter a value before calculating.');
      return;
    }
    evaluateInput(input);
  };

  const handleKeyDown = (e) => {
    if ((/[0-9+\-*/.]/).test(e.key)) {
      const newInput = input + e.key;
      setInput(newInput);
      if (autoMode) evaluateInput(newInput);
    } else if (e.key === 'Enter') {
      calculateResult();
    } else if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Escape') {
      setInput('');
      setResult('');
      setError('');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, autoMode]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const themeClasses = theme === 'dark'
    ? 'bg-gradient-to-br from-[#0e0e0e] via-[#181818] to-[#1c1c1c] text-white'
    : 'bg-gradient-to-br from-[#f0f0f0] via-[#ffffff] to-[#e2e2e2] text-black';

  return (
    <section id="calculator" className={`min-h-screen ${themeClasses} flex items-center justify-center p-6`}>
      <motion.div
        className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-700 dark:border-[#2f2f2f]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-500">🧮 Calculator App</h2>
          <div className="flex gap-3 items-center">
            <button onClick={toggleTheme} className="text-xl hover:text-yellow-500">
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <button
            className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 rounded-full text-white text-sm font-medium transition"
            onClick={() => setAutoMode(!autoMode)}
          >
            Mode: {autoMode ? 'Auto' : 'Manual'} (Click to switch)
          </button>
        </div>

        <div className="bg-black/20 p-4 rounded-xl mb-4">
          <div className="text-right text-lg break-words min-h-[48px]">{input || '0'}</div>
          <AnimatePresence>
            {result !== '' && (
              <motion.div
                key={result}
                className="text-right text-2xl font-bold mt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                = {result}
              </motion.div>
            )}
          </AnimatePresence>
          {error && <p className="text-red-500 text-sm mt-2 text-right">{error}</p>}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              className="bg-[#2c2c2c] hover:bg-cyan-600 text-white py-3 rounded-xl text-xl font-semibold shadow-inner"
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {scientific.map((btn, idx) => (
            <button
              key={idx}
              className="bg-[#3a3a3a] hover:bg-purple-600 text-white py-2 rounded-xl text-sm font-medium"
              onClick={() => handleClick(btn)}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-5 rounded-xl text-xl font-bold shadow"
            onClick={handleBackspace}
          >
            <FaBackspace />
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl text-xl font-bold shadow"
            onClick={calculateResult}
          >
            <FaEquals />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default Calculator;