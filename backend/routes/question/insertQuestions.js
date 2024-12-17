

import Question from '../../models/questionSchema.js';

export const insertQuestions = async () => {
  try {
    const questions = [{
      questionText: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'A',
      category: 'General Knowledge',
    },
    {
      questionText: 'What is the capital of India?',
      options: ['Mumbai', 'New Delhi', 'Chennai', 'Kolkata'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'Who was the first Prime Minister of India?',
      options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Indira Gandhi'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'Which Indian state is known as the "Land of Five Rivers"?',
      options: ['Rajasthan', 'Punjab', 'Kerala', 'Uttar Pradesh'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'What is the national animal of India?',
      options: ['Lion', 'Tiger', 'Elephant', 'Peacock'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'Who wrote the Indian national anthem?',
      options: ['Rabindranath Tagore', 'Bankim Chandra Chatterjee', 'Subhash Chandra Bose', 'Sarojini Naidu'],
      correctAnswer: 'A',
      category: 'General Knowledge',
    },
    {
      questionText: 'Which is the longest river in India?',
      options: ['Ganga', 'Brahmaputra', 'Yamuna', 'Godavari'],
      correctAnswer: 'A',
      category: 'General Knowledge',
    },
    {
      questionText: 'What is the official language of India?',
      options: ['Hindi', 'English', 'Sanskrit', 'Both Hindi and English'],
      correctAnswer: 'D',
      category: 'General Knowledge',
    },
    {
      questionText: 'In which year did India gain independence?',
      options: ['1945', '1947', '1950', '1952'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'What is the currency of India?',
      options: ['Rupee', 'Dollar', 'Pound', 'Yen'],
      correctAnswer: 'A',
      category: 'General Knowledge',
    },
    {
      questionText: 'Which Indian city is known as the "Silicon Valley of India"?',
      options: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Chennai'],
      correctAnswer: 'C',
      category: 'General Knowledge',
    },
    {
      questionText: 'Who is known as the "Father of the Nation" in India?',
      options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Subhash Chandra Bose', 'Bhagat Singh'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'Which festival is known as the "Festival of Lights" in India?',
      options: ['Holi', 'Diwali', 'Eid', 'Pongal'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'Who is known as the "King of Bollywood"?',
      options: ['Amitabh Bachchan', 'Salman Khan', 'Shah Rukh Khan', 'Aamir Khan'],
      correctAnswer: 'C',
      category: 'Cinema',
    },
    {
      questionText: 'Which was the first Indian sound film?',
      options: ['Alam Ara', 'Raja Harishchandra', 'Mother India', 'Mughal-e-Azam'],
      correctAnswer: 'A',
      category: 'Cinema',
    },
    {
      questionText: 'Who is referred to as the "Tragedy King" of Bollywood?',
      options: ['Dilip Kumar', 'Raj Kapoor', 'Dev Anand', 'Guru Dutt'],
      correctAnswer: 'A',
      category: 'Cinema',
    },
    {
      questionText: 'Which Bollywood movie is the highest-grossing film of all time (as of 2023)?',
      options: ['Dangal', 'RRR', 'Pathaan', 'Baahubali: The Conclusion'],
      correctAnswer: 'C',
      category: 'Cinema',
    },
    {
      questionText: 'Who composed the music for the iconic Bollywood film "Dilwale Dulhania Le Jayenge"?',
      options: ['A.R. Rahman', 'Jatin-Lalit', 'Shankar-Ehsaan-Loy', 'Anu Malik'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Which actress is known as the "Dream Girl" of Bollywood?',
      options: ['Madhuri Dixit', 'Hema Malini', 'Sridevi', 'Rekha'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Who directed the Bollywood classic "Sholay"?',
      options: ['Yash Chopra', 'Ramesh Sippy', 'Raj Kapoor', 'Karan Johar'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Which Bollywood actor has the nickname "Bhai"?',
      options: ['Shah Rukh Khan', 'Salman Khan', 'Aamir Khan', 'Akshay Kumar'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Which Bollywood movie won India’s first Oscar?',
      options: ['Mother India', 'Slumdog Millionaire', 'Gandhi', 'Lagaan'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Who was the first female superstar of Bollywood?',
      options: ['Madhubala', 'Sridevi', 'Rekha', 'Meena Kumari'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Which actor is famous for the dialogue "Kitne aadmi the?" in "Sholay"?',
      options: ['Amitabh Bachchan', 'Amjad Khan', 'Sanjeev Kumar', 'Dharmendra'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Who is the founder of Dharma Productions?',
      options: ['Aditya Chopra', 'Karan Johar', 'Yash Johar', 'Subhash Ghai'],
      correctAnswer: 'C',
      category: 'Cinema',
    }
    
    
    ];

    await Question.insertMany(questions);
    console.log('Question inserted successfully!');
  } catch (error) {
    console.error('Error inserting question:', error);
  } 
};
